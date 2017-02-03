'use strict';

/**
 * The mock class for the base Sequelize interface.
 * 
 * @name Sequelize
 * @fileOverview Mock class for the base Sequelize class
 */

var _ = require('lodash'),
	bluebird = require('bluebird'),
	Model = require('./model'),
	Instance = require('./instance'),
	Utils = require('./utils'),
	Errors = require('./errors');

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
 **/
function Sequelize(database, username, password, options) {
	if(typeof database == 'object') {
		options = database;
	} else if (typeof username == 'object') {
		options = username;
	} else if (typeof password == 'object') {
		options = password;
	}
	
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

/**
 * Returns the specified dialect
 * 
 * @return {String} The specified dialect
 */
Sequelize.prototype.getDialect = function() {
	return this.options.dialect;
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
	var model = new Model(name, obj, opts);
	this.models[name] = model;
	return model;
};

/**
 * This function will always return a rejected Promise. This method should be overriden
 * as needed in your tests to return the proper data from your raw queries.
 * 
 * @return {Promise} A rejected promise with an error detailing that mock queries are too broad to stub in a meaningful way
 */
Sequelize.prototype.query = function () {
	return bluebird.reject(new Error('This function requires test specific configuration as it is too broad to generalize'));
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

module.exports = Sequelize;
