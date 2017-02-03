'use strict';

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

module.exports = function (Sequelize) {
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.STRING    = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.CHAR      = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.TEXT      = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.INTEGER   = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.BIGINT    = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.FLOAT     = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.REAL      = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.DOUBLE    = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.DECIMAL   = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.BOOLEAN   = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.TIME      = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.DATE      = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.DATEONLY  = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.HSTORE    = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.JSON      = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.JSONB     = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.NOW       = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.BLOB      = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.RANGE     = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.UUID      = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.UUIDV1    = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.UUIDV4    = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.VIRTUAL   = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.ENUM      = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.ARRAY     = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.GEOMETRY  = noop;
	/**
	 * Mock data type. Simply a no-op function for use in definitions
	 * 
	 * @property
	 **/
	Sequelize.GEOGRAPHY = noop;
};
