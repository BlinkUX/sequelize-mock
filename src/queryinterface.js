'use strict';

/**
 * To support running mock queries, we use this object to queue results for queries. This
 * is to provide full control over the objects that are returned and do so in a way that
 * allows you to target specific code paths.
 * 
 * Queries are queued in a "first in, last out" manner, so they should be inserted in the
 * order your code would expect them in. The queue itself does no checking or validation
 * for what types of objects are being passed around except in the case of failures
 * (see `$queueFailure`).
 * 
 * **Note:** This is not an equivalent mock of Sequelize's built in `QueryInterface` at
 * the moment. The built in object for Sequelize is undocumented and is marked as `@private`
 * in their code, meaning it is not likely something to be relied on. If this changes it
 * can be mocked here. Functions have been prefixed with the mock prefix (`$`) for this
 * reason.
 * 
 * @name QueryInterface
 * @fileOverview The mock QueryInterface base that is used for returning results from queries for tests
 **/

var bluebird = require('bluebird'),
	_ = require('lodash'),
	Errors = require('./errors');

/**
 * The `QueryInterface` class is used to provide common mock query functionality. New
 * instances of this class should mostly be created internally, however the functions on
 * the class are exposed on objects utilize this class.
 * 
 * @class QueryInterface
 * @constructor
 * @param {Object} [options] Options for the query interface to use
 * @param {QueryInterface} [options.parent] Parent `QueryInterface` object to propagate up to
 * @param {Boolean} [options.stopPropagation] Flag indicating if we should not propagate to the parent
 * @param {Boolean} [options.createdDefault] Default value to be used for if something has been created if one is not passed in by the query. Defaults to true
 * @param {Function} [options.fallbackFn] Default function to call as a fallback if nothing is left in the queue and a fallback function is not passed in with the query
 **/
function QueryInterface (options) {
	this.options = _.extend({
		stopPropagation: false,
		createdDefault: true,
		fallbackFn: undefined,
	}, options || {});
	this._results = [];
	this._handlers = [];
}

/**
 * Queue a new success result from the mock database
 * 
 * @instance
 * @param {Any} result The object or value to be returned as the result of a query
 * @param {Object} [options] Options used when returning the result
 * @param {Boolean} [options.wasCreated] Optional flag if a query requires a `created` value in the return indicating if the object was "created" in the DB
 * @param {Array<Any>} [options.affectedRows] Optional array of objects if the query requires an `affectedRows` return value
 * @return {QueryInterface} self
 **/
QueryInterface.prototype.$queueResult = function (result, options) {
	this._results.push({
		content: result,
		options: options || {},
		type: 'Success',
	});
	
	return this;
};

/**
 * Queue a new error or failure result from the mock database. This will cause a query
 * to be rejected with the given error/failure object. The error is converted into a
 * `BaseError` object unless specified by the `options.convertNonErrors` parameter.
 * 
 * @instance
 * @alias $queueError
 * @param {Any} error The object or value to be returned as the failure for a query
 * @param {Object} [options] Options used when returning the result
 * @param {Boolean} [options.convertNonErrors] Flag indicating if non `Error` objects should be allowed. Defaults to true
 * @return {QueryInterface} self
 **/
QueryInterface.prototype.$queueFailure = function (error, options) {
	// Rejections from Sequelize will almost always be errors, so we convert to an error by default
	if((!options || options.convertNonErrors !== false) && !(error instanceof Error)) {
		// Convert non-Error objects to BaseError objects if we haven't specified otherwise
		error = new Errors.BaseError(error);
	}
	
	this._results.push({
		content: error,
		options: options || {},
		type: 'Failure',
	});
	
	return this;
};
QueryInterface.prototype.$queueError = QueryInterface.prototype.$queueFailure;

/**
 * Adds a new query handler from the mock database
 * 
 * @instance
 * @param {Function} handler The function that will be invoked with the query.
 * @return {QueryInterface} self
 **/
QueryInterface.prototype.$useHandler = function (handler) {
	this._handlers.push(handler);
	return this;
};

/**
 * Clears any queued query results
 * 
 * @instance
 * @alias $queueClear
 * @param {Object} [options] Options used when returning the result
 * @param {Boolean} [options.propagateClear] Propagate this clear up to any parent `QueryInterface`s. Defaults to false
 * @return {QueryInterface} self
 **/
QueryInterface.prototype.$clearQueue = function (options) {
	options = options || {};
	this._results = [];

	// If we should also clear any results that would be added through propagation
	// then we also need to trigger $clearQueue on any parent QueryInterface
	if(options.propagateClear && this.options.parent) {
		this.options.parent.$clearQueue(options);
	}
	
	return this;
};
QueryInterface.prototype.$queueClear = QueryInterface.prototype.$clearQueue;

