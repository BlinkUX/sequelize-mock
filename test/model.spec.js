'use strict';

var should = require('should');
var bluebird = require('bluebird');
var proxyquire = require('proxyquire').noCallThru();

var InstanceMock = function () { this._args = arguments; };
InstanceMock.prototype.save = function () { return bluebird.resolve(this); };
var UtilsMock = {
	uppercaseFirst: function (str) { return str; },
	singularize: function (str) { return str; },
	pluralize: function (str) { return str; },
};

var Model = proxyquire('../src/model', {
	'./utils': UtilsMock,
	'./instance': InstanceMock,
});

describe('Model', function () {
	
	describe('__constructor', function () {
		it('should assign a name to a model', function () {
			var mdl = new Model('foo');
			mdl.name.should.equal('foo');
		});
		
		it('should accept an object of default values', function () {
			var mdl = new Model('baz', {
				'foo': 'bar',
			});
			
			mdl.name.should.equal('baz');
			mdl._defaults.should.have.property('foo').which.is.exactly('bar');
		});
		
		it('should accept default object as first argument', function () {
			var mdl = new Model({
				'foo': 'bar',
			});
			mdl.name.should.equal('');
			mdl._defaults.should.have.property('foo').which.is.exactly('bar');
		});
		
		it('should assign a name and a default set of properties', function () {
			var mdl = new Model('foo', {
				'bar': 'baz',
			});
			mdl.name.should.equal('foo');
			mdl._defaults.should.have.property('bar').which.is.exactly('baz');
		});
		
		it('should assign instanceMethods functions to Instance prototype', function () {
			var fooFn = function () { return 'bar'; },
				mdl = new Model('baz', {}, {
					instanceMethods: {
						foo: fooFn,
					},
				});
			
			mdl.Instance.prototype.should.have.property('foo').which.is.exactly(fooFn);
		});
		
		it('should have a default _wasCreated value of true', function () {
			var mdl = new Model('foo');
			mdl._wasCreated.should.be.true();
		});
		
		it('should return an object with the proper API functions', function () {
			var mdl = new Model('foo');
			
			// Not yet supported functions are commented out
			
			// mdl.should.have.property('removeAttributes').which.is.a.Function();
			mdl.should.have.property('sync').which.is.a.Function();
			// mdl.should.have.property('drop').which.is.a.Function();
			// mdl.should.have.property('schema').which.is.a.Function();
			mdl.should.have.property('getTableName').which.is.a.Function();
			mdl.should.have.property('unscoped').which.is.a.Function();
			// mdl.should.have.property('addScope').which.is.a.Function();
			mdl.should.have.property('scope').which.is.a.Function();
			mdl.should.have.property('find').which.is.a.Function();
			mdl.should.have.property('findAll').which.is.a.Function();
			mdl.should.have.property('findById').which.is.a.Function();
			mdl.should.have.property('findOne').which.is.a.Function();
			// mdl.should.have.property('aggregate').which.is.a.Function();
			// mdl.should.have.property('count').which.is.a.Function();
			// mdl.should.have.property('findAndCount').which.is.a.Function();
			mdl.should.have.property('max').which.is.a.Function();
			mdl.should.have.property('min').which.is.a.Function();
			mdl.should.have.property('sum').which.is.a.Function();
			mdl.should.have.property('build').which.is.a.Function();
			mdl.should.have.property('create').which.is.a.Function();
			// mdl.should.have.property('findOrInitialize').which.is.a.Function();
			mdl.should.have.property('findOrCreate').which.is.a.Function();
			// mdl.should.have.property('findCreateFind').which.is.a.Function();
			mdl.should.have.property('upsert').which.is.a.Function();
			// mdl.should.have.property('bulkCreate').which.is.a.Function();
			// mdl.should.have.property('truncate').which.is.a.Function();
			mdl.should.have.property('destroy').which.is.a.Function();
			// mdl.should.have.property('restore').which.is.a.Function();
			mdl.should.have.property('update').which.is.a.Function();
			// mdl.should.have.property('describe').which.is.a.Function();
		});
	});
	
	describe('#scope', function () {
		var mdl;
		beforeEach(function () {
			mdl = new Model('foo');
		});
		
		it('should return a mock Model object', function () {
			mdl.scope().should.be.instanceOf(Model);
		});
	});
	
	describe('#sync', function () {
		var mdl;
		beforeEach(function () {
			mdl = new Model('foo');
		});
		
		it('should return a promise', function () {
			mdl.sync().should.be.instanceOf(bluebird);
		});
	});
	
	describe('#drop', function () {
		var mdl;
		beforeEach(function () {
			mdl = new Model('foo');
		});
		
		it('should return a promise', function () {
			mdl.drop().should.be.instanceOf(bluebird);
		});
	});
	
	describe('#build', function () {
		var mdl;
		beforeEach(function () {
			mdl = new Model('foo');
		});
		
		it('should pass along the default values and the override values to Instance', function () {
			mdl._defaults = {
				'foo': 'bar'
			};
			var vals = {
				'baz' : 'bin'
			};
			
			var inst = mdl.build(vals);
			inst._args[0].should.equal(mdl._defaults);
			inst._args[1].should.equal(vals);
		});
		
		it('should build Instance with Instance.prototype functions', function () {
			mdl.Instance.prototype.bar = function () {};
			
			var inst = mdl.build();
			inst.should.be.instanceOf(InstanceMock);
			inst.should.have.property('bar').which.is.exactly(mdl.Instance.prototype.bar);
		});
	});
	
	describe('#create', function () {
		var mdl;
		beforeEach(function () {
			mdl = new Model('foo');
		});
		
		it('should create Instance with Instance.prototype functions', function (done) {
			var vals = {
				'baz' : 'bin'
			};
			
			mdl.create(vals).then(function (inst) {
				inst.should.be.instanceOf(InstanceMock);
				inst._args[1].should.equal(vals);
				done();
			}).catch(done);
		});
	});
	
	describe('#update', function () {
		var mdl;
		beforeEach(function () {
			mdl = new Model('foo');
		});
		
		it('should pass back default of 1 row updated', function (done) {
			var vals = {
				'baz' : 'bin'
			};
			
			mdl.update(vals).spread(function (number, rows) {
				number.should.equal(1);
				done();
			}).catch(done);
		});
		
		it('should pass back row updated', function (done) {
			var vals = {
				'baz' : 'bin'
			};
			
			mdl.update(vals).spread(function (number, rows) {
				rows.should.be.Array();
				rows[0]._args[1].should.equal(vals);
				done();
			}).catch(done);
		});
	});
	
	describe('#findOne', function () {
		var mdl;
		beforeEach(function () {
			mdl = new Model('foo');
		});
		
		it('should find a row with no options given', function (done) {
			mdl.findOne().then(function (inst) {
				should.exist(inst)
				inst.should.be.instanceOf(InstanceMock);
				done();
			}).catch(done);
		});
		
		it('should find a row with the values from the `where` query', function (done) {
			var options = {
				where: {
					'foo': 'bar',
				},
			};
			
			mdl.findOne(options).then(function (inst) {
				inst._args[1].should.equal(options.where);
				done();
			}).catch(done);
		});
	});
	
	describe('#findById', function () {
		var mdl;
		beforeEach(function () {
			mdl = new Model('foo');
		});
		
		it('should find a row with the given id', function (done) {
			mdl.findById(1234).then(function (inst) {
				inst._args[1].id.should.equal(1234);
				done();
			}).catch(done);
		});
	});
	
	describe('#<sum/min/max>', function () {
		var mdl;
		beforeEach(function () {
			mdl = new Model('foo');
		});
		
		it('should return the default value for the field', function (done) {
			mdl._defaults.foo = 1234;
			
			mdl.sum('foo').then(function (count) {
				count.should.equal(1234);
				done();
			}).catch(done);
		});
	});
	
	describe('#upsert', function () {
		var mdl;
		beforeEach(function () {
			mdl = new Model('foo');
		});
		
		it('should return the _wasCreated value for the model', function (done) {
			mdl._wasCreated = false;
			
			mdl.upsert().then(function (created) {
				created.should.equal(mdl._wasCreated);
				done();
			}).catch(done);
		});
	});
	
	describe('#findOrCreate', function () {
		var mdl;
		beforeEach(function () {
			mdl = new Model('foo');
		});
		
		it('should pass along where value to Instance creation', function (done) {
			var options = {
				where: {
					'foo': 'bar',
				},
			};
			
			mdl.findOrCreate(options).spread(function (inst, created) {
				inst._args[1].should.equal(options.where);
				done();
			}).catch(done);
		});
		
		it('should return the _wasCreated value for the model', function (done) {
			mdl._wasCreated = false;
			
			mdl.findOrCreate({}).spread(function (inst, created) {
				created.should.equal(mdl._wasCreated);
				done();
			}).catch(done);
		});
	});
	
	describe('#bulkCreate', function () {
		var mdl;
		beforeEach(function () {
			mdl = new Model('foo');
		});
		
		it('should create each model in the passed array', function (done) {
			var vals = [
				{
					'baz' : 'bin'
				},
				{
					'qux' : 'quuz'
				},
			];
			
			mdl.bulkCreate(vals).then(function (arr) {
				arr.should.be.an.Array();
				arr[0]._args[1].should.equal(vals[0]);
				arr[1]._args[1].should.equal(vals[1]);
				done();
			}).catch(done);
		});
	});
	
	describe('#findAll', function () {
		var mdl;
		beforeEach(function () {
			mdl = new Model('foo');
		});
		
		it('should pass along where value to Instance creation', function (done) {
			var options = {
				where: {
					'foo': 'bar',
				},
			};
			
			mdl.findAll(options).then(function (rows) {
				rows.length.should.equal(1);
				rows[0]._args[1].should.equal(options.where);
				done();
			}).catch(done);
		});
		
		it('should still find results if there is not options', function (done) {
			mdl.findAll().then(function (rows) {
				rows.length.should.equal(1);
				done();
			}).catch(done);
		});
	});
	
	describe('#destroy', function () {
		var mdl;
		beforeEach(function () {
			mdl = new Model('foo');
		});
		
		it('should return a default value of 1 for number of rows destroyed', function (done) {
			mdl.destroy().then(function (rows) {
				rows.should.equal(1);
				done();
			}).catch(done);
		});
		
		it('should return the limit for number of rows destroyed if that is passed in', function (done) {
			mdl.destroy({
				limit: 5
			}).then(function (rows) {
				rows.should.equal(5);
				done();
			}).catch(done);
		});
	});
	
	describe('#getTableName', function () {
		var mdl;
		beforeEach(function () {
			mdl = new Model('foo');
		});
		
		it('should return a default value of 1 for number of rows destroyed', function () {
			mdl.name = 'bar';
			
			mdl.getTableName().should.equal('bar');
		});
	});
	
});
