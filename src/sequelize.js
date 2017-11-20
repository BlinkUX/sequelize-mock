'use strict';

/**
 * The mock class for the base Sequelize interface.
 * 
 * @name Sequelize
 * @fileOverview Mock class for the base Sequelize class
 */

var path = require('path'),
	_ = require('lodash'),
	bluebird = require('bluebird'),
	Model = require('./model'),
	Instance = require('./instance'),
	Utils = require('./utils'),
	Errors = require('./errors'),
	DataTypes = require('./data-types')({}),
	QueryInterface = require('./queryinterface');

/**
 * Sequelize Mock Object. This can be initialize much the same way that Sequelize itself
 * is initialized. Any configuration or options is ignored, so it can be used as a drop-in
 * replacement for Sequelize but does not have all the same functionality or features.
 * 
 * @class Sequelize
 * @constructor
 * @param {String} [database] Ignored for Mock objects, supported to match Sequelize
 * @param {String} [username] Ignored for Mock objects, supported to match Sequelize
 * @param {String} [password] Ignored for Mock objects, supported to match Sequelize
 * @param {String} [options] Options object. Most default Sequelize options are ignored unless listed below. All, however, are available by accessing `sequelize.options`
 * @param {String} [options.dialect='mock'] Dialect that the system will use. Avaible to be returned by `getDialect()` but has no other effect
 * @param {Boolean} [options.autoQueryFallback] Flag inherited by defined Models indicating if we should try and generate results based on the query automatically
 * @param {Boolean} [options.stopPropagation] Flag inherited by defined Models indicating if we should not propagate to the parent
 **/
function Sequelize(database, username, password, options) {
	if(typeof database == 'object') {
		options = database;
	} else if (typeof username == 'object') {
		options = username;
	} else if (typeof password == 'object') {
		options = password;
	}
	
	this.queryInterface = new QueryInterface( _.pick(options || {}, ['stopPropagation']) );
	
	/**
	 * Options passed into the Sequelize initialization
	 * 
	 * @member Sequelize
	 * @property
	 **/
	this.options = _.extend({
		dialect: 'mock',
	}, options || {});
	
	/**
	 * Used to cache and override model imports for easy mock model importing
	 * 
	 * @member Sequelize
	 * @property
	 **/
	this.importCache = {};
	
	/**
	 * Models that have been defined in this Sequelize Mock instances
	 * 
	 * @member Sequelize
	 * @property
	 **/
	this.models = {};
}
/**
 * Version number for the Mock library
 * 
 * @member Sequelize
 * @property
 **/
Sequelize.version = require('../package.json').version;

/**
 * Options object that exists on Sequelize but is not exposed in the API docs. Included
 * just in case someone tries to access it for some reason.
 * 
 * @member Sequelize
 * @property
 * @private
 **/
Sequelize.options = {hooks: {}};

/**
 * Reference to the mock Sequelize class
 * 
 * @property
 **/
Sequelize.prototype.Sequelize = Sequelize;

/**
 * Reference to the Util functions
 * 
 * @property
 **/
Sequelize.prototype.Utils = Sequelize.Utils = Utils;

/**
 * Reference to the bluebird promise library
 * 
 * @property
 **/
Sequelize.prototype.Promise = Sequelize.Promise = bluebird;

/**
 * Object containing all of the [Sequelize QueryTypes](https://github.com/sequelize/sequelize/blob/3e5b8772ef75169685fc96024366bca9958fee63/lib/query-types.js).
 * 
 * @property
 **/
Sequelize.QueryTypes = {
	SELECT: 'SELECT',
	INSERT: 'INSERT',
	UPDATE: 'UPDATE',
	BULKUPDATE: 'BULKUPDATE',
	BULKDELETE: 'BULKDELETE',
	DELETE: 'DELETE',
	UPSERT: 'UPSERT',
	VERSION: 'VERSION',
	SHOWTABLES: 'SHOWTABLES',
	SHOWINDEXES: 'SHOWINDEXES',
	DESCRIBE: 'DESCRIBE',
	RAW: 'RAW',
	FOREIGNKEYS: 'FOREIGNKEYS',
};

/**
 * Reference to the mock Model class
 * 
 * @property
 **/
Sequelize.prototype.Model = Sequelize.Model = Model;

