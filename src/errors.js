'use strict';

/**
 * Error objects are exposed via the base SequelizeMock object and can be used in much the same
 * way that native Sequelize errors can be used. Because no queries are run, any errors that
 * would normally contain a `sql` property include it with a value indicating this is test code
 * 
 * *NOTE:* Error names are copied exactly from Sequelize in the off-chance code is relying on
 * error name instead of equality or instanceof
 * 
 * @name Errors
 * @fileOverview Error objects used by Sequelize and available via Sequelize Mock
 */

var util = require('util');
var _ = require('lodash');

/**
 * BaseError is the base class most other Sequelize Mock Error classes inherit from
 * Mostly based off of [the Sequelize.js equivalent code](https://github.com/sequelize/sequelize/blob/3e5b8772ef75169685fc96024366bca9958fee63/lib/errors.js#L20)
 * 
 * @class BaseError
 * @constructor
 * @alias Error
 * @extends Error
 */
exports.BaseError = function() {
	// Set basic error info
	var err = Error.apply(this, arguments);
	/* istanbul ignore next */
	if (Error.captureStackTrace)
		Error.captureStackTrace(this, this.constructor);
	
	// Configure specifics
	this.message = err.message;
	// Copying name from sequelize just in case people rely on error name
	this.name = 'SequelizeBaseError';
};
// Extend Error
util.inherits(exports.BaseError, Error);


/**
 * ValidationError is the class used for validation errors returned by Sequelize Mock.
 * The most common way you will see this error is using the `$addValidationError` test
 * helper method on instances.
 * 
 * ValidationErrors contain an `errors` property which contains a list of the specific
 * validation errors that were encountered. For example, if two validation errors were
 * encountered, it will be an array of length two. Objects in this array are of type
 * `ValidationErrorItem`.
 * 
 * @class ValidationError
 * @constructor
 * @see {@link ValidationErrorItem}
 * @extends {@link BaseError}
 * @param {String} msg Error Message
 * @param {Array<ValidationErrorItem>} [errors] Error Message
 */
exports.ValidationError = function (msg, errors) {
	exports.BaseError.apply(this, arguments);
	
	this.name = 'SequelizeValidationError';
	this.message = msg || 'Validation Error';
	/**
	 * Array of all validation errors that were encountered with
	 * this validation
	 * 
	 * @member {Array<ValidationErrorItem>}
	 **/
	this.errors = errors || [];
};
// Extend BaseError
util.inherits(exports.ValidationError, exports.BaseError);

/**
 * Get the validation error for a particular field
 * 
 * @memberof ValidationError
 * @instance
 * @param {String} path Field you would like the list of validation errors for
 * @return {Array<ValidationErrorItem>} Array of validation errors for the given field
 */
exports.ValidationError.prototype.get = function (path) {
	return _.filter(this.errors, { path: path, });
};

/**
 * A specific validation failure result
 * 
 * @class ValidationErrorItem
 * @constructor
 * @see ValidationError
 * @param {String} msg Error Message
 * @param {String} type Type of the error
 * @param {String} path Field with the error
 * @param {String} value Value with the error
 */
exports.ValidationErrorItem = function (msg, type, path, value) {
	this.message = msg;
	this.type    = type;
	this.path    = path;
	this.value   = value;
};


/**
 * The generic base Database Error class
 * 
 * @class DatabaseError
 * @constructor
 * @extends {@link BaseError}
 * @param {Error} parentError Original error that triggered this error
 */
exports.DatabaseError = function (parentError) {
	this.parent = this.original = parentError;
	/**
	 * Ordinarily contains the SQL that triggered the error.
	 * However, because test code does not go to the DB and
	 * therefore does not have SQL, this will contain an SQL
	 * comment stating it is from Sequelize Mock.
	 * 
	 * @name sql
	 * @member {string}
	 **/
	this.sql = '/* Sequelize Mock; No SQL generated */';
};
// Extend BaseError
util.inherits(exports.DatabaseError, exports.BaseError);


