'use strict';

/**
 * Instances are the individual results from a Sequelize call. In SequelizeMock, these objects
 * have most of the same attributes as in the normal Sequelize Instance, however they also have
 * a few additional bits of functionality.
 * 
 * Values for instances are defined by defaults provided to the Model Mock on definition and
 * they are overriden by values provided during queries. The major exceptions are the `id`,
 * `createdAt`, and `updatedAt` values, which are available on all instances regardless of if
 * they are in the query or default values. This is the same way Sequelize will add these to
 * your instances.
 * 
 * The `id` value is an auto-incrementing value with each query (unless provided as a part of
 * your query). The `createdAt` and `updatedAt` values are set to the current timestamp at the
 * time the instance is created.
 * 
 * Additionally, there are a few additional test methods you can use to test functionality
 * coming from Sequelize behavior. These methods are prefixed with a `$` so as to distinguish
 * them from mocked native Sequelize functionality. Any test specific properties also include
 * a double underscore (`__`) so that they are also uniquely distinguished from mock internals.
 * 
 * @name Instance
 * @fileOverview Instances of Models created by Model function calls.
 */

var bluebird = require('bluebird'),
	_ = require('lodash'),
	Errors = require('./errors');

var id = 0;

/**
 * Instance Mock Object. Creation of this object should almost always be handled through the
 * `Model` class methods. In cases when you need to create an `Instance` directly, providing
 * the `defaults` parameter should be enough, as the `obj` overrides parameter is optional.
 * 
 * @class Instance
 * @constructor
 * @param {Object} defaults The default values. This will come from the Model when created via that class
 * @param {Object} [obj] Any overridden values that should be specific to this instance
 **/
function fakeModelInstance (values, options) {
	this.options = options || {};
	
	/**
	 * As with Sequelize, we include a `dataValues` property which contains the values for the
	 * instance. As with Sequelize, you should use other methods to edit the values for any
	 * code that will also interact with Sequelize.
	 * 
	 * For test code, when possible, we also recommend you use other means to validate. But
	 * this object is also available if needed.
	 * 
	 * @name dataValues
	 * @alias _values
	 * @member {Object}
	 **/
	this.dataValues = this._values = _.clone(values || {});
	
	this.hasPrimaryKeys = this.Model.options.hasPrimaryKeys;
	if(this.hasPrimaryKeys) {
		this.dataValues.id = this.dataValues.id || (++id);
	}
	
	if(this.Model.options.timestamps) {
		this.dataValues.createdAt = this.dataValues.createdAt || new Date();
		this.dataValues.updatedAt = this.dataValues.updatedAt || new Date();
	}
	
	// Double underscore for test specific internal variables
	this.__validationErrors = [];
	
	// Add the items from the dataValues to be accessible via a simple `instance.value` call
	var self = this;
	_.each(this.dataValues, function (val, key) {
		
		Object.defineProperty(self, key, {
			get: function () {
				return fakeModelInstance.prototype.get.call(self, key);
			},
			set: function (value) {
				fakeModelInstance.prototype.set.call(self, key, value);
			},
		});
	});
}

/* Test Specific Functionality
 * 
 */
/**
 * Create a new validation error to be triggered the next time a validation would run. Any
 * time Sequelize code would go to the database, it will trigger a check for any validation
 * errors that should be thrown. This allows you to test any validation failures in a more
 * unit-testing focused manner.
 * 
 * Once a validation has occured, all validation errors will be emptied from the queue and
 * returned in a single `ValidationError` object.
 * 
 * If you do add validation errors for a test, be sure to clear the errors after each test
 * so you don't fail your next test in case a validation does not occur. You can do so by
 * calling the [`$clearValidationErrors`](#clearValidationErrors) method.
 * 
 * @example
 * myUser.$addValidationError('email', 'Not a valid email address', 'InvalidEmail');
 * 
 * // ...
 * 
 * myUser.save().then(function () {}, function (error) {
 * 	// error will be a ValidationErrorItem
 * 	error.errors[0].type === 'InvalidEmail';
 * });
 * 
 * @instance
 * @see {@link clearValidationErrors}
 * @param {String} col Field to add validation error for
 * @param {String} [message] Message the error should contain
 * @param {String} [type] Type of the validation error
 * @return {Instance} Instance object for chainability
 **/
fakeModelInstance.prototype.$addValidationError = function (col, message, type) {
	this.__validationErrors.push({
		col: col,
		message: message,
		type: type,
	})
	return this;
};

/**
 * Removes all validation errors that would be triggered against a specific column.
 * 
 * @instance
 * @param {String} col Field to remove validation errors for
 * @return {Instance} The object for chainability
 **/
