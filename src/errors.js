/**
 * Errors
 *
 * NOTE: Error names are copied exactly from Sequelize in the off-chance
 *       code is relying on error name instead of equality or instanceof
 */
'use strict';

var util = require('util');
var _ = require('lodash');

/**
 * BaseError
 *
 * Mostly based off of https://github.com/sequelize/sequelize/blob/3e5b8772ef75169685fc96024366bca9958fee63/lib/errors.js#L20
 */
exports.BaseError = function() {
	// Set basic error info
	var err = Error.apply(this, arguments);
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
 * ValidationError
 */
exports.ValidationError = function (msg, errors) {
	exports.BaseError.apply(this, arguments);
	
	this.name = 'SequelizeValidationError';
	this.message = msg || 'Validation Error';
	this.errors = errors || [];
};
// Extend BaseError
util.inherits(exports.ValidationError, exports.BaseError);

/**
 * ValidationError#get
 */
exports.ValidationError.prototype.get = function (path) {
	return _.filter(this.errors, { path: path, });
};

/**
 * ValidationErrorItem
 */
exports.ValidationErrorItem = function (msg, type, path, value) {
	this.message = msg;
	this.type    = type;
	this.path    = path;
	this.value   = value;
};


/**
 * DatabaseError
 */
exports.DatabaseError = function (parentError) {
	this.parent = this.original = parentError;
	this.sql = '/* Sequelize Mock; No SQL generated */';
};
// Extend BaseError
util.inherits(exports.DatabaseError, exports.BaseError);


/**
 * TimeoutError
 */
exports.TimeoutError = function () {
	exports.BaseError.call(this, 'Query Timed Out');
	exports.DatabaseError.call(this, this);
	
	this.name = 'SequelizeTimeoutError';
};
// Extend DatabaseError
util.inherits(exports.TimeoutError, exports.DatabaseError);


/**
 * UniqueConstraintError
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
 * ForeignKeyConstraintError
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
 * ExclusionConstraintError
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
 * ConnectionError
 */
exports.ConnectionError = function (parentError) {
	exports.BaseError.call(this, parentError ? parentError.message : 'Connection Error');
	this.parent = this.original = parentError;
	this.name = 'SequelizeConnectionError';
};
// Extend BaseError
util.inherits(exports.ConnectionError, exports.BaseError);


/**
 * ConnectionRefusedError
 */
exports.ConnectionRefusedError = function (parentError) {
	exports.ConnectionError.call(this, parentError);
	this.name = 'SequelizeConnectionRefusedError';
};
// Extend ConnectionError
util.inherits(exports.ConnectionRefusedError, exports.ConnectionError);


/**
 * AccessDeniedError
 */
exports.AccessDeniedError = function (parentError) {
	exports.ConnectionError.call(this, parentError);
	this.name = 'SequelizeAccessDeniedError';
};
// Extend ConnectionError
util.inherits(exports.AccessDeniedError , exports.ConnectionError);


/**
 * HostNotFoundError
 */
exports.HostNotFoundError = function (parentError) {
	exports.ConnectionError.call(this, parentError);
	this.name = 'SequelizeHostNotFoundError';
};
// Extend ConnectionError
util.inherits(exports.HostNotFoundError , exports.ConnectionError);


/**
 * HostNotReachableError
 */
exports.HostNotReachableError = function (parentError) {
	exports.ConnectionError.call(this, parentError);
	this.name = 'SequelizeHostNotReachableError';
};
// Extend ConnectionError
util.inherits(exports.HostNotReachableError , exports.ConnectionError);


/**
 * InvalidConnectionError
 */
exports.InvalidConnectionError = function (parentError) {
	exports.ConnectionError.call(this, parentError);
	this.name = 'SequelizeInvalidConnectionError';
};
// Extend ConnectionError
util.inherits(exports.InvalidConnectionError , exports.ConnectionError);


/**
 * ConnectionTimedOutError
 */
exports.ConnectionTimedOutError = function (parentError) {
	exports.ConnectionError.call(this, parentError);
	this.name = 'SequelizeConnectionTimedOutError';
};
// Extend ConnectionError
util.inherits(exports.ConnectionTimedOutError , exports.ConnectionError);


/**
 * InstanceError
 */
exports.InstanceError = function (message) {
	exports.BaseError.apply(this, arguments);
	this.name = 'SequelizeInstanceError';
};
// Extend BaseError
util.inherits(exports.InstanceError , exports.BaseError);
