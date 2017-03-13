'use strict';

var should = require('should');
var proxyquire = require('proxyquire').noCallThru();

var Errors = proxyquire('../src/errors', {
	// No require's we need to override
});

describe('Errors', function () {
	
	describe('BaseError', function () {
		
		it('should set the message', function () {
			var err = new Errors.BaseError('Test message');
			err.message.should.equal('Test message');
		});
		
		it('should have the same name as the Sequelize Error object', function () {
			var err = new Errors.BaseError('');
			err.name.should.equal('SequelizeBaseError');
		});
		
		it('should inherit from the Error object', function () {
			var err = new Errors.BaseError('');
			err.should.be.instanceOf(Error);
		});
		
	});
	
	describe('ValidationError', function () {
		
		it('should set the message', function () {
			var err = new Errors.ValidationError('Test message');
			err.message.should.equal('Test message');
		});
		
		it('should store errors list', function () {
			var errorList = [1, 2, 3];
			var err = new Errors.ValidationError('', errorList);
			err.errors.should.equal(errorList);
		});
		
		it('should default to empty errors list', function () {
			var err = new Errors.ValidationError('');
			err.errors.should.be.Array();
		});
		
		it('should have the same name as the Sequelize Error object', function () {
			var err = new Errors.ValidationError('');
			err.name.should.equal('SequelizeValidationError');
		});
		
		it('should inherit from the BaseError object', function () {
			var err = new Errors.ValidationError('');
			err.should.be.instanceOf(Errors.BaseError);
		});
		
		describe('#get', function () {
			
			it('should find errors matching a given path', function () {
				var errorList = [{ path: 'abc' }, { path: 'def' }];
				var err = new Errors.ValidationError('', errorList);
				err.get('abc').length.should.equal(1);
				err.get('def').length.should.equal(1);
				err.get('ghi').length.should.equal(0);
			});
			
		});
		
	});
	
	describe('ValidationErrorItem', function () {
		
		it('should set each of the arguments on the object', function () {
			var err = new Errors.ValidationErrorItem('test message', 'test type', 'test path', 123);
			err.message.should.equal('test message');
			err.type.should.equal('test type');
			err.path.should.equal('test path');
			err.value.should.equal(123);
		});
		
	});
	
	describe('DatabaseError', function () {
		
		it('should set the parent error', function () {
			var parent = {};
			var err = new Errors.DatabaseError(parent);
			err.parent.should.equal(parent);
			err.original.should.equal(parent);
		});
		
		it('should set a default sql value', function () {
			var err = new Errors.DatabaseError();
			err.should.have.property('sql').which.is.a.String();
		});
		
		it('should inherit from the BaseError object', function () {
			var err = new Errors.DatabaseError('');
			err.should.be.instanceOf(Errors.BaseError);
		});
		
	});
	
	describe('TimeoutError', function () {
		
		it('should set the message', function () {
			var err = new Errors.TimeoutError();
			err.message.should.equal('Query Timed Out');
		});
		
		it('should set self as parent', function () {
			var err = new Errors.TimeoutError();
			err.parent.should.equal(err);
		});
		
		it('should have the same name as the Sequelize Error object', function () {
			var err = new Errors.TimeoutError();
			err.name.should.equal('SequelizeTimeoutError');
		});
		
		it('should inherit from the DatabaseError object', function () {
			var err = new Errors.TimeoutError();
			err.should.be.instanceOf(Errors.DatabaseError);
		});
		
	});
	
	describe('UniqueConstraintError', function () {
		
		it('should set the message', function () {
			var err = new Errors.UniqueConstraintError({
				message: 'Test Message',
			});
			err.message.should.equal('Test Message');
		});
		
		it('should set the errors list', function () {
			var errorList = [1,2,3];
			var err = new Errors.UniqueConstraintError({
				errors: errorList,
			});
			err.errors.should.equal(errorList);
		});
		
		it('should set the fields object', function () {
			var fieldsList = [1,2,3];
			var err = new Errors.UniqueConstraintError({
				fields: fieldsList
			});
			err.fields.should.equal(fieldsList);
		});
		
		it('should default to empty fields object', function () {
			var err = new Errors.UniqueConstraintError();
			err.fields.should.be.Array();
		});
		
		it('should set self as parent', function () {
			var err = new Errors.UniqueConstraintError();
			err.parent.should.equal(err);
		});
		
		it('should have the same name as the Sequelize Error object', function () {
			var err = new Errors.UniqueConstraintError();
			err.name.should.equal('SequelizeUniqueConstraintError');
		});
		
		it('should inherit from the ValidationError object', function () {
			var err = new Errors.UniqueConstraintError();
			err.should.be.instanceOf(Errors.ValidationError);
		});
		
	});
	
	describe('ForeignKeyConstraintError', function () {
		
		it('should set the message', function () {
			var err = new Errors.ForeignKeyConstraintError({
				message: 'Test Message',
			});
			err.message.should.equal('Test Message');
		});
		
		it('should set the fields object', function () {
			var fieldsList = [1,2,3];
			var err = new Errors.ForeignKeyConstraintError({
				fields: fieldsList
			});
			err.fields.should.equal(fieldsList);
		});
		
		it('should default to empty fields object', function () {
			var err = new Errors.ForeignKeyConstraintError();
			err.fields.should.be.Array();
		});
		
		it('should set the table value', function () {
			var err = new Errors.ForeignKeyConstraintError({
				table: 'test table'
			});
			err.table.should.equal('test table');
		});
		
		it('should set the value value', function () {
			var err = new Errors.ForeignKeyConstraintError({
				value: 'test value'
			});
			err.value.should.equal('test value');
		});
		
		it('should set the index value', function () {
			var err = new Errors.ForeignKeyConstraintError({
				index: 'test index'
			});
			err.index.should.equal('test index');
		});
		
		it('should set self as parent', function () {
			var err = new Errors.ForeignKeyConstraintError();
			err.parent.should.equal(err);
		});
		
		it('should have the same name as the Sequelize Error object', function () {
			var err = new Errors.ForeignKeyConstraintError();
			err.name.should.equal('SequelizeForeignKeyConstraintError');
		});
		
		it('should inherit from the DatabaseError object', function () {
			var err = new Errors.ForeignKeyConstraintError();
			err.should.be.instanceOf(Errors.DatabaseError);
		});
		
	});
	
	describe('ExclusionConstraintError', function () {
		
		it('should set the message', function () {
			var err = new Errors.ExclusionConstraintError({
				message: 'Test Message',
			});
			err.message.should.equal('Test Message');
		});
		
		it('should set the fields object', function () {
			var fieldsList = [1,2,3];
			var err = new Errors.ExclusionConstraintError({
				fields: fieldsList
			});
			err.fields.should.equal(fieldsList);
		});
		
		it('should default to empty fields object', function () {
			var err = new Errors.ExclusionConstraintError();
			err.fields.should.be.Array();
		});
		
		it('should set the table value', function () {
			var err = new Errors.ExclusionConstraintError({
				table: 'test table'
			});
			err.table.should.equal('test table');
		});
		
		it('should set the constraint value', function () {
			var err = new Errors.ExclusionConstraintError({
				constraint: 'test constraint'
			});
			err.constraint.should.equal('test constraint');
		});
		
		it('should set self as parent', function () {
			var err = new Errors.ExclusionConstraintError();
			err.parent.should.equal(err);
		});
		
		it('should have the same name as the Sequelize Error object', function () {
			var err = new Errors.ExclusionConstraintError();
			err.name.should.equal('SequelizeExclusionConstraintError');
		});
		
		it('should inherit from the DatabaseError object', function () {
			var err = new Errors.ExclusionConstraintError();
			err.should.be.instanceOf(Errors.DatabaseError);
		});
		
	});
	
	describe('ConnectionError', function () {
		
		it('should set the message', function () {
			var parentError = {
				message: 'Test Message',
			};
			var err = new Errors.ConnectionError(parentError);
			err.message.should.equal('Test Message');
		});
		
		it('should set parent', function () {
			var parentError = {};
			var err = new Errors.ConnectionError(parentError);
			err.parent.should.equal(parentError);
			err.original.should.equal(parentError);
		});
		
		it('should have the same name as the Sequelize Error object', function () {
			var err = new Errors.ConnectionError();
			err.name.should.equal('SequelizeConnectionError');
		});
		
		it('should inherit from the BaseError object', function () {
			var err = new Errors.ConnectionError();
			err.should.be.instanceOf(Errors.BaseError);
		});
		
	});
	
	describe('ConnectionRefusedError', function () {
		
		it('should set parent', function () {
			var parentError = {};
			var err = new Errors.ConnectionRefusedError(parentError);
			err.parent.should.equal(parentError);
			err.original.should.equal(parentError);
		});
		
		it('should have the same name as the Sequelize Error object', function () {
			var err = new Errors.ConnectionRefusedError();
			err.name.should.equal('SequelizeConnectionRefusedError');
		});
		
		it('should inherit from the ConnectionError object', function () {
			var err = new Errors.ConnectionRefusedError();
			err.should.be.instanceOf(Errors.ConnectionError);
		});
		
	});
	
	describe('AccessDeniedError', function () {
		
		it('should set parent', function () {
			var parentError = {};
			var err = new Errors.AccessDeniedError(parentError);
			err.parent.should.equal(parentError);
			err.original.should.equal(parentError);
		});
		
		it('should have the same name as the Sequelize Error object', function () {
			var err = new Errors.AccessDeniedError();
			err.name.should.equal('SequelizeAccessDeniedError');
		});
		
		it('should inherit from the ConnectionError object', function () {
			var err = new Errors.AccessDeniedError();
			err.should.be.instanceOf(Errors.ConnectionError);
		});
		
	});
	
	describe('HostNotFoundError', function () {
		
		it('should set parent', function () {
			var parentError = {};
			var err = new Errors.HostNotFoundError(parentError);
			err.parent.should.equal(parentError);
			err.original.should.equal(parentError);
		});
		
		it('should have the same name as the Sequelize Error object', function () {
			var err = new Errors.HostNotFoundError();
			err.name.should.equal('SequelizeHostNotFoundError');
		});
		
		it('should inherit from the ConnectionError object', function () {
			var err = new Errors.HostNotFoundError();
			err.should.be.instanceOf(Errors.ConnectionError);
		});
		
	});
	
	describe('HostNotReachableError', function () {
		
		it('should set parent', function () {
			var parentError = {};
			var err = new Errors.HostNotReachableError(parentError);
			err.parent.should.equal(parentError);
			err.original.should.equal(parentError);
		});
		
		it('should have the same name as the Sequelize Error object', function () {
			var err = new Errors.HostNotReachableError();
			err.name.should.equal('SequelizeHostNotReachableError');
		});
		
		it('should inherit from the ConnectionError object', function () {
			var err = new Errors.HostNotReachableError();
			err.should.be.instanceOf(Errors.ConnectionError);
		});
		
	});
	
	describe('InvalidConnectionError', function () {
		
		it('should set parent', function () {
			var parentError = {};
			var err = new Errors.InvalidConnectionError(parentError);
			err.parent.should.equal(parentError);
			err.original.should.equal(parentError);
		});
		
		it('should have the same name as the Sequelize Error object', function () {
			var err = new Errors.InvalidConnectionError();
			err.name.should.equal('SequelizeInvalidConnectionError');
		});
		
		it('should inherit from the ConnectionError object', function () {
			var err = new Errors.InvalidConnectionError();
			err.should.be.instanceOf(Errors.ConnectionError);
		});
		
	});
	
	describe('ConnectionTimedOutError', function () {
		
		it('should set parent', function () {
			var parentError = {};
			var err = new Errors.ConnectionTimedOutError(parentError);
			err.parent.should.equal(parentError);
			err.original.should.equal(parentError);
		});
		
		it('should have the same name as the Sequelize Error object', function () {
			var err = new Errors.ConnectionTimedOutError();
			err.name.should.equal('SequelizeConnectionTimedOutError');
		});
		
		it('should inherit from the ConnectionError object', function () {
			var err = new Errors.ConnectionTimedOutError();
			err.should.be.instanceOf(Errors.ConnectionError);
		});
		
	});
	
	describe('InstanceError', function () {
		
		it('should set message', function () {
			var err = new Errors.InstanceError('Test Message');
			err.message.should.equal('Test Message');
		});
		
		it('should have the same name as the Sequelize Error object', function () {
			var err = new Errors.InstanceError();
			err.name.should.equal('SequelizeInstanceError');
		});
		
		it('should inherit from the BaseError object', function () {
			var err = new Errors.InstanceError();
			err.should.be.instanceOf(Errors.BaseError);
		});
		
	});
	
	describe('InvalidQueryResultError', function () {
		
		it('should set message', function () {
			var err = new Errors.InvalidQueryResultError('Test Message');
			err.message.should.equal('Test Message');
		});
		
		it('should set a default message when none is provided', function () {
			var err = new Errors.InvalidQueryResultError();
			err.message.should.not.be.empty();
		});
		
		it('should have a Sequelize Mock specific name', function () {
			var err = new Errors.InvalidQueryResultError();
			err.name.should.equal('SequelizeMockInvalidQueryResultError');
		});
		
		it('should inherit from the BaseError object', function () {
			var err = new Errors.InvalidQueryResultError();
			err.should.be.instanceOf(Errors.BaseError);
		});
		
	});
	
	describe('EmptyQueryQueueError', function () {
		
		it('should set message', function () {
			var err = new Errors.EmptyQueryQueueError('Test Message');
			err.message.should.equal('Test Message');
		});
		
		it('should set a default message when none is provided', function () {
			var err = new Errors.EmptyQueryQueueError();
			err.message.should.not.be.empty();
		});
		
		it('should have a Sequelize Mock specific name', function () {
			var err = new Errors.EmptyQueryQueueError();
			err.name.should.equal('SequelizeMockEmptyQueryQueueError');
		});
		
		it('should inherit from the BaseError object', function () {
			var err = new Errors.EmptyQueryQueueError();
			err.should.be.instanceOf(Errors.BaseError);
		});
		
	});
	
});
