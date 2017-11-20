'use strict';

var should = require('should');
var proxyquire = require('proxyquire').noCallThru();

var inflectionMock = {
	singularize: function (str) { return str; },
	pluralize: function (str) { return str; },
};

var Utils = proxyquire('../src/utils', {
	'inflection' : inflectionMock,
});

describe('Utils', function () {
	
	describe('#uppercaseFirst', function () {
		it('should return the string with an uppercase first character', function () {
			Utils.uppercaseFirst('abc').should.equal('Abc');
		});
		it('should not modify an already uppercase character', function () {
			Utils.uppercaseFirst('ABC').should.equal('ABC');
		});
		it('should not modify number', function () {
			Utils.uppercaseFirst('123').should.equal('123');
		});
	});
	
	describe('#lowercaseFirst', function () {
		it('should return the string with an lowercase first character', function () {
			Utils.lowercaseFirst('ABC').should.equal('aBC');
		});
		it('should not modify an already lowercase character', function () {
			Utils.lowercaseFirst('abc').should.equal('abc');
		});
		it('should not modify number', function () {
			Utils.lowercaseFirst('123').should.equal('123');
		});
	});
	
	describe('#singularize', function () {
		var singularize;
		beforeEach(function () {
			singularize = inflectionMock.singularize;
		});
		
		afterEach(function () {
			inflectionMock.singularize = singularize;
		});
		
		it('should call into inflection (like Sequelize does)', function () {
			var count = 0;
			inflectionMock.singularize = function (str) {
				count++;
				return str;
			};
			Utils.singularize('strings');
			count.should.equal(1);
		});
	});
	
	describe('#pluralize', function () {
		var pluralize;
		beforeEach(function () {
			pluralize = inflectionMock.pluralize;
		});
		
		afterEach(function () {
			inflectionMock.pluralize = pluralize;
		});
		
		it('should call into inflection (like Sequelize does)', function () {
			var count = 0;
			inflectionMock.pluralize = function (str) {
				count++;
				return str;
			};
			Utils.pluralize('string');
			count.should.equal(1);
		});
	});
	
	describe('#stack', function () {
		var captureStack;
		beforeEach(function () {
			captureStack = Error.captureStackTrace;
		});
		
		afterEach(function () {
			Error.captureStackTrace = captureStack;
		});
		
		// TODO: This test is more integration than unit. Need to move this
		//       code over to a different test suite once one exists.
		it('should capture and return the stack trace', function () {
			/*
			var arg1, arg2;
			Error.captureStackTrace = function (obj, fn) {
				arg1 = obj;
				arg2 = fn;
				obj.stack = 'bar';
			};
			*/
			
			var ret = Utils.stack();
			
			/*
			// We need to restore nomality here so that the asserts and things can work properly
			Error.captureStackTrace = captureStack;
			
			should(arg1).be.Object();
			should(arg2).be.Function();
			
			ret.should.equal('bar');
			*/
			
			ret.should.be.an.Array();
			should(ret[0].getFileName).be.a.Function();
		});
		
	});
	
});
