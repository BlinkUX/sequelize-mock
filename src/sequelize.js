'use strict';

var _ = require('lodash'),
	bluebird = require('bluebird'),
	Model = require('./model'),
	Utils = require('./utils'),
	Errors = require('./errors');

function noop() {}

function Sequelize() {
	
}

Sequelize.version = require('../package.json').version;
Sequelize.options = {hooks: {}};

Sequelize.prototype.Sequelize = Sequelize;
Sequelize.prototype.Utils = Sequelize.Utils = Utils;
Sequelize.prototype.Promise = Sequelize.Promise = bluebird;
Sequelize.prototype.Model = Sequelize.Model = Model;

// Errors
_.each(Errors, function (fn, name) {
	if(name == 'BaseError') {
		// Aliased to Error for some reason...
		name = 'Error';
	}
	Sequelize.prototype[name] = Sequelize[name] = fn;
});

// DATA TYPES
Sequelize.STRING    = noop;
Sequelize.CHAR      = noop;
Sequelize.TEXT      = noop;
Sequelize.INTEGER   = noop;
Sequelize.BIGINT    = noop;
Sequelize.FLOAT     = noop;
Sequelize.REAL      = noop;
Sequelize.DOUBLE    = noop;
Sequelize.DECIMAL   = noop;
Sequelize.BOOLEAN   = noop;
Sequelize.TIME      = noop;
Sequelize.DATE      = noop;
Sequelize.DATEONLY  = noop;
Sequelize.HSTORE    = noop;
Sequelize.JSON      = noop;
Sequelize.JSONB     = noop;
Sequelize.NOW       = noop;
Sequelize.BLOB      = noop;
Sequelize.RANGE     = noop;
Sequelize.UUID      = noop;
Sequelize.UUIDV1    = noop;
Sequelize.UUIDV4    = noop;
Sequelize.VIRTUAL   = noop;
Sequelize.ENUM      = noop;
Sequelize.ARRAY     = noop;
Sequelize.GEOMETRY  = noop;
Sequelize.GEOGRAPHY = noop;

// QUERY TYPES
Sequelize.QueryTypes = {
	// FROM https://github.com/sequelize/sequelize/blob/master/lib/query-types.js
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

Sequelize.prototype.define = function (name, obj, opts) {
	return new Model(name, obj, opts);
};
Sequelize.prototype.query = function () {
	return bluebird.reject(new Error('This function requires test specific configuration as it is too broad to generalize'));
};
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
Sequelize.prototype.literal = function (arg) {
	return arg;
};

module.exports = Sequelize;
