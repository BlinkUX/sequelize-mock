'use strict';

var util = require('util'),
	_ = require('lodash');

/**
 * These are the available DataTypes on the Sequelize class. You can access these on the
 * class object as seen here.
 * 
 * @example
 * var Sequelize = require('sequelize-mock');
 * var sequelize = new Sequelize();
 * 
 * Sequelize.STRING
 * // OR ...
 * sequelize.Sequelize.STRING
 * 
 * @name DataTypes
 * @fileOverview Mock class for the base Sequelize class
 */

function noop() {}

/**
 * Base abstract data type all other data types inherit from
 * 
 * @class Abstract
 * @constructor
 * @private
 **/
function Abstract () {
}

Abstract.prototype.toString =
/**
 * Returns the key this data type maps to in SQL
 * 
 * @instance
 * @return {String} Key for this datatype
 * @private
 **/
Abstract.prototype.toSql = function () {
	return this.key;
};

/**
 * Stringify a value for this data type
 * 
 * @instance
 * @param {*} value The value to stringify
 * @param {Object} options Any options the stringify for this datatype accepts
 * @return {String} A string version value passed in
 * @private
 **/
Abstract.prototype.stringify = function (value, options) {
	if (this.$stringify) {
		return this.$stringify(value, options);
	}
	return value + '';
};

/**
 * Returns the key this data type maps to in SQL
 * 
 * @instance
 * @return {String} Key for this datatype
 * @private
 **/
Abstract.inherits = function (Inheriting) {
	util.inherits(Inheriting, this);
	_.extend(Inheriting, this);
	
	return Inheriting;
};

// In Sequelize these are mostly internal, but they are mapped here for parity
Abstract.warn = noop;
Abstract.prototype.dialectTypes = '';

/**
 * Mock string data type
 *
 * @property STRING
 */
var STRING = Abstract.inherits(function (length, binary) {
	if (!(this instanceof STRING)) {
		return new STRING(length, binary);
	}
	
	this.options = typeof length === 'object' && length ? length : {
		length: length || 255,
		binary: binary,
	};
});
STRING.prototype.key = STRING.key = 'STRING';
STRING.prototype.BINARY = STRING;

/**
 * Mock char data type
 *
 * @property CHAR
 */
var CHAR = STRING.inherits(function (length, binary) {
	if (!(this instanceof CHAR)) {
		return new CHAR(length, binary);
	}
	STRING.apply(this, arguments);
});
CHAR.prototype.key = CHAR.key = 'CHAR';

/**
 * Mock text data type
 *
 * @property TEXT
 */
var TEXT = Abstract.inherits(function(length) {
	if (!(this instanceof TEXT)) {
		return new TEXT(length);
	}
	
	this.options = typeof length === 'object' && length ? length : {
		length: length || '',
	};
	this.key = (this.options.length || '').toUpperCase() + 'TEXT';
});
TEXT.prototype.key = TEXT.key = 'TEXT';

/**
 * Mock number data type for other number data types to inherit from
 * 
 * @private
 * @property
 **/
var NUMBER = Abstract.inherits(function(options) {
	this.options = options;
});
NUMBER.prototype.key = NUMBER.key = 'NUMBER';
NUMBER.prototype.ZEROFILL = NUMBER.prototype.UNSIGNED = NUMBER;

NUMBER.prototype.$stringify = function (value) {
	if (isNaN(value)) {
		return "'NaN'";
	} else if (!isFinite(value)) {
		return "'" + (value < 0 ? '-' : '') + "Infinity'";
	}
	return value + '';
};

/**
 * Mock integer data type
 *
 * @property INTEGER
 */
var INTEGER = NUMBER.inherits(function(length) {
	if (!(this instanceof INTEGER)) {
		return new INTEGER(length);
	}
	
	NUMBER.call(this, typeof length === 'object' && length ? length : {
		length: length,
	});
});
INTEGER.prototype.key = INTEGER.key = 'INTEGER';

/**
 * Mock big integer data type
 *
 * @property BIGINT
 */
var BIGINT = NUMBER.inherits(function(length) {
	if (!(this instanceof BIGINT)) {
		return new BIGINT(length);
	}
	
	NUMBER.call(this, typeof length === 'object' && length ? length : {
		length: length,
	});
});
BIGINT.prototype.key = BIGINT.key = 'BIGINT';

/**
 * Mock float data type
 *
 * @property FLOAT
 */
var FLOAT = NUMBER.inherits(function(length, decimals) {
	if (!(this instanceof FLOAT)) {
		return new FLOAT(length, decimals);
	}
	
	NUMBER.call(this, typeof length === 'object' && length ? length : {
		length: length,
		decimals: decimals,
	});
});
FLOAT.prototype.key = FLOAT.key = 'FLOAT';

/**
 * Mock real number data type
 *
 * @property REAL
 */
