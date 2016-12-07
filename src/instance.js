'use strict';

var bluebird = require('bluebird'),
	_ = require('lodash'),
	Errors = require('./errors');

var id = 0;

// Fake Instance API
function fakeModelInstance (defaults, obj) {
	id++;
	this._values = _.clone(obj || {});
	_.defaultsDeep(this._values, defaults || {});
	this._values.id = this._values.id || id;
	this._values.createdAt = this._values.createdAt || new Date();
	this._values.updatedAt = this._values.updatedAt || new Date();
	
	// Double underscore for test specific internal variables
	this.__validationErrors = [];
}
fakeModelInstance.prototype.set = function(key, val) { this._values[key] = val; };
fakeModelInstance.prototype.get = function (key) { return this._values[key]; };
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
fakeModelInstance.prototype.save = function () {
	var self = this;
	return this.validate().then(function (err) {
		if(err)
			throw err;
		
		return self;
	});
};
fakeModelInstance.prototype.destroy = function () { return bluebird.resolve(); };
fakeModelInstance.prototype.reload = function () { return bluebird.resolve(this); };
fakeModelInstance.prototype.update = function (obj) {
	for(var k in obj)
		this.set(k, obj[k]);
	return this.save();
};
fakeModelInstance.prototype.toJSON = fakeModelInstance.prototype.toJson = function () { return this._values; };

/**	Test Specific Functionality
  *	
  **/
fakeModelInstance.prototype.$addValidationError = function (col, message, type) {
	this.__validationErrors.push({
		col: col,
		message: message,
		type: type,
	})
	return this;
};

fakeModelInstance.prototype.$removeValidationError = function (col) {
	this.__validationErrors = _.filter(this.__validationErrors, function (err) {
		// Filter to errors whose columns that are not the passed in column
		return err.col !== col;
	});
	return this;
};

fakeModelInstance.prototype.$clearValidationErrors = function () {
	this.__validationErrors = [];
	return this;
};

module.exports = fakeModelInstance;
