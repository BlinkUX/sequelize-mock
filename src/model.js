'use strict';

/**
 * This is the base mock Model class that will be the primary way to use Sequelize Mock.
 * 
 * Mock Models should mostly behave as drop-in replacements for your Sequelize Models
 * when running unit tests for your code.
 * 
 * @name Model
 * @fileOverview The base mock Model object for use in tests
 */

var Promise = require('bluebird'),
	_ = require('lodash'),
	nodeutil = require('util'),
	Utils = require('./utils'),
	Instance = require('./instance'),
	QueryInterface = require('./queryinterface');

/**
 * Model mock class. Models most often should be defined using the `sequelize.define()`
 * function.
 * 
 * @class Model
 * @constructor
 * @param {Object} name Name of the model
 * @param {Object} [defaults={}] The default values to use when creating a new instance
 * @param {Object} [opts] Options for the mock model
 * @param {Object} [opts.instanceMethods] Map of function names and the functions to be run. These functions will be added to any instances of this Model type
 * @param {Object} [opts.sequelize] Sequelize instance that this is tied to
 **/
function fakeModel (name, defaults, opts) {
	if(typeof name === 'object') {
		defaults = name;
		name = '';
	}
	
	var self = this;
	
	/**
	 * The current options for the model
	 * 
	 * @member {Object}
	 **/
	this.options = _.extend({
		hasPrimaryKeys: true,
		timestamps: true,
		instanceMethods: {},
		classMethods: {},
		freezeTableName: false,
		stopPropagation: false,
		createdDefault: true,
		autoQueryFallback: true,
	}, _.pick(
		// Pick options that cascade down from the sequelize options object
		opts && opts.sequelize ? opts.sequelize.options : {},
		[
			'autoQueryFallback',
			'stopPropagation',
			'fallbackFn',
		]
	), opts || {});
	
	/**
	 * Name given to the model on initialization
	 * 
	 * @member {String}
	 **/
	this.name = name;
	this._defaults = defaults || {};
	
	this.tableName = this.options.tableName || (this.options.freezeTableName ? name : Utils.pluralize(name));
	
	/**
	 * The Model's copy of the Instance class used to build instances
	 * 
	 * @member {Object}
	 **/
	this.Instance = function() {
		Instance.apply(this, arguments);
	};
	nodeutil.inherits(this.Instance, Instance);
	
	if(this.options.instanceMethods) {
		_.each(this.options.instanceMethods, function (fn, name) {
			self.Instance.prototype[name] = fn;
		});
	}
	this.Instance.prototype.Model = this;
	
	// Setup Model QueryInterface
	var qiOptions = {
		stopPropagation: this.options.stopPropagation,
		createdDefault: this.options.createdDefault,
		fallbackFn: !this.options.autoQueryFallback ? this.build.bind(this) : null,
	};
	if(this.options.sequelize) {
		qiOptions.parent = this.options.sequelize.getQueryInterface();
	}
	/**
	 * QueryInterface used to run all queries against for models
	 * 
	 * If this model is defined with the `Sequelize.define` method, this QueryInterface
	 * will reference the calling `Sequelize` instances QueryInterface when inheriting
	 * any options or propagating any queries.
	 * 
	 * @member {QueryInterface}
	 **/
	this.$queryInterface = new QueryInterface(qiOptions);
	
	// Setup QueryInterface method calls
	/**
	 * Queues a result for any query run against this model. This result will be wrapped
	 * in a Promise and resolved for most any method that would ordinarily run a query
	 * against the database.
	 * 
	 * @example
	 * UserMock.$queueResult(UserMock.build({
	 * 	name: 'Alex',
	 * }));
	 * UserMock.findOne().then(function (result) {
	 * 	// `result` is the passed in built object
	 * 	result.get('name'); // 'Alex'
	 * });
	 * 
	 * // For `findOrCreate` there is an extra option that can be passed in
	 * UserMock.$queueResult(UserMock.build(), { wasCreated: false });
	 * UserMock.findOrCreate({
	 * 	// ...
	 * }).spread(function (user, created) {
	 * 	// created == false
	 * });
	 * 
	 * @instance
	 * @method $queueResult
	 * @see {@link ./queryinterface.md#queueResult|QueryInterface.$queueResult}
	 * @param {Any} result The object or value to be returned as the result of a query
	 * @param {Object} [options] Options used when returning the result
	 * @param {Boolean} [options.wasCreated] Optional flag if a query requires a `created` value in the return indicating if the object was "created" in the DB
	 * @param {Array<Any>} [options.affectedRows] Optional array of objects if the query requires an `affectedRows` return value
	 * @return {QueryInterface} model instance of QueryInterface
	 **/
	this.$queueResult = this.$queryInterface.$queueResult.bind(this.$queryInterface);
	/**
	 * Queues an error/failure for any query run against this model. This error will be wrapped
	 * in a rejected Promise and be returned for most any method that would ordinarily run a
	 * query against the database.
	 * 
	 * @example
	 * UserMock.$queueFailure(new Error('My test error'));
	 * UserMock.findOne().catch(function (error) {
	 * 	error.message; // 'My test error'
	 * });
	 * 
	 * // Non error objects by default are converted to Sequelize.Error objects
	 * UserMock.$queueFailure('Another Test Error');
	 * UserMock.findOne().catch(function (error) {
	 * 	error instanceof UserMock.sequelize.Error; // true
	 * });
	 * 
	 * @instance
	 * @method $queueFailure
	 * @alias $queueError
	 * @see {@link ./queryinterface.md#queueFailure|QueryInterface.$queueFailure}
	 * @param {Any} error The object or value to be returned as the failure for a query
	 * @param {Object} [options] Options used when returning the result
	 * @param {Boolean} [options.convertNonErrors] Flag indicating if non `Error` objects should be allowed. Defaults to true
	 * @return {QueryInterface} model instance of QueryInterface
	 **/
	this.$queueFailure = this.$queueError = this.$queryInterface.$queueFailure.bind(this.$queryInterface);
	/**
	 * Clears any queued results or failures for this Model.
	 * 
	 * @example
	 * UserMock.$queueResult(UserMock.build());
	 * // == 1 item in query queue
	 * UserMock.$queueFailure(new Error());
	 * // == 2 items in query queue
	 * UserMock.$clearQueue();
	 * // == 0 items in query queue
	 * 
	 * @instance
	 * @method $clearQueue
	 * @alias $queueClear
	 * @see {@link ./queryinterface.md#clearQueue|QueryInterface.$clearQueue}
	 * @param {Object} [options] Options used when returning the result
	 * @param {Boolean} [options.propagateClear] Propagate this clear up to any parent `QueryInterface`s. Defaults to false
	 * @return {QueryInterface} model instance of QueryInterface
	 **/
	this.$clearQueue = this.$queueClear = this.$queryInterface.$clearQueue.bind(this.$queryInterface);
	this.$query = this.$queryInterface.$query.bind(this.$queryInterface);
}

