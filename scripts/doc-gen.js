'use strict';

var path = require('path'),
	fs = require('fs'),
	glob = require('glob'),
	_ = require('lodash'),
	dox = require('dox'),
	pkg = require('../package.json');

var DOCUMENTATION_ORDER = {
	'Sequelize': 1,
	'Model': 2,
	'Instance': 3,
	'DataTypes': 4,
	'QueryInterface': 5,
	'Errors': 6,
	'Utils': 7,
};

/**	DocFile
 *	
 *	Wrapper for file that we are generativng documentation for. Will
 *	be used to group rendering in meaningful ways
 *	
 **/
function DocFile (file, contents) {
	this.uri = file;
	this.dir = path.dirname(file);
	this.filename = path.basename(file);
	this.name = this.filename.replace(/\.js$/, '');
	this.contents = contents;
	this.comments = [];
	
	this.process();
}

DocFile.prototype.process = function () {
	var rawComments = dox.parseComments(this.contents, {
			raw: true,
			skipSingleStar: true,
		}),
		self = this;
	
	this.comments = [];
	_.each(rawComments, function (rawComment) {
		if(rawComment.ctx && !rawComment.isPrivate) {
			self.comments.push( new DocComment(rawComment, self) );
		}
	});
	
	return this;
};

DocFile.prototype.addComment = function (comment) {
	this.comments.push(comment);
	comment.setFile(this);
};

DocFile.prototype.render = function () {
	this.markdown = _.map(this.comments, function (comment) {
		return (comment.render() || '');
	}, '').join('\n\n');
	return this.markdown;
};

/**	DocComment
 *	
 *	Documentation comment object meant for encapsulating the behavior
 *	we want.
 *	
 **/
function DocComment (data, file) {
	this.data = data;
	this.file = file;
}

DocComment.printableTypeList = function (item) {
	var types = item.types.join(', ');
	types = types.replace(/(<|>|&)/g, function (ch) {
		return '&#' + ch.charCodeAt(0) + ';';
	});
	return types;
};

DocComment.prototype.setFile = function (file) {
	this.file = file;
};

DocComment.prototype.getTags = function (filter) {
	if(!filter)
		return this.data.tags;
	return _.filter(this.data.tags, { type: filter });
};

DocComment.prototype.getTag = function (name) {
	return _.find(this.data.tags, { type: name });
};

DocComment.prototype.getName = function () {
	return (this.getTag('name')     || '').string ||
	       (this.getTag('class')    || '').string ||
	       (this.getTag('property') || '').string ||
	       (this.getTag('method')   || '').string ||
	       this.data.ctx.name;
};

DocComment.prototype.getParams = function () {
	return _.map(
		_.filter(this.getTags('param'), function (param) {
			return param.name.indexOf('.') < 0;
		}),
		function (param) {
			return param.name;
		});
};

DocComment.prototype.getType = function () {
	if(this.getTag('fileOverview') || this.getTag('file'))
		return 'file';
	if(this.getTag('method'))
		return 'method';
	return this.data.ctx.type;
};

