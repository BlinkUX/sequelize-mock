'use strict';

var should = require('should');
var bluebird = require('bluebird');
var proxyquire = require('proxyquire').noCallThru();

var Instance = proxyquire('../src/instance', {
});

describe('Instance', function () {
	
	describe('__constructor', function () {
		it('should always assign an id, createdAt, and updatedAt value', function () {
			var inst = new Instance();
			
			inst._values.should.have.property('id');
			inst._values.should.have.property('createdAt');
			inst._values.should.have.property('updatedAt');
		});
		it('should not override passed in id, createdAt, and updatedAt values', function () {
			var inst = new Instance({}, {
				id: 5555,
				createdAt: 'Yesterday',
				updatedAt: 'Yesterday',
			});
			
			inst._values.should.have.property('id').which.is.exactly(5555);
			inst._values.should.have.property('createdAt').which.is.exactly('Yesterday');
			inst._values.should.have.property('updatedAt').which.is.exactly('Yesterday');
		});
		
		it('should assign any default values', function () {
			var inst = new Instance({
				'foo': 'bar',
			});
			
			inst._values.should.have.property('foo').which.is.exactly('bar');
			inst._values.should.not.have.property('baz');
		});
		
		it('should override default values with passed in values', function () {
			var inst = new Instance({
				'foo': 'bar',
				'baz': 'bin',
			}, {
				'foo': 'test',
			});
			
			inst._values.should.have.property('foo').which.is.exactly('test');
			inst._values.should.have.property('baz').which.is.exactly('bin');
		});
	});
	
	describe('#set', function () {
		it('should set the value of a property on the object', function () {
			var inst = new Instance();
			
			inst._values.should.not.have.property('foo');
			inst.set('foo', 'bar');
			
			inst._values.should.have.property('foo').which.is.exactly('bar');
		});
	});
	
	describe('#get', function () {
		it('should get the value of a property on the object', function () {
			var inst = new Instance();
			inst._values.foo = 'bar';
			
			inst.get('foo').should.be.exactly('bar');
		});
	});
	
	describe('#save', function () {
		it('should return a promise object', function (done) {
			var inst = new Instance();
			
			inst.save().then(function (passedIn) {
				passedIn.should.be.exactly(inst);
				done();
			}).catch(done);
		});
	});
	
	describe('#destroy', function () {
		it('should return a promise object', function () {
			var inst = new Instance();
			inst.destroy().should.be.instanceOf(bluebird);
		});
	});
	
	describe('#reload', function () {
		it('should return a promise object', function (done) {
			var inst = new Instance();
			
			inst.reload().then(function (passedIn) {
				passedIn.should.be.exactly(inst);
				done();
			}).catch(done);
		});
	});
	
	describe('#update', function () {
		it('should update values passed in', function () {
			var inst = new Instance();
			
			inst._values.should.not.have.property('foo');
			inst.update({
				'foo': 'bar'
			});
			
			inst._values.should.have.property('foo').which.is.exactly('bar');
		});
		
		it('should return a promise object', function (done) {
			var inst = new Instance();
			
			inst.update().then(function (passedIn) {
				passedIn.should.be.exactly(inst);
				done();
			}).catch(done);
		});
	});
	
	describe('#toJSON', function () {
		it('should have the function aliased to toJson', function () {
			var inst = new Instance();
			inst.should.have.property('toJSON');
			inst.toJSON.should.be.exactly(inst.toJson);
		});
		
		it('should return an object that is not an Instance', function () {
			var inst = new Instance();
			inst.toJSON().should.not.be.an.instanceOf(Instance);
		});
		
		it('should return an object with the values of the instance', function () {
			var inst = new Instance();
			
			inst.set('foo', 'bar');
			inst.set('baz', 'bin');
			
			var json = inst.toJSON();
			json.should.have.property('foo').which.is.exactly('bar');
			json.should.have.property('baz').which.is.exactly('bin');
		});
	});
	
});
