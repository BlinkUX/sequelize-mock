'use strict';

var bluebird = require('bluebird'),
	Model = require('./model');

function Sequelize() {
	
}

Sequelize.version = require('../package.json').version;
Sequelize.options = {hooks: {}};

Sequelize.prototype.Sequelize = Sequelize;
Sequelize.prototype.Utils = Sequelize.Utils = require('./utils');
Sequelize.prototype.Promise = Sequelize.Promise = bluebird;
Sequelize.prototype.Model = Sequelize.Model = require('./model');

// DATA TYPES
Sequelize.STRING = function () {};
Sequelize.CHAR = function () {};
Sequelize.TEXT = function () {};
Sequelize.INTEGER = function () {};
Sequelize.BIGINT = function () {};
Sequelize.FLOAT = function () {};
Sequelize.REAL = function () {};
Sequelize.DOUBLE = function () {};
Sequelize.DECIMAL = function () {};
Sequelize.BOOLEAN = function () {};
Sequelize.TIME = function () {};
Sequelize.DATE = function () {};
Sequelize.DATEONLY = function () {};
Sequelize.HSTORE = function () {};
Sequelize.JSON = function () {};
Sequelize.JSONB = function () {};
Sequelize.NOW = function () {};
Sequelize.BLOB = function () {};
Sequelize.RANGE = function () {};
Sequelize.UUID = function () {};
Sequelize.UUIDV1 = function () {};
Sequelize.UUIDV4 = function () {};
Sequelize.VIRTUAL = function () {};
Sequelize.ENUM = function () {};
Sequelize.ARRAY = function () {};
Sequelize.GEOMETRY = function () {};
Sequelize.GEOGRAPHY = function () {};

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
	return new bluebird(function (resolve, reject) {
		return fn({}).then(resolve, reject);
	});
};
Sequelize.prototype.literal = function (arg) {
	return arg;
};

module.exports = Sequelize;