DocComment.prototype.render = function () {
	var output = '',
		type = this.getType(),
		parameters = this.getTags('param'),
		retType = this.getTag('return'),
		properties = this.getTags('prop');
	
	var firstLevelHeader = '## ',
		methodPrefix = '',
		propertyPrefix = '',
		secondLevelHeader = '### ',
		thirdLevelHeader = '#### ';
	
	if(this.getTag('memberof') || this.getTag('member')) {
		firstLevelHeader = '### ';
		methodPrefix = '#';
		propertyPrefix = '.';
		secondLevelHeader = '#### ';
		thirdLevelHeader = '##### ';
	}
	
	function linkText(prefix, text, suffix) {
		if(arguments.length == 1) {
			text = prefix;
			prefix = '';
		}
		prefix = prefix || '';
		text = text || '';
		suffix = suffix || '';
		
		if(text.startsWith('{@link')) {
			text = text.slice(0, text.length - 1).replace(/\{@link\s*/, '');
			var link = text,
				indexTextSplit = text.indexOf('|');
			
			if(indexTextSplit > 0) {
				link = text.slice(0, indexTextSplit);
				// Remove the space or pipe
				text = text.slice(indexTextSplit + 1);
			} else {
				link = link.replace(/[^0-9a-zA-Z]/g, '');
				text = text.replace(/]/g, '');
			}
			
			if(!(link.startsWith('./') || link.startsWith('#') || link.match(/^https?:\/\//i))) {
				link = '#' + link;
			}
			
			return '[' + prefix + text + suffix + '](' + link + ')';
		}
		return prefix + text + suffix;
	}
	
	if(type === 'file') {
		output += '# ' + this.getName();
		output += '\n\n';
		
		if(this.file) {
			this.file.name = this.getName();
		}
	} else {
		output += '<a name="' + this.getName().replace(/[^0-9a-zA-Z]/g, '') + '"></a>\n';
		
		if(type === 'constructor' || type === 'method') {
			output += firstLevelHeader + methodPrefix + (type === 'constructor' ? 'new ' : '') + this.getName();
			output += '(' + this.getParams().join(', ') + ')';
			
			if( retType ) {
				output += ' -> ' + DocComment.printableTypeList(retType);
			}
		} else if (type === 'property') {
			output += firstLevelHeader + propertyPrefix + this.getName();
			
		} else {
			output += firstLevelHeader + (type === 'constructor' ? 'new ' : '') + this.getName();
		}
		
		output += '\n\n';
	}
	
	output += this.data.description.full;
	
	if(this.getTags('extends').length) {
		output += ' <br>**Extends** ';
		output += _.map(this.getTags('extends'), function (extendsItem) {
				return linkText(extendsItem.string);
			}).join(', ');
		output += '';
	}
	
	if(this.getTags('alias').length) {
		output += ' <br>**Alias** ';
		output += _.map(this.getTags('alias'), function (aliasItem) {
				return aliasItem.string;
			}).join(', ');
		output += '';
	}
	
	if(this.getTags('example').length) {
		output += '\n\n';
		output += '**Example**\n\n';
		output += _.map(this.getTags('example'), function (extendsItem) {
				return '```javascript\n' + extendsItem.string + '\n```';
			}).join(', ');
		output += '';
	}
	
	if(this.getTags('see').length) {
		output += '\n\n';
		output += '**See**\n\n';
		output += _.map(this.getTags('see'), function (seeItem) {
			return ' - ' + linkText(seeItem.string);
		}).join('\n');
	}
	
	if(type === 'constructor' || type === 'method') {
		if(parameters.length) {
			output += '\n\n';
			output += secondLevelHeader + ' Parameters';
			output += '\n\n';
			output += 'Name | Type | Description\n';
			output += '--- | --- | ---\n';
			_.each(parameters, function (param) {
				output += param.name + ' | ' + DocComment.printableTypeList(param) + ' | ' + param.description;
				output += '\n';
			});
		}
		
		if(properties.length) {
			output += '\n\n';
			output += secondLevelHeader + ' Properties\n';
			_.each(properties, function (prop) {
				output += ' - ' + prop.string;
				output += '\n';
			});
		}
		
		if( retType ) {
			output += '\n\n';
			output += secondLevelHeader + ' Return\n';
			output += '`' + retType.types.join(', ').replace(/`/g, "'") + '`: ' + retType.description;
		}
	}
	
	this.markdown = output;
	
	return output + '\n\n';
};

/**	Begin Doc Generation Script
 *	
 *	Begin script to process files to docs
 *	
 **/
var STEP = 1;

// Get all the files
var getFiles = new Promise(function (resolve, reject) {
	console.log('STEP ' + (STEP++) + ': Listing JS Files');
	glob(path.normalize(__dirname + '/../src') + '/**/!(index).js', function (err, files) {
		if(err) {
			return reject(err);
		}
		
		resolve(files);
	});
});

// Read the Files In
var fileReader = getFiles.then(function (files) {
	console.log('STEP ' + (STEP++) + ': Read JS Files');
	return Promise.all(_.map(files, function (file, index) {
		console.log('\t(' + (index + 1) + '/' + files.length + '): src/' + path.basename(file));
		return new Promise(function (resolve, reject) {
			fs.readFile(file, { encoding: 'utf8' }, function (err, contents) {
				if(err) return reject(err);
				resolve(new DocFile(file, contents));
			});
		});
	}));
});

// Parse The Comments
var renderFiles = fileReader.then(function (files) {
	console.log('STEP ' + (STEP++) + ': Render Markdown');
	return _.map(files, function (file, index) {
		console.log('\t(' + (index + 1) + '/' + files.length + '): src/' + file.filename);
		
		file.render();
		
		return file;
	});
});

// Save the markdown to a file
var saveFiles = renderFiles.then(function (renderedFiles) {
	console.log('STEP ' + (STEP++) + ': Saving Files');
	return Promise.all(_.map(renderedFiles, function (render, index) {
		var originalFilename = render.filename,
			mdName = originalFilename.replace(/js$/, 'md'),
			renderfile = path.normalize(__dirname + '/../docs/api/') + mdName;
		
		render.renderedFile = renderfile;
		render.renderedFileName = mdName;
		
		console.log('\t(' + (index + 1) + '/' + renderedFiles.length + '): docs/api/' + mdName);
		return new Promise(function (resolve, reject) {
			fs.writeFile(
				renderfile,
				render.markdown,
				function (err) {
					if(err) return reject(err);
					resolve(render);
				});
		});
	}));
});

// Add Navigation to mkdocs.yml
var saveFiles = renderFiles.then(function (renderedFiles) {
	console.log('STEP ' + (STEP++) + ': Add files to documentation navigation');
	
	return new Promise(function (resolve, reject) {
		fs.readFile(
			path.normalize(__dirname + '/../') + 'mkdocs.yml',
			{ encoding: 'utf8' },
			function (err, contents) {
				if(err) return reject(err);
				
				var fileList = _.sortBy(renderedFiles, function (file) {
					return DOCUMENTATION_ORDER[file.name] || 1000;
				});
				
				fileList = _.map(fileList, function (file) {
					return "  - '" + file.name + "': 'api/" + file.renderedFileName + "'";
				}).join('\n')
				
				contents = contents.replace(/### API PAGES START[^]+### API PAGES END/m, '### API PAGES START\n' +
					fileList + '\n' +
					'### API PAGES END');
				
				fs.writeFile(
					path.normalize(__dirname + '/../') + 'mkdocs.yml',
					contents,
					function (err) {
						if(err) return reject(err);
						resolve(renderedFiles);
					}
				);
			}
		);
	});
	
	return _.map(renderedFiles, function (render, index) {
		var originalFilename = render.filename,
			mdName = originalFilename.replace(/js$/, 'md'),
			renderfile = path.normalize(__dirname + '/../docs/api/') + mdName;
		
		console.log('\t(' + (index + 1) + '/' + renderedFiles.length + '): docs/api/' + mdName);
		return new Promise(function (resolve, reject) {
			fs.writeFile(
				renderfile,
				render.markdown,
				function (err) {
					if(err) return reject(err);
					resolve();
				});
		});
	});
});

saveFiles.then(function () {
	console.log('SUCCESS');
}, function (errors) {
	console.error(errors.stack);
});
