/**	Versioning
  *	
  *	This script contains logic for what needs to take place when
  *	publish a new version of this code to NPM.
  *	
  **/
'use strict';

var fs = require('fs'),
	path = require('path'),
	moment = require('moment'),
	pkg = require('../package.json');

// Update the change log to the new version
console.log('START UPDATING CHANGELOG');
var changelogFile = path.resolve(__dirname, '../changelog.md'),
	changelog = fs.readFileSync(changelogFile, { encoding: 'utf8' }),
	now = moment();
changelog = changelog.replace('vNext', 'v' + pkg.version + ' - ' + now.format('MMM Do YYYY'));
fs.writeFileSync(changelogFile, changelog, { encoding: 'utf8' });
console.log('FINISHED UPDATING CHANGELOG');