/**
 * Reference to the mock Instance class
 * 
 * @property
 **/
Sequelize.prototype.Instance = Sequelize.Instance = Instance;

/**
 * A reference to the Sequelize Error object. Also included are references to each of the
 * Error classes listed under the Error API header.
 * 
 * @property Error
 **/
_.each(Errors, function (fn, name) {
	if(name == 'BaseError') {
		// Aliased to Error for some reason...
		name = 'Error';
	}
	Sequelize.prototype[name] = Sequelize[name] = fn;
});

// DATA TYPES
require('./data-types')(Sequelize);

/* Test Specific Functionality
 * 
 */
/**
 * Queue a new query result to be returned by either the `query` method call or as a
 * fallback from queries from `Model`s defined through the `define` method.
 * 
 * @see {@link query}
 * @alias $queueQueryResult
 * @alias $qqr
 * @param {Any} result The object or value to be returned as the result of a query
 * @return {Sequelize} self
 **/
Sequelize.prototype.$queueResult = function(result) {
	this.queryInterface.$queueResult(result);
	return this;
};
Sequelize.prototype.$queueQueryResult = Sequelize.prototype.$qqr = Sequelize.prototype.$queueResult;

/**
 * Queue a new query result to be returned by either the `query` method call or as a
 * fallback from queries from `Model`s defined through the `define` method. This result
 * is returned as a rejected promise for testing error handling.
 * 
 * @see {@link query}
 * @alias $queueQueryFailure
 * @alias $queueError
 * @alias $queueQueryError
 * @alias $qqf
 * @param {Any} error The object or value to be returned as the failure for a query
 * @param {Object} [options]
 * @param {Boolean} [options.convertNonErrors] Flag indicating if non `Error` objects should be allowed. Defaults to true
 * @return {Sequelize} self
 **/
Sequelize.prototype.$queueFailure = function(error, options) {
	this.queryInterface.$queueFailure(error, options);
	return this;
};
Sequelize.prototype.$queueError =
Sequelize.prototype.$queueQueryError =
Sequelize.prototype.$queueQueryFailure =
Sequelize.prototype.$qqf = Sequelize.prototype.$queueFailure;

/**
 * Clears any queued results from `$queueResult` or `$queueFailure`
 * 
 * @see {@link $queueResult}
 * @see {@link $queueFailure}
 * @alias $queueClear
 * @alias $queueQueryClear
 * @alias $cqq
 * @alias $qqc
 * @return {Sequelize} self
 **/
Sequelize.prototype.$clearQueue = function() {
	this.queryInterface.$clearQueue();
	return this;
};
Sequelize.prototype.$queueClear =
Sequelize.prototype.$queueQueryClear =
Sequelize.prototype.$cqq =
Sequelize.prototype.$qqc = Sequelize.prototype.$clearQueue;

/**
 * Overrides a path used for import
 * 
 * @see {@link import}
 * @param {String} importPath The original path that import will be called with
 * @param {String} overridePath The path that should actually be used for resolving. If this path is relative, it will be relative to the file calling the import function
 **/
Sequelize.prototype.$overrideImport = function (realPath, mockPath) {
	this.importCache[realPath] = mockPath;
};

/* Mock Functionality
 * 
 */
/**
 * Returns the specified dialect
 * 
 * @return {String} The specified dialect
 */
Sequelize.prototype.getDialect = function() {
	return this.options.dialect;
};

/**
 * Returns the current instance of `QueryInterface`
 * 
 * @see {@link ./queryinterface.md|QueryInterface}
 * @see {@link query}
 * @return {QueryInterface} The instantiated `QueryInterface` object used for test `query`
 */
Sequelize.prototype.getQueryInterface = function() {
	return this.queryInterface;
};

