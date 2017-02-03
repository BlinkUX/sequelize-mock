'use strict';

var should = require('should');
var bluebird = require('bluebird');
var proxyquire = require('proxyquire').noCallThru();

var ModelMock = function () {};
var UtilsMock = {};
var PackageMock = {
	version: 'test',
};
var ErrorMock = {
	'BaseError': function () { return 'base error'; },
	'OtherError': function () { return 'base error'; },
};

var Sequelize = proxyquire('../src/sequelize', {
	'./model'  : ModelMock,
	'./utils'  : UtilsMock,
	'./errors' : ErrorMock,
	'../package.json' : PackageMock
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
	
	it('should have data types exposed on class', function () {
		Sequelize.should.have.property('STRING').which.is.a.Function();
		Sequelize.should.have.property('CHAR').which.is.a.Function();
		Sequelize.should.have.property('TEXT').which.is.a.Function();
		Sequelize.should.have.property('INTEGER').which.is.a.Function();
		Sequelize.should.have.property('BIGINT').which.is.a.Function();
		Sequelize.should.have.property('FLOAT').which.is.a.Function();
		Sequelize.should.have.property('REAL').which.is.a.Function();
		Sequelize.should.have.property('DOUBLE').which.is.a.Function();
		Sequelize.should.have.property('DECIMAL').which.is.a.Function();
		Sequelize.should.have.property('BOOLEAN').which.is.a.Function();
		Sequelize.should.have.property('TIME').which.is.a.Function();
		Sequelize.should.have.property('DATE').which.is.a.Function();
		Sequelize.should.have.property('DATEONLY').which.is.a.Function();
		Sequelize.should.have.property('HSTORE').which.is.a.Function();
		Sequelize.should.have.property('JSON').which.is.a.Function();
		Sequelize.should.have.property('JSONB').which.is.a.Function();
		Sequelize.should.have.property('NOW').which.is.a.Function();
		Sequelize.should.have.property('BLOB').which.is.a.Function();
		Sequelize.should.have.property('RANGE').which.is.a.Function();
		Sequelize.should.have.property('UUID').which.is.a.Function();
		Sequelize.should.have.property('UUIDV1').which.is.a.Function();
		Sequelize.should.have.property('UUIDV4').which.is.a.Function();
		Sequelize.should.have.property('VIRTUAL').which.is.a.Function();
		Sequelize.should.have.property('ENUM').which.is.a.Function();
		Sequelize.should.have.property('ARRAY').which.is.a.Function();
		Sequelize.should.have.property('GEOMETRY').which.is.a.Function();
		Sequelize.should.have.property('GEOGRAPHY').which.is.a.Function();
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
	
	describe('#getDialect', function () {
		it('should return the dialect set during initialization', function () {
			var seq = new Sequelize({
				dialect: 'test'
			});
			seq.getDialect().should.equal('test');
		});
	});
	
	describe('#define', function () {
		it('should return a Mock Model', function () {
			var seq = new Sequelize();
			seq.define().should.be.instanceOf(ModelMock);
		});
	});
	
	describe('#query', function () {
		it('should throw an error when calling query', function (done) {
			var seq = new Sequelize();
			seq.query().then(function () {
				done(new Error('Error not thrown '));
			}, function (err) {
				err.message.indexOf('requires test specific configuration').should.be.above(-1);
				done();
			}).catch(done);
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
	
});
