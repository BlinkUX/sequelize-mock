'use strict';

/**
 * Interface for some of the Sequelize Utilities exposed in the `Sequelize.Utils` object.
 * 
 * @name Utils
 * @fileOverview Utility function interface to match Sequelize
 */

var inflection = require('inflection');

/**
 * Uppercase the first character in a string. Matches Sequelize functionality.
 * 
 * @param {String} str String to uppercase the first character of
 * @return {String} modified string
 **/
exports.uppercaseFirst = function (str) {
	return str[0].toUpperCase() + str.slice(1);
};

/**
 * Lowercase the first character in a string. Matches Sequelize functionality.
 * 
 * @param {String} str String to uppercase the first character of
 * @return {String} modified string
 **/
exports.lowercaseFirst = function (str) {
	return str[0].toLowerCase() + str.slice(1);
};

/**
 * Returns the "singular" version of a word. As with Sequelize, this uses the [inflection
 * library](https://github.com/dreamerslab/node.inflection) to accomplish this.
 * 
 * @param {String} str Word to convert to its singular form
 * @return {String} singular version of the given word
 **/
exports.singularize = function(str) {
	return inflection.singularize(str);
};

/**
 * Returns the "plural" version of a word. As with Sequelize, this uses the [inflection
 * library](https://github.com/dreamerslab/node.inflection) to accomplish this.
 * 
 * @param {String} str Word to convert to its plural form
 * @return {String} plural version of the given word
 **/
exports.pluralize = function(str) {
	return inflection.pluralize(str);
};

/**
 * Gets the current stack frame
 * 
 **/
exports.stack = function () {
	// Stash original stack prep
	var prepareStackTrace = Error.prepareStackTrace;
	Error.prepareStackTrace = function (_, s) { return s; };
	var curr = {};
	Error.captureStackTrace(curr, exports.stack);
	var stack = curr.stack;
	Error.prepareStackTrace = prepareStackTrace;
	return stack;
};

/**
 * Exposed version of the lodash library
 * 
 * @name lodash
 * @alias _
 * @property
 **/
exports._ = exports.lodash = require('lodash');
