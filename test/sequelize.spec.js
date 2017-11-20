'use strict';

var should = require('should');
var bluebird = require('bluebird');
var proxyquire = require('proxyquire').noCallThru();

var ModelMock = function () {};
var PathMock = {
	normalize: function (p) { return p },
	resolve: function (p) { return p },
	dirname: function (p) { return p },
};

var UtilsMock = {
	stack: function () { return {}; },
};

var PackageMock = {
	version: 'test',
};
var ErrorMock = {
	'BaseError': function () { return 'base error'; },
	'OtherError': function () { return 'base error'; },
};
var QueryInterfaceMock = function () {};

var lastImportTestCall;
function importTestFunc() {
	lastImportTestCall = arguments;
}

var Sequelize = proxyquire('../src/sequelize', {
	'path'     : PathMock,
	'./model'  : ModelMock,
	'./utils'  : UtilsMock,
	'./errors' : ErrorMock,
	'./queryinterface' : QueryInterfaceMock,
	'../package.json'  : PackageMock,
	'./data-types'     : function () {},
	
	'import-test'      : importTestFunc,
});

describe('Sequelize', function () {
	
	it('should have top level constants on class', function () {
		Sequelize.should.have.property('version').which.is.equal('test');
		Sequelize.should.have.property('options');
		Sequelize.should.have.property('Utils').which.is.equal(UtilsMock);
		Sequelize.should.have.property('Promise').which.is.equal(bluebird);
		Sequelize.should.have.property('Model').which.is.equal(ModelMock);
	});
	
	it('should have top level constants on instances of class', function () {
		var seq = new Sequelize();
		seq.should.have.property('Utils').which.is.equal(UtilsMock);
		seq.should.have.property('Promise').which.is.equal(bluebird);
		seq.should.have.property('Model').which.is.equal(ModelMock);
	});
	
	it('should have Error classes exposed on class and prototype', function () {
		Sequelize.should.have.property('OtherError').which.is.equal(ErrorMock.OtherError);
		Sequelize.prototype.should.have.property('OtherError').which.is.equal(ErrorMock.OtherError);
	});
	
	it('should alias BaseError class', function () {
		Sequelize.should.have.property('Error').which.is.equal(ErrorMock.BaseError);
		Sequelize.prototype.should.have.property('Error').which.is.equal(ErrorMock.BaseError);
	});
	
	describe('__constructor', function () {
		it('should default dialect to mock', function () {
			var seq = new Sequelize();
			seq.options.dialect.should.equal('mock');
		});
		
		it('should support setting a dialect', function () {
			var seq = new Sequelize({
				dialect: 'test',
			});
			seq.options.dialect.should.equal('test');
		});
		
		it('should support options as second argument', function () {
			var seq = new Sequelize('database', {
				dialect: 'test',
			});
			seq.options.dialect.should.equal('test');
		});
		
		it('should support options as third argument', function () {
			var seq = new Sequelize('database', 'user', {
				dialect: 'test',
			});
			seq.options.dialect.should.equal('test');
		});
		
		it('should support options as fourth argument', function () {
			var seq = new Sequelize('database', 'user', 'password', {
				dialect: 'test',
			});
			seq.options.dialect.should.equal('test');
		});
	});
	
	describe('#$queueResult', function () {
		var seq;
		beforeEach(function () {
			seq = new Sequelize();
		});
		
		it('should queue a result against the QueryInterface', function () {
			var queue = [];
			seq.queryInterface = {
				$queueResult: function (res) {
					queue.push(res);
				}
			};
			seq.$queueResult('foo');
			queue.length.should.equal(1);
			queue[0].should.equal('foo');
		});
	});
	
	describe('#$queueFailure', function () {
		var seq;
		beforeEach(function () {
			seq = new Sequelize();
		});
		
		it('should queue a result against the QueryInterface', function () {
			var queue = [];
			seq.queryInterface = {
				$queueFailure: function (res) {
					queue.push(res);
				}
			};
			seq.$queueFailure('foo');
			queue.length.should.equal(1);
			queue[0].should.equal('foo');
		});
		
		it('should pass along options to the QueryInterface', function () {
			var options;
			seq.queryInterface = {
				$queueFailure: function (res, opts) {
					options = opts;
				}
			};
			seq.$queueFailure('foo', 'bar');
			options.should.equal('bar');
		});
	});
	
	describe('#$clearQueue', function () {
		var seq;
		beforeEach(function () {
			seq = new Sequelize();
		});
		
		it('should clear queue of results in the QueryInterface', function () {
			var run = 0;
			seq.queryInterface = {
				$clearQueue: function (res) {
					run++;
				}
			};
			seq.$clearQueue();
			run.should.equal(1);
		});
	});
	
	describe('#$overrideImport', function () {
		var seq;
		beforeEach(function () {
			seq = new Sequelize();
		});
		
		it('should override an import path in the importCache', function () {
			seq.importCache = {};
			seq.$overrideImport('foo', 'bar');
			seq.importCache.should.have.property('foo').which.is.exactly('bar');
		});
	});
	
	describe('#getDialect', function () {
		it('should return the dialect set during initialization', function () {
			var seq = new Sequelize({
				dialect: 'test'
			});
			seq.getDialect().should.equal('test');
		});
	});
	
	describe('#getQueryInterface', function () {
		it('should return the QueryInterface object', function () {
			var seq = new Sequelize();
			seq.getQueryInterface().should.be.instanceof(QueryInterfaceMock);
		});
	});
	
	describe('#define', function () {
		it('should return a Mock Model', function () {
			var seq = new Sequelize();
			seq.define().should.be.instanceOf(ModelMock);
		});
	});

	describe('#isDefined', function() {
		it('should return true if the model is defined', function() {
			var seq = new Sequelize();
			seq.define('test', {});

			seq.isDefined('test').should.be.true();
		});

		it('should return false if the model is not defined', function() {
			var seq = new Sequelize();

			seq.isDefined('test').should.be.false()
		});
	});
	
	describe('#import', function () {
		var seq, resolve, stack;
		beforeEach(function () {
			seq = new Sequelize();
			lastImportTestCall = null;
			resolve = PathMock.resolve;
			stack = UtilsMock.stack;
		});
		
		afterEach(function () {
			PathMock.resolve = resolve;
			UtilsMock.stack = stack;
		});
		
		it('should return an already imported model', function () {
			var findItem = {};
			seq.importCache = {
				'foo': findItem,
			};
			seq.import('foo').should.be.exactly(findItem);
		});
		
		it('should import a model from the given path', function () {
			seq.import('import-test');
			should(lastImportTestCall).not.be.Null();
			lastImportTestCall[0].should.be.exactly(seq);
		});
		
		it('should turn a relative path into an absolute path', function () {
			var pathRun = 0;
			var stackRun = 0;
			PathMock.resolve = function () { pathRun++; return './bar'; };
			UtilsMock.stack = function () { stackRun++; return [0, { getFileName: function () { return 'baz'; } } ] };
			var findItem = {};
			
			seq.importCache = {
				'./bar': findItem,
			};
			seq.import('./foo').should.be.exactly(findItem);
			pathRun.should.be.exactly(2);
			stackRun.should.be.exactly(1);
		});
		
		it('should import a replaced model from an overridden import', function () {
			var findItem = {};
			seq.importCache = {
				'foo': 'bar',
				'bar': findItem,
			};
			seq.import('foo').should.be.exactly(findItem);
		});
	});
	
	describe('#model', function() {
		it('should return a previously defined Mock Model referenced its name', function() {
			var seq = new Sequelize();
			var mock = seq.define('test', {});
			seq.model('test').should.be.equal(mock);
		});

		it('should throw an error if there is no model with the specified name', function() {
			var seq = new Sequelize();
			var modelName = 'test';
			var callModel = function() {
				seq.model(modelName);
			};

			callModel.should.throw(Error);
			callModel.should.throw(modelName + ' has not been defined');
		});
	});
	
	describe('#query', function () {
		it('should pass query along to QueryInterface', function () {
			var seq = new Sequelize(),
				run = 0;
			seq.queryInterface = {
				$query: function () {
					run++;
					return 'foo';
				},
			};
			
			seq.query().should.equal('foo');
			run.should.equal(1);
		});
	});
	
	describe('#transaction', function () {
		it('should run a passed in function', function (done) {
			var seq = new Sequelize(),
				count = 0;
			seq.transaction(function () {
				count++;
				return Promise.resolve();
			}).then(function () {
				count.should.equal(1);
				done()
			}).catch(done);
		});
		
		it('should return a promise object when no function is passed in', function (done) {
			var seq = new Sequelize();
			seq.transaction().then(function (transaction) {
				should.exist(transaction);
				done()
			}).catch(done);
		});
	});
	
	describe('#literal', function () {
		it('should simply return the argument for the literal function', function () {
			var seq = new Sequelize();
			seq.literal('Test').should.equal('Test');
			var obj = {};
			seq.literal(obj).should.equal(obj);
		});
	});
	
	describe('#authenticate', function () {
		it('should simply return a resolving promise', (done) => {
			var seq = new Sequelize();
			seq.authenticate().then(done).catch(done);
		})
  });
});