/**
 * Clears any handles
 * 
 * @instance
 * @alias $handlersClear
 * @param {Object} [options] Options used when returning the result
 * @param {Boolean} [options.propagateClear] Propagate this clear up to any parent `QueryInterface`s. Defaults to false
 * @return {QueryInterface} self
 **/
QueryInterface.prototype.$clearHandlers = function (options) {
	options = options || {};
	this._handlers = [];

	// If we should also clear any handlers that would be added through propagation
	// then we also need to trigger $clearQueue on any parent QueryInterface
	if(options.propagateClear && this.options.parent) {
		this.options.parent.$clearHandlers(options);
	}
	
	return this;
};
QueryInterface.prototype.$handlersClear = QueryInterface.prototype.$clearHandlers;

/**
 * Clears any reesults (both handlers and queued results)
 * 
 * @instance
 * @alias $handlersClear
 * @param {Object} [options] Options used when returning the result
 * @param {Boolean} [options.propagateClear] Propagate this clear up to any parent `QueryInterface`s. Defaults to false
 * @return {QueryInterface} self
 **/
QueryInterface.prototype.$clearResults = function (options) {
	this.$clearHandlers(options);
	this.$clearQueue(options);
	return this;
};
QueryInterface.prototype.$resultsClear = QueryInterface.prototype.$clearResults;

function resultsQueueHandler(qi, options) {
	return function(query, queryOptions) {
		var result = qi._results.shift();
		if (!result) return;

		if(typeof result !== 'object' || !(result.type === 'Failure' || result.type === 'Success')) {
			throw new Errors.InvalidQueryResultError();
		}
		
		if(result.type == 'Failure') {
			return bluebird.reject(result.content);
		}
		
		if(options.includeCreated) {
			var created = !!qi.options.createdDefault;
			if(typeof result.options.wasCreated !== 'undefined') {
				created = !!result.options.wasCreated;
			}
			
			return bluebird.resolve([result.content, created]);
		}
		if (options.includeAffectedRows) {
			var affectedRows = [];
			if(result.options.affectedRows instanceof Array) {
				affectedRows = result.options.affectedRows;
			}
			
			return bluebird.resolve([result.content, affectedRows]);
		}
		return bluebird.resolve(result.content);
	}
}

function propagationHandler(qi, options) {
	return function(query, queryOptions) {
		if (!options.stopPropagation && !qi.options.stopPropagation && qi.options.parent) {
			return qi.options.parent.$query(options);
		}
	}
}

function fallbackHandler(qi, options) {
	return function(query, queryOptions) {
		var fallbackFn = options.fallbackFn || qi.options.fallbackFn;
		if (fallbackFn) return fallbackFn();
	}
}

/**
 * This is the mock method for getting results from the `QueryInterface`. This function
 * will get the next result in the queue and return that wrapped in a promise.
 *
 * @instance
 * @param {Object} [options] Options used for this query
 * @param {Function} [options.fallbackFn] A fallback function to run if there are no results queued
 * @param {Boolean} [options.includeCreated] Flag indicating if a `created` value should be returned with the result for this query. Defaults to false
 * @param {Boolean} [options.includeAffectedRows] Flag indicating if the query expects `affectedRows` in the returned result parameters. Defautls to false
 * @param {Boolean} [options.stopPropagation] Flag indicating if result queue propagation should be stopped on this query. Defaults to false
 * @param {String} [options.query] Name of the original query: "findOne", "findOrCreate", "upsert", etc.
 * @param {Object} [options.queryOptions] Array with the arguments passed to the original query method
 * @return {Promise} resolved or rejected promise from the next item in the review queue
 **/
QueryInterface.prototype.$query = function (options) {
	options = options || {};

	var handlers = this._handlers.concat(
		resultsQueueHandler(this, options),
		propagationHandler(this, options),
		fallbackHandler(this, options),
		function() {
			throw new Errors.EmptyQueryQueueError();
		}
	)
	
	// Can't use promises to chain the handlers because they will convert any error thrown by the handlers to a rejected promise.
	var result;
	function processHandler(handler) {
		if (!handler) return;
		result = handler(options.query, options.queryOptions);
		if (typeof result === "undefined") {
			processHandler(handlers.shift());
		};
	}
	processHandler(handlers.shift());

	// Always convert the result to a promise. If the promise was rejected, this method will return a rejected promise.
	return bluebird.resolve(result);
};

module.exports = QueryInterface;
