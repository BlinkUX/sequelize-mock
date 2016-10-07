'use strict';

var bluebird = require('bluebird'),
	_ = require('lodash');

var id = 0;

// Fake Instance API
function fakeModelInstance (defaults, obj) {
	id++;
	this._values = obj || {};
	_.defaultsDeep(this._values, defaults || {});
	this._values.id = this._values.id || id;
	this._values.createdAt = this._values.createdAt || new Date();
	this._values.updatedAt = this._values.updatedAt || new Date();
}
fakeModelInstance.prototype.set = function(key, val) { this._values[key] = val; };
fakeModelInstance.prototype.get = function (key) { return this._values[key]; };
fakeModelInstance.prototype.save = function () { return bluebird.resolve(this); };
fakeModelInstance.prototype.destroy = function () { return bluebird.resolve(); };
fakeModelInstance.prototype.reload = function () { return bluebird.resolve(this); };
fakeModelInstance.prototype.update = function (obj) {
	for(var k in obj)
		this.set(k, obj[k]);
	return bluebird.resolve(this);
};
fakeModelInstance.prototype.toJSON = fakeModelInstance.prototype.toJson = function () { return this._values; };

module.exports = fakeModelInstance;