var REAL = NUMBER.inherits(function(length, decimals) {
	if (!(this instanceof REAL)) {
		return new REAL(length, decimals);
	}
	
	NUMBER.call(this, typeof length === 'object' && length ? length : {
		length: length,
		decimals: decimals,
	});
});
REAL.prototype.key = REAL.key = 'REAL';

/**
 * Mock double data type
 *
 * @property DOUBLE
 */
var DOUBLE = NUMBER.inherits(function(length, decimals) {
	if (!(this instanceof DOUBLE)) {
		return new DOUBLE(length, decimals);
	}
	
	NUMBER.call(this, typeof length === 'object' && length ? length : {
		length: length,
		decimals: decimals,
	});
});
DOUBLE.prototype.key = DOUBLE.key = 'DOUBLE PRECISION';

/**
 * Mock decimal data type
 *
 * @property DECIMAL
 */
var DECIMAL = NUMBER.inherits(function(precision, scale) {
	if (!(this instanceof DECIMAL)) {
		return new DECIMAL(precision, scale);
	}
	
	NUMBER.call(this, typeof precision === 'object' && precision ? precision : {
		precision: precision,
		scale: scale,
	});
});
DECIMAL.prototype.key = DECIMAL.key = 'DECIMAL';

/**
 * Mock boolean data type
 *
 * @property BOOLEAN
 */
var BOOLEAN = Abstract.inherits(function () {
	if (!(this instanceof BOOLEAN)) {
		return new BOOLEAN();
	}
});
BOOLEAN.prototype.key = BOOLEAN.key = 'BOOLEAN';

/**
 * Mock time data type
 *
 * @property TIME
 */
var TIME = Abstract.inherits(function () {
	if (!(this instanceof TIME)) {
		return new TIME();
	}
});
TIME.prototype.key = TIME.key = 'TIME';

/**
 * Mock date data type
 *
 * @property DATE
 */
var DATE = Abstract.inherits(function (length) {
	if (!(this instanceof DATE)) {
		return new DATE(length);
	}
	
	this.options = typeof length === 'object' && length ? length : {
		length: length,
	};
});
DATE.prototype.key = DATE.key = 'DATE';

DATE.prototype.$stringify = function (date, options) {
	return !(date instanceof Date) ? '' :
		date.getFullYear() + '-' + _.padStart(date.getMonth() + 1, 2 , '0') + '-' + _.padStart(date.getDate(), 2, '0') + ' ' +
		_.padStart(date.getHours(), 2, '0') + ':' + _.padStart(date.getMinutes(), 2, '0') + ':' +
		_.padStart(date.getSeconds(), 2, '0') + '.' + _.padStart(date.getMilliseconds(), 3, '0') + ' Z';
};

/**
 * Mock date-only data type
 *
 * @property DATEONLY
 */
var DATEONLY = Abstract.inherits(function () {
	if (!(this instanceof DATEONLY)) {
		return new DATEONLY();
	}
});
DATEONLY.prototype.key = DATEONLY.key = 'DATEONLY';

/**
 * Mock hstore data type
 *
 * @property HSTORE
 */
var HSTORE = Abstract.inherits(function () {
	if (!(this instanceof HSTORE)) {
		return new HSTORE();
	}
});
HSTORE.prototype.key = HSTORE.key = 'HSTORE';

/**
 * Mock JSON data type
 *
 * @property JSON
 */
var JSONT = Abstract.inherits(function () {
	if (!(this instanceof JSONT)) {
		return new JSONT();
	}
});
JSONT.prototype.key = JSONT.key = 'JSON';
JSONT.prototype.$stringify = function (value) {
	return JSON.stringify(value);
};

/**
 * Mock JSONB data type
 *
 * @property JSONB
 */
var JSONB = JSONT.inherits(function () {
	if (!(this instanceof JSONB)) {
		return new JSONB();
	}
});
JSONB.prototype.key = JSONB.key = 'JSONB';

/**
 * Mock now datetime data type
 *
 * @property NOW
 */
var NOW = Abstract.inherits(function () {
	if (!(this instanceof NOW)) {
		return new NOW();
	}
});
NOW.prototype.key = NOW.key = 'NOW';

/**
 * Mock blob data type
 *
 * @property BLOB
 */
var BLOB = Abstract.inherits(function (length) {
	if (!(this instanceof BLOB)) {
		return new BLOB(length);
	}
	
	this.options = typeof length === 'object' && length ? length : {
		length: length,
	};
});
BLOB.prototype.key = BLOB.key = 'BLOB';
BLOB.prototype.$stringify = function (value) {
	return value.toString('hex');
};

/**
 * Mock range data type
 *
 * @property RANGE
 */
var RANGE = Abstract.inherits(function (subtype) {
	if (!(this instanceof RANGE)) {
		return new RANGE(subtype);
	}
	
	this.options = typeof subtype === 'object' && subtype ? subtype : {
		subtype: new (subtype || INTEGER)(),
	};
});
RANGE.prototype.key = RANGE.key = 'RANGE';

