'use strict';

var inflection = require('inflection');

exports.uppercaseFirst = function (str) {
	return str[0].toUpperCase() + str.slice(1);
};
exports.lowercaseFirst = function () {
	return str[0].toLowerCase() + str.slice(1);
};
exports.singularize = function(str) {
	return inflection.singularize(str);
};
exports.pluralize = function(str) {
	return inflection.pluralize(str);
};
