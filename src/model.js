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
	Utils = require('./utils'),
	Instance = require('./instance');

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
 **/
function fakeModel (name, defaults, opts) {
	if(typeof name === 'object') {
		defaults = name;
		name = '';
	}
	
	/**
	 * Name given to the model on initialization
	 * 
	 * @member {String}
	 **/
	this.name = name;
	this._defaults = defaults || {};
	this._functions = {};
	if(opts && opts.instanceMethods) {
		_.extend(this._functions, opts.instanceMethods);
	}
	this._wasCreated = true;
	
	/**
	 * An empty object with the proper prototype for what functions an Instance gets
	 * 
	 * @member {Object}
	 **/
	this.Instance = {};
	this.Instance.prototype = this._functions;
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
	return this.name;
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
 * Creates an array of a single result based on the where query in the options and
 * wraps it in a promise.
 * 
 * @example
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
 * @param {Object} [options] Map of values that the instance should have
 * @return {Promise<Instance[]>} Promise that resolves with an array of length 1
 **/
fakeModel.prototype.findAll =  function (options) {
	return Promise.resolve([ this.build(options ? options.where : {}) ]);
};

/**
 * Builds a new Instance with the given id and wraps it in a promise.
 * 
 * @instance
 * @see {@link findAll}
 * @param {Integer} id ID of the instance
 * @return {Promise<Instance>} Promise that resolves with an instance with the given ID
 **/
fakeModel.prototype.findById = function (id) {
	return Promise.resolve( this.build({ id: id }) );
};

/**
 * Builds a new Instance with the given properties pulled from the where object in the
 * options and wraps it in a promise.
 * 
 * @example
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
	return Promise.resolve( this.build(obj ? obj.where : {}) );
};

/**
 * Returns the default value for the given field
 * 
 * @instance
 * @method
 * @param {String} field Name of the field to return for
 * @return {Any} the default value for the given field
 **/
fakeModel.prototype.max =
/**
 * Returns the default value for the given field
 * 
 * @instance
 * @method
 * @param {String} field Name of the field to return for
 * @return {Any} the default value for the given field
 **/
fakeModel.prototype.min =
/**
 * Returns the default value for the given field
 * 
 * @instance
 * @method
 * @param {String} field Name of the field to return for
 * @return {Any} the default value for the given field
 **/
fakeModel.prototype.sum = function (field) {
	return Promise.resolve(this._defaults[field]);
};

/**
 * Builds a new Instance with the given properties
 * 
 * @instance
 * @param {Object} [options] Map of values that the instance should have
 * @return {Instance} a new instance with any given properties
 **/
fakeModel.prototype.build = function (options) {
	var item = new Instance(this._defaults, options);
	for(var f in this._functions) {
		item[f] = this._functions[f];
	}
	return item;
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
 * By default triggers a create action based on the given properties from the where in
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
	var result = this.build(obj.where);
	if(this._wasCreated) {
		return result.save().then(function () {
			return Promise.resolve([result, true]);
		});
	}
	return Promise.resolve( [result, false] );
};

/**
 * Attempts to save an instance with the given options. By default will return true
 * 
 * @instance
 * @method upsert
 * @alias insertOrUpdate
 * @param {Object} values Values of the Instance being created
 * @return {Promise<Boolean>} Promise that resolves with a boolean meant to indicate if something was inserted
 **/
fakeModel.prototype.insertOrUpdate =
fakeModel.prototype.upsert = function (values) {
	return this.build(values).save().return(!!this._wasCreated);
}

/**
 * Takes an array of value sets and creates a set of instances of this model.
 * 
 * @instance
 * @see {@link create}
 * @param {Array<Object>} set Set of values to create objects for
 * @return {Promise<Instance[]>} Promise that contains all created Instances
 **/
fakeModel.prototype.bulkCreate = function (set, options) {
	return Promise.all( _.map(set, this.create.bind(this)) );
};

/**
 * Always resolves with either the limit from the options or a 1, indicating how many
 * rows would be deleted
 * 
 * @instance
 * @param {Object} [options] Options for the query
 * @param {Number} [options.limit] Number of rows that are deleted
 * @return {Promise<Integer>} Promise with number of deleted rows
 **/
fakeModel.prototype.destroy = function (options) {
	return Promise.resolve(options && typeof options.limit == 'number' ? options.limit : 1);
};

/**
 * Creates 1 new Instance that matches the where value from the first parameter and
 * returns a Promise with an array of the count of affected rows (always 1) and the
 * affected rows (the newly created Instance)
 * 
 * @instance
 * @param {Object} values Values to build the Instance
 * @return {Promise<Array<Integer, Array<Instance>>>} Promise with an array of the number of affected rows and the affected rows themselves
 **/
fakeModel.prototype.update = function (values) {
	return Promise.resolve([ 1, [this.build(values)] ]);
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
		this._functions['get' + singular] = function (opts) { return Promise.resolve(new Instance(null, opts && opts.where ? opts.where : opts)); };
	} else {
		this._functions['get' + singular] = item.findOne.bind(item);
	}
	this._functions['set' + singular] = noop;
	this._functions['create' + singular] = item.create ? item.create.bind(item) : noop;
};

fakeModel.prototype.belongsToMany = fakeModel.prototype.hasMany = function (item, options) {
	if(!(item instanceof fakeModel)) {
		return {
			through: {
				model: new fakeModel()
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
		this._functions['get' + plural] = function (opts) { return Promise.resolve([new Instance(name, opts && opts.where ? opts.where : opts)]); };
	} else {
		this._functions['get' + plural] = item.findAll.bind(item);
	}
	this._functions['set' + plural] = noop;
	this._functions['add' + singular] = noop;
	this._functions['add' + plural] = noop;
	this._functions['create' + singular] = item.create ? item.create.bind(item) : noop;
	this._functions['remove' + singular] = noop;
	this._functions['remove' + plural] = noop;
	this._functions['has' + singular] = function () { return Promise.resolve(false); };
	this._functions['has' + plural] = function () { return Promise.resolve(false); };
	this._functions['count' + plural] = function () { return Promise.resolve(0); };
	
	return {
		through: {
			model: new fakeModel()
		}
	};
};

module.exports = fakeModel;