/**
 * No-op that returns a promise with the current object
 * 
 * @instance
 * @return {Promise<Model>} Self
 **/
fakeModel.prototype.sync = function () {
	return Promise.resolve(this);
};

/**
 * No-op that returns a promise that always resolves
 * 
 * @instance
 * @return {Promise} Promise that always resolves
 **/
fakeModel.prototype.drop = function () {
	return Promise.resolve();
};

/**
 * Returns the name of the model
 * 
 * @instance
 * @return {String} the name of the model
 **/
fakeModel.prototype.getTableName = function () {
	return this.tableName;
};

/**
 * No-op that returns the current object
 * 
 * @instance
 * @method
 * @return {Model} Self
 **/
fakeModel.prototype.unscoped =
/**
 * No-op that returns the current object
 * 
 * @instance
 * @return {Model} Self
 **/
fakeModel.prototype.scope = function () {
	return this;
};

/**
 * Executes a mock query to find all of the instances with any provided options. Without
 * any other configuration, the default behavior when no queueud query result is present
 * is to create an array of a single result based on the where query in the options and
 * wraps it in a promise.
 * 
 * To turn off this behavior, the `$autoQueryFallback` option on the model should be set
 * to `false`.
 * 
 * @example
 * // This is an example of the default behavior with no queued results
 * // If there is a queued result or failure, that will be returned instead
 * User.findAll({
 * 	where: {
 * 		email: 'myEmail@example.com',
 * 	},
 * }).then(function (results) {
 * 	// results is an array of 1
 * 	results[0].get('email') === 'myEmail@example.com'; // true
 * });
 * 
 * @instance
 * @param {Object} [options] Options for the findAll query
 * @param {Object} [options.where] Values that any automatically created Instances should have
 * @return {Promise<Instance[]>} result returned by the mock query
 **/
