# Sequelize Mock
[![npm](https://img.shields.io/npm/v/sequelize-mock.svg)](https://www.npmjs.com/package/sequelize-mock) [![CircleCI](https://img.shields.io/circleci/project/BlinkUX/sequelize-mock.svg)](https://circleci.com/gh/BlinkUX/sequelize-mock) [![Coveralls](https://img.shields.io/coveralls/BlinkUX/sequelize-mock.svg)](https://coveralls.io/github/BlinkUX/sequelize-mock) [![MIT License](https://img.shields.io/github/license/BlinkUX/sequelize-mock.svg)](https://github.com/BlinkUX/sequelize-mock) [![Documentation Status](https://readthedocs.org/projects/sequelize-mock/badge/?version=stable)](http://sequelize-mock.readthedocs.io/en/stable/?badge=stable)

A mocking interface designed for testing code that uses [Sequelize](http://sequelizejs.com).

Documentation at [sequelize-mock.readthedocs.io](https://sequelize-mock.readthedocs.io/)

## Install

```
npm i sequelize-mock --save-dev
```

## Getting Started

The Mock Models created with this library function as drop in replacements for your unit testing.

Start by importing the library

```javascript
var SequelizeMock = require('sequelize-mock');
```

Initialize the library as you would Sequelize

```javascript
var DBConnectionMock = new SequelizeMock();
```

Define your models

```javascript
var UserMock = DBConnectionMock.define('users', {
		'email': 'email@example.com',
		'username': 'blink',
		'picture': 'user-picture.jpg',
	}, {
		instanceMethods: {
			myTestFunc: function () {
				return 'Test User';
			},
		},
	});
```

Once Mock models have been defined, you can use them as drop-in replacements for your Sequelize model objects. Data is not retrieved from a database and instead is returned based on the setup of the mock objects, the query being made, and other applied or included information.

For example, your code might look something like this

```javascript
UserMock.findOne({
	where: {
		username: 'my-user',
	},
}).then(function (user) {
	// `user` is a Sequelize Model-like object
	user.get('id');         // Auto-Incrementing ID available on all Models
	user.get('email');      // 'email@example.com'; Pulled from default values
	user.get('username');   // 'my-user'; Pulled from the `where` in the query
	
	user.myTestFunc();      // Will return 'Test User' as defined above
});
```

## Contributing

This library is under active development, so you should feel free to submit issues, questions, or pull requests.

## License

Created by Blink UX and licensed under the MIT license. Check the LICENSE file for more information.
