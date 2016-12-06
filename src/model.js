'use strict';

var Promise = require('bluebird'),
	_ = require('lodash'),
	Utils = require('./utils'),
	Instance = require('./instance');

// Fake Model API
function fakeModel (name, defaults, opts) {
	if(typeof name === 'object') {
		defaults = name;
		name = '';
	}
	this.name = name;
	this._defaults = defaults || {};
	this._functions = {};
	if(opts && opts.instanceMethods) {
		_.extend(this._functions, opts.instanceMethods);
	}
	this._wasCreated = true;
	this.Instance = {};
	this.Instance.prototype = this._functions;
}
//
fakeModel.prototype.scope =
fakeModel.prototype.unscoped = function () { return this; };
//
fakeModel.prototype.sync = function () { return Promise.resolve(this); };
//
fakeModel.prototype.build =
fakeModel.prototype.generateTestModel = function (obj) {
	var item = new Instance(this._defaults, obj);
	for(var f in this._functions) {
		item[f] = this._functions[f];
	}
	return item;
};
//
fakeModel.prototype.generateModelPromise = function (obj) {
	return Promise.resolve( this.generateTestModel(obj) );
};
fakeModel.prototype.create = function (obj) {
	return this.generateTestModel(obj).save();
};
//
fakeModel.prototype.update = function (obj) {
	return Promise.resolve([ 1, [this.generateTestModel(obj)] ]);
};
fakeModel.prototype.generateModelsPromises = function (obj) {
	return Promise.resolve([ this.generateTestModel(obj) ]);
};
//
fakeModel.prototype.find =
fakeModel.prototype.findOne = function (obj) {
	return this.generateModelPromise(obj ? obj.where : {});
};
//
fakeModel.prototype.findById = function (id) {
	return this.generateModelPromise({ id: id });
};
//
fakeModel.prototype.sum =
fakeModel.prototype.min =
fakeModel.prototype.max = function (field) {
	return Promise.resolve(this._defaults[field]);
}
//
fakeModel.prototype.insertOrUpdate =
fakeModel.prototype.upsert = function () {
	return Promise.resolve(!!this._wasCreated);
}
fakeModel.prototype.findOrCreate = function (obj) {
	return Promise.resolve( [this.generateTestModel(obj.where), !!this._wasCreated] );
};
//
fakeModel.prototype.findAll =  function (obj) {
	return this.generateModelsPromises(obj ? obj.where : {});
};
// Special
fakeModel.prototype.destroy = function () { return Promise.resolve(1); };
fakeModel.prototype.getTableName = function () {
	return this.name;
};
// Noops
fakeModel.prototype.addHook =
fakeModel.prototype.removeHook = function () {};

// Associations
fakeModel.prototype.belongsTo = fakeModel.prototype.hasOne = function (item, options) {
	if(!(item instanceof fakeModel)) {
		return;
	}
	
	var isString = typeof item === 'string',
		name;
	if(options && options.as) {
		name = options.as;
	} else if (isString) {
		name = item;
	} else {
		name = item.getTableName();
	}
	
	var singular = Utils.uppercaseFirst( Utils.singularize(name) ),
		plural = Utils.uppercaseFirst( Utils.pluralize(name) ),
		self = this,
		noop = function () { return Promise.resolve(self); };
	
	if(isString) {
		this._functions['get' + singular] = function (opts) { return Promise.resolve(new Instance(null, opts && opts.where ? opts.where : opts)); };
	} else {
		this._functions['get' + singular] = item.findOne.bind(item);
	}
	this._functions['set' + singular] = noop;
	this._functions['create' + singular] = item.create ? item.create.bind(item) : noop;
};

fakeModel.prototype.belongsToMany = fakeModel.prototype.hasMany = function (item, options) {
	if(!(item instanceof fakeModel)) {
		return {
			through: {
				model: new fakeModel()
			}
		};
	}
	
	var isString = typeof item === 'string',
		name, singular, plural;
	if(options && options.as) {
		name = options.as;
		singular = Utils.uppercaseFirst( Utils.singularize(name) );
		plural = Utils.uppercaseFirst( name );
		
	} else {
		if (isString) {
			name = item;
		} else {
			name = item.getTableName();
		}
		singular = Utils.uppercaseFirst( Utils.singularize(name) );
		plural = Utils.uppercaseFirst( Utils.pluralize(name) );
	}
	
	var self = this,
		noop = function () { return Promise.resolve(self); };
	
	if(isString) {
		this._functions['get' + plural] = function (opts) { return Promise.resolve([new Instance(name, opts && opts.where ? opts.where : opts)]); };
	} else {
		this._functions['get' + plural] = item.findAll.bind(item);
	}
	this._functions['set' + plural] = noop;
	this._functions['add' + singular] = noop;
	this._functions['add' + plural] = noop;
	this._functions['create' + singular] = item.create ? item.create.bind(item) : noop;
	this._functions['remove' + singular] = noop;
	this._functions['remove' + plural] = noop;
	this._functions['has' + singular] = function () { return Promise.resolve(false); };
	this._functions['has' + plural] = function () { return Promise.resolve(false); };
	this._functions['count' + plural] = function () { return Promise.resolve(0); };
	
	return {
		through: {
			model: new fakeModel()
		}
	};
};

module.exports = fakeModel;