fakeModel.prototype.findAll =  function (options) {
	var self = this;
	
	return this.$query({
		query: "findAll",
		queryOptions: arguments,
		fallbackFn: !this.options.autoQueryFallback ? null : function () {
			return Promise.resolve([ self.build(options ? options.where : {}) ]);
		},
	});
};


/**
 * Executes a mock query to find all of the instances with any provided options and also return 
 * the count. Without any other configuration, the default behavior when no queueud query result 
 * is present is to create an array of a single result based on the where query in the options and
 * wraps it in a promise.
 * 
 * To turn off this behavior, the `$autoQueryFallback` option on the model should be set
 * to `false`.
 * 
 * @example
 * // This is an example of the default behavior with no queued results
 * // If there is a queued result or failure, that will be returned instead
 * User.findAndCountAll({
 * 	where: {
 * 		email: 'myEmail@example.com',
 * 	},
 * }).then(function (results) {
 * 	// results is an array of 1
 *  results.count = 1
 * 	results.rows[0].get('email') === 'myEmail@example.com'; // true
 * });
 * 
 * @instance
 * @method findAndCount
 * @alias findAndCountAll
 * @param {Object} [options] Options for the findAll query
 * @param {Object} [options.where] Values that any automatically created Instances should have
 * @return {Promise<Object>} result returned by the mock query
 **/
fakeModel.prototype.findAndCount =
fakeModel.prototype.findAndCountAll =  function (options) {
	var self = this;
	
	return this.$query({
		query: "findAndCountAll",
		queryOptions: arguments,
		fallbackFn: !this.options.autoQueryFallback ? null : function () {
			return Promise.resolve([ self.build(options ? options.where : {}) ])
				.then(function(result){
					return Promise.resolve({
						count: result.length,
						rows: result
					});
				});
		},
	});
};

/**
 * Executes a mock query to find an instance with the given ID value. Without any other
 * configuration, the default behavior when no queueud query result is present is to
 * create a new Instance with the given id and wrap it in a promise.
 * 
 * To turn off this behavior, the `$autoQueryFallback` option on the model should be set
 * to `false`.
 * 
 * @instance
 * @param {Integer} id ID of the instance
 * @return {Promise<Instance>} Promise that resolves with an instance with the given ID
 **/
fakeModel.prototype.findById = function (id) {
	var self = this;
	
	return this.$query({
		query: "findById",
		queryOptions: arguments,
		fallbackFn: !this.options.autoQueryFallback ? null : function () {
			return Promise.resolve( self.build({ id: id }) );
		},
	});
};

/**
 * Executes a mock query to find an instance with the given infomation. Without any other
 * configuration, the default behavior when no queueud query result is present is to
 * build a new Instance with the given properties pulled from the where object in the
 * options and wrap it in a promise.
 * 
 * @example
 * // This is an example of the default behavior with no queued results
 * // If there is a queued result or failure, that will be returned instead
 * User.find({
 * 	where: {
 * 		email: 'myEmail@example.com',
 * 	},
 * }).then(function (user) {
 * 	user.get('email') === 'myEmail@example.com'; // true
 * });
 * 
 * @instance
 * @method findOne
 * @alias find
 * @see {@link findAll}
 * @param {Object} [options] Map of values that the instance should have
 * @return {Promise<Instance>} Promise that resolves with an instance with the given properties
 **/
fakeModel.prototype.find =
fakeModel.prototype.findOne = function (obj) {
	var self = this;
	
	return this.$query({
		query: "findOne",
		queryOptions: arguments,
		fallbackFn: !this.options.autoQueryFallback ? null : function () {
			return Promise.resolve( self.build(obj ? obj.where : {}) );
		},
	});
};

/**
 * Executes a mock query to find the max value of a field. Without any other
 * configuration, the default behavior when no queueud query result is present
 * is to return the default value for the given field
 * 
 * @instance
 * @method
 * @param {String} field Name of the field to return for
 * @return {Any} the default value for the given field
 **/
fakeModel.prototype.max =
/**
 * Executes a mock query to find the min value of a field. Without any other
 * configuration, the default behavior when no queueud query result is present
 * is to return the default value for the given field
 * 
 * @instance
 * @method
 * @param {String} field Name of the field to return for
 * @return {Any} the default value for the given field
 **/
fakeModel.prototype.min =
/**
 * Executes a mock query to find the sum value of a field. Without any other
 * configuration, the default behavior when no queueud query result is present
 * is to return the default value for the given field
 * 
 * @instance
 * @method
 * @param {String} field Name of the field to return for
 * @return {Any} the default value for the given field
 **/