fakeModelInstance.prototype.$removeValidationError = function (col) {
	this.__validationErrors = _.filter(this.__validationErrors, function (err) {
		// Filter to errors whose columns that are not the passed in column
		return err.col !== col;
	});
	return this;
};

/**
 * Removes all validation errors for every column.
 * 
 * @example
 * beforeEach(function () {
 * 	myUser = new Instance({ 'name': 'Test' });
 * });
 * 
 * afterEach(function () {
 * 	// Recommended that you always run $clearValidationErrors after
 * 	// each test so that you don't pollute your test data
 * 	myUser.$clearValidationErrors();
 * });
 * 
 * @instance
 * @return {Instance} The object for chainability
 **/
fakeModelInstance.prototype.$clearValidationErrors = function () {
	this.__validationErrors = [];
	return this;
};

/**
 * Sets the value for the given key. Also accepts an object as the first parameter
 * and it will loop through the key/value pairs and set each.
 * 
 * @instance
 * @param {String|Object} key Key to set the value for. If `key` is an Object, each key/value pair will be set on the Instance
 * @param {Any} [val] Any value to set on the Instance. If `key` is an Object, this parameter is ignored.
 * @return {Instance} The object for chainability
 **/
fakeModelInstance.prototype.set = function(key, val) {
	if(typeof key === 'object' && key !== null) {
		// Loop over the object and perform a set for each key/value pair
		var self = this;
		_.each(key, function (value, key) {
			self._values[key] = value;
		});
	} else {
		this._values[key] = val;
	}
	
	return this;
};

/**
 * If no key is provided, it will return all values on the Instance.
 * 
 * If a key is provided, it will return that value
 * 
 * @instance
 * @param {String|Object} [key] Key to get the value for
 * @return {Any|Object} either the value of the key, or all the values if there is no key or key is an object with plain set to true: {plain: true}
 **/
fakeModelInstance.prototype.get = function (key) {
	if(!key || key.plain) {
		return _.clone(this._values);
	}
	else {
		return this._values[key];
	}
};

/**
 * Triggers validation. If there are errors added through `$addValidationError` they will
 * be returned and the queue of validation errors will be cleared.
 * 
 * As with Sequelize, this will **resolve** any validation errors, not throw the errors.
 * 
 * @instance
 * @return {Promise<ValidationErrorItem|undefined>} will resolve with any errors, or with nothing if there were no errors queued.
 **/
fakeModelInstance.prototype.validate = function () {
	var self = this,
		validationError;
	
	// If we have a queued validation error, send that along with validation
	if(this.__validationErrors && this.__validationErrors.length) {
		var errors = _.map(this.__validationErrors, function (err) {
			return new Errors.ValidationErrorItem(
				err.message || ('Validation Error for value in column ' + err.col),
				err.type || 'Validation error',
				err.col,
				err.col ? self.get(err.col) : undefined
			);
		});
		validationError = new Errors.ValidationError(null, errors);
		this.$clearValidationErrors();
	}
	
	return bluebird.resolve(validationError);
};

/**
 * Because there is no database that it saves to, this will mainly trigger validation of
 * the Instance and reject the promise if there are any validation errors.
 * 
 * @instance
 * @return {Promise<Instance>} Instance if there are no validation errors, otherwise it will reject the promise with those errors
 **/
fakeModelInstance.prototype.save = function () {
	var self = this;
	return this.validate().then(function (err) {
		if(err)
			throw err;
		self.options.isNewRecord = false;
		self.isNewRecord = false;
		return self;
	});
};

/**
 * This simply sets the `deletedAt` value and has no other effect on the mock Instance
 * 
 * @instance
 * @return {Promise} will always resolve as a successful destroy
 **/
fakeModelInstance.prototype.destroy = function () {
	this._values.deletedAt = new Date();
	return bluebird.resolve();
};

/**
 * This has no effect on the Instance
 * 
 * @instance
 * @return {Promise<Instance>} will always resolve with the current instance
 **/
fakeModelInstance.prototype.reload = function () {
	return bluebird.resolve(this);
};

/**
 * Acts as a `set()` then a `save()`. That means this function will also trigger validation
 * and pass any errors along
 * 
 * @instance
 * @see {@link set}
 * @see {@link save}
 * @return {Promise<Instance>} Promise from the save function
 **/
fakeModelInstance.prototype.update = function (obj) {
	for(var k in obj)
		this.set(k, obj[k]);
	return this.save();
};

/**
 * Returns all the values in a JSON representation.
 * 
 * @method toJSON
 * @alias toJson
 * @instance
 * @return {Object} all the values on the object
 **/
fakeModelInstance.prototype.toJSON = fakeModelInstance.prototype.toJson = function () {
	return this.get();
};

module.exports = fakeModelInstance;