/**
 * Database timeout error
 * 
 * @class TimeoutError
 * @constructor
 * @extends {@link DatabaseError}
 */
exports.TimeoutError = function () {
	exports.BaseError.call(this, 'Query Timed Out');
	exports.DatabaseError.call(this, this);
	
	this.name = 'SequelizeTimeoutError';
};
// Extend DatabaseError
util.inherits(exports.TimeoutError, exports.DatabaseError);


/**
 * Unique constraint violation error
 * 
 * @class UniqueConstraintError
 * @constructor
 * @extends {@link ValidationError}
 * @extends {@link DatabaseError}
 * @param {Object} opts Unique constraint error information
 * @param {String} opts.message Error message
 * @param {Array<ValidationErrorItem>} [opts.errors] Errors that were encountered
 * @param {Array<String>} [opts.fields] Fields that violated the unique constraint
 */
exports.UniqueConstraintError = function (opts) {
	opts = opts || {};
	
	exports.ValidationError.call(this, opts.message, opts.errors);
	exports.DatabaseError.call(this, this);
	
	this.name = 'SequelizeUniqueConstraintError';
	this.fields = opts.fields || [];
};
// Extend ValidationError
util.inherits(exports.UniqueConstraintError, exports.ValidationError);


/**
 * Foreign key constraint violation error
 * 
 * @class ForeignKeyConstraintError
 * @constructor
 * @extends {@link BaseError}
 * @extends {@link DatabaseError}
 * @param {Object} opts Unique constraint error information
 * @param {String} opts.message Error message
 * @param {Array<String>} [opts.fields] Fields that violated the unique constraint
 * @param {String} opts.table Name of the table the failure is for
 * @param {String} opts.value Invalid value
 * @param {String} opts.index Name of the foreign key index that was violated
 */
exports.ForeignKeyConstraintError = function (opts) {
	opts = opts || {};
	
	exports.BaseError.call(this, opts.message);
	exports.DatabaseError.call(this, this);
	
	this.name = 'SequelizeForeignKeyConstraintError';
	this.fields = opts.fields || [];
	this.table = opts.table;
	this.value = opts.value;
	this.index = opts.index;
};
// Extend DatabaseError
util.inherits(exports.ForeignKeyConstraintError, exports.DatabaseError);


/**
 * Exclusion constraint violation error
 * 
 * @class ExclusionConstraintError
 * @constructor
 * @extends {@link BaseError}
 * @extends {@link DatabaseError}
 * @param {Object} opts Unique constraint error information
 * @param {String} opts.message Error message
 * @param {Array<String>} [opts.fields] Fields that violated the unique constraint
 * @param {String} opts.table Name of the table the failure is for
 * @param {String} opts.constraint Name of the constraint that was violated
 */
exports.ExclusionConstraintError = function (opts) {
	opts = opts || {};
	
	exports.BaseError.call(this, opts.message);
	exports.DatabaseError.call(this, this);
	
	this.name = 'SequelizeExclusionConstraintError';
	this.fields = opts.fields || [];
	this.table = opts.table;
	this.constraint = opts.constraint;
};
// Extend DatabaseError
util.inherits(exports.ExclusionConstraintError, exports.DatabaseError);


/**
 * Generic database connection error
 * 
 * @class ConnectionError
 * @constructor
 * @extends {@link BaseError}
 * @param {Error} parentError Original error that triggered this error
 */
exports.ConnectionError = function (parentError) {
	exports.BaseError.call(this, parentError ? parentError.message : 'Connection Error');
	this.parent = this.original = parentError;
	this.name = 'SequelizeConnectionError';
};
// Extend BaseError
util.inherits(exports.ConnectionError, exports.BaseError);


/**
 * Database connection refused error
 * 
 * @class ConnectionRefusedError
 * @constructor
 * @extends {@link ConnectionError}
 * @param {Error} parentError Original error that triggered this error
 */
exports.ConnectionRefusedError = function (parentError) {
	exports.ConnectionError.call(this, parentError);
	this.name = 'SequelizeConnectionRefusedError';
};
// Extend ConnectionError
util.inherits(exports.ConnectionRefusedError, exports.ConnectionError);