fakeModel.prototype.sum = function (field) {
	var self = this;
	
	return this.$query({
		query: "sum",
		queryOptions: arguments,
		fallbackFn: !this.options.autoQueryFallback ? null : function () {
			return Promise.resolve(self._defaults[field]);
		},
	});
};

/**
 * Builds a new Instance with the given properties
 * 
 * @instance
 * @param {Object} [values] Map of values that the instance should have
 * @param {Object} [options] Options for creating the instance
 * @param {Object} [options.isNewRecord] Flag inidicating if this is a new mock record. Defaults to true
 * @return {Instance} a new instance with any given properties
 **/
fakeModel.prototype.build = function (values, options) {
	options = _.extend({}, options || {}, {
		// Options set from model
		timestamps: this.options.timestamps,
		paranoid: this.options.paranoid,
		createdAt: this.options.createdAt,
		updatedAt: this.options.updatedAt,
		deletedAt: this.options.deletedAt,
	});
	
	if(typeof options.isNewRecord != 'boolean') {
		options.isNewRecord = true;
	}
	
	values = _.extend({}, this._defaults, values);
	
	return new this.Instance(values, options);
};
/**
 * Creates a new Instance with the given properties and triggers a save
 * 
 * @instance
 * @see {@link build}
 * @see Instance.save()
 * @param {Object} options Map of values that the instance should have
 * @return {Promise<Instance>} a promise that resolves after saving a new instance with the given properties
 **/
fakeModel.prototype.create = function (obj) {
	return this.build(obj).save();
};
/**
 * Executes a mock query to find or create an Instance with the given properties. Without
 * any other configuration, the default behavior when no queueud query result is present
 * is to trigger a create action based on the given properties from the where in
 * the options object.
 * 
 * @instance
 * @see {@link findAll}
 * @see {@link create}
 * @param {Object} options Options for the query
 * @param {Object} options.where Map of values that the instance should have
 * @return {Promise<Array<Instance, Boolean>>} Promise that includes the instance and whether or not it was created
 **/
fakeModel.prototype.findOrCreate = function (obj) {
	var self = this;
	
	return this.$query({
		query: "findOrCreate",
		queryOptions: arguments,
		includeCreated: true,
		fallbackFn: !this.options.autoQueryFallback ? null : function () {
			return self.build(obj.where).save().then(function (result) {
					return Promise.resolve([result, true]);
				});
		},
	});
};

/**
 * Executes a mock query to upsert an Instance with the given properties. Without any
 * other configuration, the default behavior when no queueud query result is present is
 * to return the `options.createdDefault` value indicating if a new item has been created
 * 
 * @instance
 * @method upsert
 * @alias insertOrUpdate
 * @param {Object} values Values of the Instance being created
 * @return {Promise<Boolean>} Promise that resolves with a boolean meant to indicate if something was inserted
 **/
fakeModel.prototype.insertOrUpdate =
fakeModel.prototype.upsert = function (values) {
	var self = this;
	
	return this.$query({
		query: "upsert",
		queryOptions: arguments,
		fallbackFn: !this.options.autoQueryFallback ? null : function () {
			return self.build(values).save().return(self.options.createdDefault);
		},
	});
}

/**
 * Executes a mock query to create a set of new Instances in a bulk fashion. Without any
 * other configuration, the default behavior when no queueud query result is present is
 * to trigger a create on each item in a the given `set`.
 * 
 * @instance
 * @see {@link create}
 * @param {Array<Object>} set Set of values to create objects for
 * @return {Promise<Instance[]>} Promise that contains all created Instances
 **/
fakeModel.prototype.bulkCreate = function (set, options) {
	var self = this;
	
	return this.$query({
		query: "bulkCreate",
		queryOptions: arguments,
		fallbackFn: !this.options.autoQueryFallback ? null : function () {
			return Promise.all( _.map(set, self.create.bind(self)) );
		},
	});
};

/**
 * Executes a mock query to destroy a set of Instances. Without any other configuration,
 * the default behavior when no queueud query result is present is to resolve with either
 * the limit from the options or a 1.
 * 
 * @instance
 * @param {Object} [options] Options for the query
 * @param {Number} [options.limit] Number of rows that are deleted
 * @return {Promise<Integer>} Promise with number of deleted rows
 **/