/**
 * Define a new mock Model. You should provide a name and a set of default values for this
 * new Model. The default values will be used any time a new Instance of this model is
 * created and will be overridden by any values provided specifically to that Instance.
 * 
 * Additionally an options object can be passed in with an `instanceMethods` map. All of
 * functions in this object will be added to any Instance of the Model that is created.
 * 
 * All models are available by name via the `.models` property
 * 
 * @example
 * sequelize.define('user', {
 * 		'name': 'Test User',
 * 		'email': 'test@example.com',
 * 		'joined': new Date(),
 * 	}, {
 * 		'instanceMethods': {
 * 			'tenure': function () { return Date.now() - this.get('joined'); },
 * 		},
 * 	});
 * 
 * @see Model
 * @param {String} name Name of the mock Model
 * @param {Object} [obj={}] Map of keys and their default values that will be used when querying against this object
 * @param {Object} [opts] Options for the mock model
 * @param {Object} [opts.instanceMethods] Map of function names and the functions to be run. These functions will be added to any instances of this Model type
 * @return {Model} Mock Model as defined by the name, default values, and options provided
 */
Sequelize.prototype.define = function (name, obj, opts) {
	opts = _.extend({
		sequelize: this,
	}, opts || {})
	
	var model = new Model(name, obj, opts);
	this.models[name] = model;
	return model;
};

/**
 * Checks whether a model with the given name is defined.
 * 
 * Uses the `.models` property for lookup.
 * 
 * @see{@link define}
 * @see{@link models}
 * @param {String} name Name of the model
 * @return {Boolean} True if the model is defined, false otherwise
 */
Sequelize.prototype.isDefined = function (name) {
	return name in this.models && typeof this.models[name] !== 'undefined';	
};

/**
 * Imports a given model from the provided file path. Files that are imported should
 * export a function that accepts two parameters, this sequelize instance, and an object
 * with all of the available datatypes
 * 
 * Before importing any modules, it will remap any paths that were overridden using the
 * `$overrideImport` test function. This method is most helpful when used to make the
 * SequelizeMock framework import your mock models instead of the real ones in your test
 * code.
 * 
 * @param {String} path Path of the model to import. Can be relative or absolute
 * @return {Any} The result of evaluating the imported file's function
 **/
Sequelize.prototype.import = function (importPath) {
	if(typeof this.importCache[importPath] === 'string') {
		importPath = this.importCache[importPath];
	}
	
	if(path.normalize(importPath) !== path.resolve(importPath)) {
		// We're relative, and need the calling files location
		var callLoc = path.dirname(Utils.stack()[1].getFileName());
		
		importPath = path.resolve(callLoc, importPath);
	}
	
	if(this.importCache[importPath] === 'string' || !this.importCache[importPath]) {
		this.importCache[importPath] = require(importPath)(this, DataTypes);
	}
	
	return this.importCache[importPath];
};

/**
 * Fetch a Model which is already defined.
 * 
 * Uses the `.models` property for lookup.
 * 
 * @see{@link define}
 * @see{@link models}
 * @param {String} name Name of the model
 * @return {Model} Mock model which was defined with the specified name
 * @throws {Error} Will throw an error if the model is not defined (that is, if sequelize#isDefined returns false)
 */
Sequelize.prototype.model = function (name) {
	if (!this.isDefined(name)) {
		throw new Error(name + ' has not been defined');
	}

	return this.models[name];
}

/**
 * Run a mock query against the `QueryInterface` associated with this Sequelize instance
 * 
 * @return {Promise<Any>} The next result of a query as queued to the `QueryInterface`
 */
Sequelize.prototype.query = function () {
	return this.queryInterface.$query();
};

/**
 * This function will simulate the wrapping of a set of queries in a transaction. Because
 * Sequelize Mock does not run any actual queries, there is no difference between code
 * run through transactions and those that aren't.
 * 
 * @param {Function} [fn] Optional function to run as a tranasction
 * @return {Promise} Promise that resolves the code is successfully run, otherwise it is rejected
 */
Sequelize.prototype.transaction = function (fn) {
	if(!fn) {
		fn = function (t) {
			return bluebird.resolve(t);
		};
	}
	return new bluebird(function (resolve, reject) {
		// TODO Return mock transaction object
		return fn({}).then(resolve, reject);
	});
};

/**
 * Simply returns the first argument passed in, unmodified.
 * 
 * @param {Any} arg Value to return
 * @return {Any} value passed in
 */
Sequelize.prototype.literal = function (arg) {
	return arg;
};

/**
 * Always returns a resolved promise
 *
 * @return {Promise} will always resolve as a successful authentication
 */
Sequelize.prototype.authenticate = function() {
	return new bluebird(function (resolve) {
		return resolve();
	});
};

module.exports = Sequelize;