/**
 * Database access denied connection error
 * 
 * @class AccessDeniedError
 * @constructor
 * @extends {@link ConnectionError}
 * @param {Error} parentError Original error that triggered this error
 */
exports.AccessDeniedError = function (parentError) {
	exports.ConnectionError.call(this, parentError);
	this.name = 'SequelizeAccessDeniedError';
};
// Extend ConnectionError
util.inherits(exports.AccessDeniedError , exports.ConnectionError);


/**
 * Database host not found connection error
 * 
 * @class HostNotFoundError
 * @constructor
 * @extends {@link ConnectionError}
 * @param {Error} parentError Original error that triggered this error
 */
exports.HostNotFoundError = function (parentError) {
	exports.ConnectionError.call(this, parentError);
	this.name = 'SequelizeHostNotFoundError';
};
// Extend ConnectionError
util.inherits(exports.HostNotFoundError , exports.ConnectionError);


/**
 * Database host not reachable connection error
 * 
 * @class HostNotReachableError
 * @constructor
 * @extends {@link ConnectionError}
 * @param {Error} parentError Original error that triggered this error
 */
exports.HostNotReachableError = function (parentError) {
	exports.ConnectionError.call(this, parentError);
	this.name = 'SequelizeHostNotReachableError';
};
// Extend ConnectionError
util.inherits(exports.HostNotReachableError , exports.ConnectionError);


/**
 * Database invalid connection error
 * 
 * @class InvalidConnectionError
 * @constructor
 * @extends {@link ConnectionError}
 * @param {Error} parentError Original error that triggered this error
 */
exports.InvalidConnectionError = function (parentError) {
	exports.ConnectionError.call(this, parentError);
	this.name = 'SequelizeInvalidConnectionError';
};
// Extend ConnectionError
util.inherits(exports.InvalidConnectionError , exports.ConnectionError);


/**
 * Database connection timed out error
 * 
 * @class ConnectionTimedOutError
 * @constructor
 * @extends {@link ConnectionError}
 * @param {Error} parentError Original error that triggered this error
 */
exports.ConnectionTimedOutError = function (parentError) {
	exports.ConnectionError.call(this, parentError);
	this.name = 'SequelizeConnectionTimedOutError';
};
// Extend ConnectionError
util.inherits(exports.ConnectionTimedOutError , exports.ConnectionError);


/**
 * Error from a Sequelize (Mock) Instance
 * 
 * @class InstanceError
 * @constructor
 * @extends {@link BaseError}
 * @param {Error} message Error message
 */
exports.InstanceError = function (message) {
	exports.BaseError.apply(this, arguments);
	this.name = 'SequelizeInstanceError';
};
// Extend BaseError
util.inherits(exports.InstanceError , exports.BaseError);

/**
 * InvalidQueryError indicates that a query object was not formatted correctly. This most
 * likely means that you attempted to add a new query by pushing directly to the internal
 * object rather than going through `$queueResult` or `$queueFailure`.
 * 
 * @class InvalidQueryError
 * @constructor
 * @extends BaseError
 * @private
 */
exports.InvalidQueryResultError = function (message) {
	exports.BaseError.call(this, message || 'Invalid query result was queued. Unable to complete mock query');
	this.name = 'SequelizeMockInvalidQueryResultError';
};
// Extend ConnectionError
util.inherits(exports.InvalidQueryResultError , exports.BaseError);

/**
 * EmptyQueryQueueError indicates that there are currently no queued results and that no
 * automated fallback was provided or available for the calling function.
 * 
 * @class EmptyQueryQueueError
 * @constructor
 * @extends BaseError
 * @private
 */
exports.EmptyQueryQueueError = function (message) {
	exports.BaseError.call(this, message || 'No query results are queued. Unexpected query attempted to be run');
	this.name = 'SequelizeMockEmptyQueryQueueError';
};
// Extend ConnectionError
util.inherits(exports.EmptyQueryQueueError , exports.BaseError);