fakeModel.prototype.destroy = function (options) {
	var self = this;
	
	return this.$query({
		query: "destroy",
		queryOptions: arguments,
		fallbackFn: !this.options.autoQueryFallback ? null : function () {
			return Promise.resolve(options && typeof options.limit == 'number' ? options.limit : 1);
		},
	});
};

/**
 * Executes a mock query to update a set of instances. Without any other configuration,
 * the default behavior when no queueud query result is present is to create 1 new
 * Instance that matches the where value from the first parameter and returns a Promise
 * with an array of the count of affected rows (always 1) and the affected rows if the
 * `returning` option is set to true
 * 
 * @instance
 * @param {Object} values Values to build the Instance
 * @param {Object} [options] Options to use for the update
 * @param {Object} [options.returning] Whether or not to include the updated models in the return
 * @return {Promise<Array>} Promise with an array of the number of affected rows and the affected rows themselves if `options.returning` is true
 **/
fakeModel.prototype.update = function (values, options) {
	var self = this;
	options = options || {};
	
	return this.$query({
		query: "update",
		queryOptions: arguments,
		options: options,
		includeAffectedRows: !!options.returning,
		fallbackFn: !this.options.autoQueryFallback ? null : function () {
			if(!options.returning) {
				return Promise.resolve([1]);
			}
			return Promise.resolve([ 1, [self.build(values)] ]);
		},
	});
};

// Noops
fakeModel.prototype.addHook =
fakeModel.prototype.removeHook = function () {};

// Associations
fakeModel.prototype.belongsTo = fakeModel.prototype.hasOne = function (item, options) {
	if(!(item instanceof fakeModel)) {
		return;
	}
	
	var isString = typeof item === 'string',
		name;
	if(options && options.as) {
		name = options.as;
	} else if (isString) {
		name = item;
	} else {
		name = item.getTableName();
	}
	
	var singular = Utils.uppercaseFirst( Utils.singularize(name) ),
		plural = Utils.uppercaseFirst( Utils.pluralize(name) ),
		self = this,
		noop = function () { return Promise.resolve(self); };
	
	if(isString) {
		this.Instance.prototype['get' + singular] = function (opts) { return Promise.resolve(new self.Instance(opts && opts.where ? opts.where : opts)); };
	} else {
		this.Instance.prototype['get' + singular] = item.findOne.bind(item);
	}
	this.Instance.prototype['set' + singular] = noop;
	this.Instance.prototype['create' + singular] = item.create ? item.create.bind(item) : noop;
};

fakeModel.prototype.belongsToMany = fakeModel.prototype.hasMany = function (item, options) {
	if(!(item instanceof fakeModel)) {
		return {
			through: {
				model: new fakeModel(this.getTableName() + (item && item.name ? item.name : 'Association'), {}, { hasPrimaryKeys: false })
			}
		};
	}
	
	var isString = typeof item === 'string',
		name, singular, plural;
	if(options && options.as) {
		name = options.as;
		singular = Utils.uppercaseFirst( Utils.singularize(name) );
		plural = Utils.uppercaseFirst( name );
		
	} else {
		if (isString) {
			name = item;
		} else {
			name = item.getTableName();
		}
		singular = Utils.uppercaseFirst( Utils.singularize(name) );
		plural = Utils.uppercaseFirst( Utils.pluralize(name) );
	}
	
	var self = this,
		noop = function () { return Promise.resolve(self); };
	
	if(isString) {
		this.Instance.prototype['get' + plural] = function (opts) { return Promise.resolve([new self.Instance(opts && opts.where ? opts.where : opts)]); };
	} else {
		this.Instance.prototype['get' + plural] = item.findAll.bind(item);
	}
	this.Instance.prototype['set' + plural] = noop;
	this.Instance.prototype['add' + singular] = noop;
	this.Instance.prototype['add' + plural] = noop;
	this.Instance.prototype['create' + singular] = item.create ? item.create.bind(item) : noop;
	this.Instance.prototype['remove' + singular] = noop;
	this.Instance.prototype['remove' + plural] = noop;
	this.Instance.prototype['has' + singular] = function () { return Promise.resolve(false); };
	this.Instance.prototype['has' + plural] = function () { return Promise.resolve(false); };
	this.Instance.prototype['count' + plural] = function () { return Promise.resolve(0); };
	
	return {
		through: {
			model: new fakeModel( this.getTableName() + plural, {}, { hasPrimaryKeys: false } )
		}
	};
};

module.exports = fakeModel;