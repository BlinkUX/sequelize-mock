'use strict';

var should = require('should');
var bluebird = require('bluebird');
var proxyquire = require('proxyquire').noCallThru();
var util = require('util');

var ErrorsMock = {
	BaseError: function () {},
	InvalidQueryResultError: function () {},
	EmptyQueryQueueError: function () {},
};
util.inherits(ErrorsMock.BaseError, Error);
util.inherits(ErrorsMock.InvalidQueryResultError, Error);
util.inherits(ErrorsMock.EmptyQueryQueueError, Error);

var QueryInterface = proxyquire('../src/queryinterface', {
	'./errors': ErrorsMock,
});

describe('QueryInterface', function () {
	
	describe('__constructor', function () {
		it('should save the options object', function () {
			var qi = new QueryInterface({
				foo: 'bar',
			});
			qi.options.should.be.an.Object();
			qi.options.should.have.property('stopPropagation');
			qi.options.should.have.property('createdDefault');
			qi.options.should.have.property('fallbackFn');
			qi.options.should.have.property('foo').which.is.exactly('bar');
			
			var qi = new QueryInterface();
			qi.options.should.be.an.Object();
		});
		
		it('should create a new results queue object', function () {
			var qi = new QueryInterface();
			qi._results.should.be.an.Array();
		});
	});
	
	describe('#$queueResult', function () {
		var qi;
		beforeEach(function () {
			qi = new QueryInterface({});
		});
		
		it('should queue the result as the next item in the result list', function () {
			qi._results.length.should.equal(0);
			
			qi.$queueResult('foo');
			qi._results.length.should.equal(1);
			qi._results[0].content.should.equal('foo');
			
			qi.$queueResult('bar');
			qi._results.length.should.equal(2);
			qi._results[0].content.should.equal('foo');
			qi._results[1].content.should.equal('bar');
		});
		
		it('should default to an empty options object', function () {
			qi.$queueResult('foo');
			qi._results[0].options.should.be.an.Object();
		});
		
		it('should save the options from the result', function () {
			qi.$queueResult('foo', 'bar');
			qi._results[0].options.should.equal('bar');
		});
		
		it('should mark the result as a "Success" result', function () {
			qi.$queueResult('foo');
			qi._results[0].type.should.equal('Success');
		});
	});
	
	describe('#$queueError', function () {
		var qi;
		beforeEach(function () {
			qi = new QueryInterface({});
		});
		
		it('should queue the result as the next item in the result list', function () {
			qi._results.length.should.equal(0);
			
			var errFoo = new Error('foo'),
				errBar = new Error('bar');
			
			qi.$queueError(errFoo);
			qi._results.length.should.equal(1);
			qi._results[0].content.should.equal(errFoo);
			
			qi.$queueError(errBar);
			qi._results.length.should.equal(2);
			qi._results[0].content.should.equal(errFoo);
			qi._results[1].content.should.equal(errBar);
		});
		
		it('should convert non Error object to Error by default', function () {
			qi.$queueError('foo');
			qi._results[0].content.should.be.instanceof(ErrorsMock.BaseError);
		});
		
		it('should not convert non Error object if `convertNonErrors` is false', function () {
			qi.$queueError('foo', { convertNonErrors: false });
			qi._results[0].content.should.not.instanceof(ErrorsMock.BaseError);
			qi._results[0].content.should.equal('foo');
		});
		
		it('should default to an empty options object', function () {
			qi.$queueError('foo');
			qi._results[0].options.should.be.an.Object();
		});
		
		it('should save the options from the result', function () {
			qi.$queueError('foo', 'bar');
			qi._results[0].options.should.equal('bar');
		});
		
		it('should mark the result as a "Failure" result', function () {
			qi.$queueError('foo');
			qi._results[0].type.should.equal('Failure');
		});
	});
	
	describe('#$queueHandler', function () {
		var qi;
		beforeEach(function () {
			qi = new QueryInterface({});
		});
		
		it('should queue the handler as the next item in the handlers list', function () {
			qi._handlers.length.should.equal(0);
			var handler1 = function(){};
			var handler2 = function(){};

			qi.$queueHandler(handler1);
			qi._handlers.length.should.equal(1);
			qi._handlers[0].should.equal(handler1);
			
			qi.$queueHandler(handler2);
			qi._handlers.length.should.equal(2);
			qi._handlers[0].should.equal(handler1);
			qi._handlers[1].should.equal(handler2);
		});
	});
	
	describe('#$clearQueue', function () {
		var qi;
		beforeEach(function () {
			qi = new QueryInterface({});
		});
		
		it('should clear the results queue from the current QueryInterface', function () {
			qi._results = [1, 2, 3];
			qi.$clearQueue();
			qi._results.length.should.equal(0);
		});
		
		it('should not clear the results queue from a parent QueryInterface by default', function () {
			qi._results = [1, 2, 3];
			
			var run = 0;
			qi.options.parent = {
				$clearQueue: function () { run++; },
			};
			
			qi.$clearQueue();
			qi._results.length.should.equal(0);
			run.should.equal(0);
		});
		
		it('should clear the results queue from a parent QueryInterface if option is passed in to', function () {
			qi._results = [1, 2, 3];
			
			var run = 0;
			qi.options.parent = {
				$clearQueue: function () { run++; },
			};
			
			qi.$clearQueue({ propagateClear: true });
			qi._results.length.should.equal(0);
			run.should.equal(1);
		});
		
	});
	
	describe('#$clearHandlers', function () {
		var qi;
		beforeEach(function () {
			qi = new QueryInterface({});
		});
		
		it('should clear the handlers from the current QueryInterface', function () {
			qi._handlers = [function(){}, function(){}];
			
			qi.$clearHandlers();
			
			qi._handlers.length.should.equal(0);
		});
		
		it('should not clear the handlers from a parent QueryInterface by default', function () {
			qi._handlers = [function(){}, function(){}];
			
			var run = 0;
			qi.options.parent = {
				$clearHandlers: function () { run++; },
			};
			
			qi.$clearHandlers();
			qi._handlers.length.should.equal(0);
			run.should.equal(0);
		});
		
		it('should clear the handlers from a parent QueryInterface if option is passed in to', function () {
			qi._handlers = [function(){}, function(){}];
			
			var run = 0;
			qi.options.parent = {
				$clearHandlers: function () { run++; },
			};
			
			qi.$clearHandlers({ propagateClear: true });
			qi._results.length.should.equal(0);
			run.should.equal(1);
		});
		
	});
		
	describe('#$clearResults', function () {
		var qi;
		beforeEach(function () {
			qi = new QueryInterface({});
		});
		
		it('should clear the handlers and results queue from the current QueryInterface', function () {
			qi._results = [1, 2, 3];
			qi._handlers = [function(){}, function(){}];
			
			qi.$clearResults();
			
			qi._results.length.should.equal(0);
			qi._handlers.length.should.equal(0);
		});
		
		it('should not clear the handlers and results queue from a parent QueryInterface by default', function () {
			qi._results = [1, 2, 3];
			qi._handlers = [function(){}, function(){}];
			
			var run = 0;
			qi.options.parent = {
				$clearResults: function () { run++; },
			};
			
			qi.$clearResults();
			qi._results.length.should.equal(0);
			qi._handlers.length.should.equal(0);
			run.should.equal(0);
		});
		
		it('should clear the handlers and results queue from a parent QueryInterface if option is passed in to', function () {
			qi._results = [1, 2, 3];
			qi._handlers = [function(){}, function(){}];

			var run = 0;
			qi.options.parent = {
				$clearHandlers: function () { run++; },
				$clearQueue: function () { run++; },
			};
			
			qi.$clearResults({ propagateClear: true });
			qi._results.length.should.equal(0);
			qi._handlers.length.should.equal(0);
			run.should.equal(2);
		});
		
	});
	
	describe('#$query', function () {
		var qi;
		beforeEach(function () {
			qi = new QueryInterface({});
		});
		
		it('should return a resolved promise with a Success result', function (done) {
			qi._results = [{
				content: 'foo',
				options: {},
				type: 'Success'
			}, {
				content: 'bar',
				options: {},
				type: 'Success'
			}];
			
			var result = qi.$query();
			result.then(function (content) {
				content.should.equal('foo');
				qi._results.length.should.equal(1);
				done();
			}).catch(done);
		});
		
		it('should return a rejected promise with a Failure result', function (done) {
			qi._results = [{
				content: 'foo',
				options: {},
				type: 'Failure'
			}, {
				content: 'bar',
				options: {},
				type: 'Failure'
			}];
			
			var result = qi.$query();
			result.then(function () {
				done(new Error('Query returned a resolved promise instead of a rejected one'));
			}, function (content) {
				content.should.equal('foo');
				qi._results.length.should.equal(1);
				done();
			}).catch(done);
		});
		
		it('should throw an error if an invalid result is added to the queue', function () {
			qi._results = [{
				content: 'foo',
				options: {},
				type: 'Test'
			}];
			
			should.throws(qi.$query.bind(qi), ErrorsMock.InvalidQueryResultError);
		});
		
		describe('[options.includeCreated]', function () {
			var qi;
			beforeEach(function () {
				qi = new QueryInterface();
			});
			
			it('should default the created parameter to true when there is no default specified', function (done) {
				qi._results = [{
					content: 'foo',
					options: {},
					type: 'Success'
				}];
				
				var result = qi.$query({ includeCreated: true });
				result.spread(function (content, created) {
					content.should.equal('foo');
					created.should.be.true();
					done();
				}).catch(done);
			});
			
			it('should default to the createdDefault from the QueryInterface if specified', function (done) {
				qi.options.createdDefault = false;
				qi._results = [{
					content: 'foo',
					options: {},
					type: 'Success'
				}];
				
				var result = qi.$query({ includeCreated: true });
				result.spread(function (content, created) {
					content.should.equal('foo');
					created.should.be.false();
					done();
				}).catch(done);
			});
			
			it('should use the wasCreated from the query if specified', function (done) {
				qi.options.createdDefault = false;
				qi._results = [{
					content: 'foo',
					options: { wasCreated: true },
					type: 'Success'
				}, {
					content: 'bar',
					options: { wasCreated: false },
					type: 'Success'
				}];
				
				var result = qi.$query({ includeCreated: true });
				result.spread(function (content, created) {
					content.should.equal('foo');
					created.should.be.true();
					return qi.$query({ includeCreated: true });
				}).spread(function (content, created) {
					content.should.equal('bar');
					created.should.be.false();
					done();
				}).catch(done);
			});
			
		});
		
		describe('[options.includeAffectedRows]', function () {
			var qi;
			beforeEach(function () {
				qi = new QueryInterface();
			});
			
			it('should default the affectedRows parameter to an empty array', function (done) {
				var rows = [1, 2, 3];
				qi._results = [{
					content: 'foo',
					options: { },
					type: 'Success'
				}];
				
				var result = qi.$query({ includeAffectedRows: true });
				result.spread(function (content, affectedRows) {
					content.should.equal('foo');
					affectedRows.should.be.an.Array();
					affectedRows.length.should.equal(0);
					done();
				}).catch(done);
			});
			
			it('should pass along affectedRows option specified in result', function (done) {
				var rows = [1, 2, 3];
				qi._results = [{
					content: 'foo',
					options: { affectedRows: rows },
					type: 'Success'
				}];
				
				var result = qi.$query({ includeAffectedRows: true });
				result.spread(function (content, affectedRows) {
					content.should.equal('foo');
					affectedRows.should.equal(rows);
					done();
				}).catch(done);
			});
			
		});
		
		describe('[options.stopPropagation]', function () {
			var qi;
			beforeEach(function () {
				qi = new QueryInterface();
			});
			
			it('should default to calling into parent queue if a parent exists', function (done) {
				var run = 0;
				qi._results = [];
				qi.options.parent = {
					$query: function () { run++; return 'foo'; }
				};
				
				qi.$query().then(function (content) {
					content.should.equal('foo');
					run.should.equal(1);
					done();
				}).catch(done);
			});
			
			it('should not call into parent if QueryInterface option is to stopPropagation', function () {
				var run = 0;
				qi._results = [];
				qi.options.parent = {
					$query: function () { run++; return 'foo'; }
				};
				qi.options.stopPropagation = true;
				
				should.throws(qi.$query.bind(qi), ErrorsMock.EmptyQueryQueueError);
				run.should.equal(0);
			});
			
			it('should not call into parent if query option is to stopPropagation', function () {
				var run = 0;
				qi._results = [];
				qi.options.parent = {
					$query: function () { run++; return 'foo'; }
				};
				qi.options.stopPropagation = false;
				
				should.throws(qi.$query.bind(qi, { stopPropagation: true }), ErrorsMock.EmptyQueryQueueError);
				run.should.equal(0);
			});
			
			it('should not try to call into parent if there is no parent', function () {
				qi._results = [];
				should.throws(qi.$query.bind(qi, { stopPropagation: true }), ErrorsMock.EmptyQueryQueueError);
			});
			
		});
		
		describe('[options.fallbackFn]', function () {
			var qi;
			beforeEach(function () {
				qi = new QueryInterface();
			});
			
			it('should call fallback function if it exists on the QueryInterface', function (done) {
				var run = 0;
				qi._results = [];
				qi.options.fallbackFn = function () { run++; return 'foo'; };
				
				qi.$query().then(function (content) {
					content.should.equal('foo');
					run.should.equal(1);
					done();
				}).catch(done);
			});
			
			it('should call fallback function on query options if it exists', function (done) {
				var run = 0;
				qi._results = [];
				qi.options.fallbackFn = function () { run++; return 'foo'; };
				
				qi.$query({ fallbackFn: function () { run++; return 'bar'; } }).then(function (content) {
					content.should.equal('bar');
					run.should.equal(1);
					done();
				}).catch(done);
			});
			
		});
		
		it('should throw a EmptyQueryQueueError if there are no results to show', function () {
			qi._results = [];
			should.throws(qi.$query.bind(qi), ErrorsMock.EmptyQueryQueueError);
		});
		
	});
	
});