/**
 * Mock UUID data type
 *
 * @property UUID
 */
var UUID = Abstract.inherits(function () {
	if (!(this instanceof UUID)) {
		return new UUID();
	}
});
UUID.prototype.key = UUID.key = 'UUID';

/**
 * Mock UUIDV1 data type
 *
 * @property UUIDV1
 */
var UUIDV1 = Abstract.inherits(function () {
	if (!(this instanceof UUIDV1)) {
		return new UUIDV1();
	}
});
UUIDV1.prototype.key = UUIDV1.key = 'UUIDV1';

/**
 * Mock UUIDV4 data type
 *
 * @property UUIDV4
 */
var UUIDV4 = Abstract.inherits(function () {
	if (!(this instanceof UUIDV4)) {
		return new UUIDV4();
	}
});
UUIDV4.prototype.key = UUIDV4.key = 'UUIDV4';

/**
 * Mock virutal data type (even though all test types are technically virtual)
 *
 * @property VIRTUAL
 */
var VIRTUAL = Abstract.inherits(function (subtype, fields) {
	if (!(this instanceof VIRTUAL)) {
		return new VIRTUAL(subtype, fields);
	}
	
	this.returnType = new (subtype || INTEGER)();
	this.fields = fields;
});
VIRTUAL.prototype.key = VIRTUAL.key = 'VIRTUAL';

/**
 * Mock enum data type
 *
 * @property ENUM
 */
var ENUM = Abstract.inherits(function (values) {
	if (!(this instanceof ENUM)) {
		return new ENUM(values);
	}
	
	this.options = typeof values === 'object' && !Array.isArray(values) && values ? values : {
		values: Array.isArray(values) ? values : Array.prototype.slice.call(arguments),
	};
	this.values = this.options.values;
});
ENUM.prototype.key = ENUM.key = 'ENUM';

/**
 * Mock array data type
 *
 * @property ARRAY
 */
var ARRAY = Abstract.inherits(function (subtype) {
	if (!(this instanceof ARRAY)) {
		return new ARRAY(subtype);
	}
	
	this.options = typeof subtype === 'object' && subtype ? subtype : {
		type: subtype,
	};
	this.type = typeof this.options.type === 'function' ? new this.options.type() : this.options.type;
});
ARRAY.prototype.key = ARRAY.key = 'ARRAY';

ARRAY.is = function (obj, type) {
	return obj.type instanceof type;
};

/**
 * Mock geometry data type
 *
 * @property GEOMETRY
 */
var GEOMETRY = Abstract.inherits(function (subtype, srid) {
	if (!(this instanceof GEOMETRY)) {
		return new GEOMETRY(subtype, srid);
	}
	
	this.options = typeof subtype === 'object' && subtype ? subtype : {
		type: subtype,
		srid: srid,
	};
	this.type = this.options.type;
	this.srid = this.options.srid;
});
GEOMETRY.prototype.key = GEOMETRY.key = 'GEOMETRY';

/**
 * Mock geography data type
 *
 * @property GEOGRAPHY
 */
var GEOGRAPHY = Abstract.inherits(function (subtype, srid) {
	if (!(this instanceof GEOGRAPHY)) {
		return new GEOGRAPHY(subtype, srid);
	}
	
	this.options = typeof subtype === 'object' && subtype ? subtype : {
		type: subtype,
		srid: srid,
	};
	this.type = this.options.type;
	this.srid = this.options.srid;
});
GEOGRAPHY.prototype.key = GEOGRAPHY.key = 'GEOGRAPHY';

module.exports = function (Sequelize) {
	Sequelize.STRING    = STRING;
	Sequelize.CHAR      = CHAR;
	Sequelize.TEXT      = TEXT;
	Sequelize.INTEGER   = INTEGER;
	Sequelize.BIGINT    = BIGINT;
	Sequelize.FLOAT     = FLOAT;
	Sequelize.REAL      = REAL;
	Sequelize.DOUBLE    = DOUBLE;
	Sequelize.DECIMAL   = DECIMAL;
	Sequelize.BOOLEAN   = BOOLEAN;
	Sequelize.TIME      = TIME;
	Sequelize.DATE      = DATE;
	Sequelize.DATEONLY  = DATEONLY;
	Sequelize.HSTORE    = HSTORE;
	Sequelize.JSON      = JSONT;
	Sequelize.JSONB     = JSONB;
	Sequelize.NOW       = NOW;
	Sequelize.BLOB      = BLOB;
	Sequelize.RANGE     = RANGE;
	Sequelize.UUID      = UUID;
	Sequelize.UUIDV1    = UUIDV1;
	Sequelize.UUIDV4    = UUIDV4;
	Sequelize.VIRTUAL   = VIRTUAL;
	Sequelize.ENUM      = ENUM;
	Sequelize.ARRAY     = ARRAY;
	Sequelize.GEOMETRY  = GEOMETRY;
	Sequelize.GEOGRAPHY = GEOGRAPHY;
};
