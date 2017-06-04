# Setup

The easiest way to get Sequelize Mock is to install it through NPM. Run the following command to install Sequelize Mock and save it to your developer dependencies.

```sh
npm install --save-dev sequelize-mock
```

Alternatively you can install the library by [downloading the latest code](https://github.com/BlinkUX/sequelize-mock/releases).

## Make Fake DB Connection

Because Sequelize Mock is meant to be a drop-in replacement for testing, it mirrors Sequelize in many ways including the base object's functionality. As such, you'll want to setup a fake DB connection, though you don't need any actual connection data.

```javascript
var SequelizeMock = require('sequelize-mock')();

var dbMock = new SequelizeMock();
```

## Creating Mock Objects

Once you've installed the module, you can include it in your test code and define your Mock objects. Mock objects are defined with `db.define([tablename, ] defaultValues, options)`.

```javascript
var UserMock = dbMock.define('user', {
	firstName: 'Jane',
	lastName: 'Doe',
	email: 'test@example.com'
}, {
	instanceMethods: {
		getFullName: function () {
			return this.get('firstName') + ' ' + this.get('lastName');
		},
	},
});
```

## Swapping Model for Mocks

There are a number of libraries out there that can be used to replace `require()` dependencies with mock objects. You can simply use one of these libraries to replace the Sequelize Mock object into your code and it should run exactly as you would expect.

Here is an example of doing so with [proxyquire](https://www.npmjs.com/package/proxyquire)

```javascript
var UserMock = dbMock.define('user', {
	username: 'testuser',
});

var proxyquire = require('proxyquire');

var myModule = proxyquire('user.controller', {
	'./user.model': UserMock
});
```

### Some Mock Injection Libraries
 * [proxyquire](https://www.npmjs.com/package/proxyquire)
 * [mockery](https://www.npmjs.com/package/mockery)
 * [mock-require](https://www.npmjs.com/package/mock-require)

## Writing Tests

Once you've got your mock models created, you're ready to start testing! Your mocks will function in almost the same way as your original models, with the exception that you don't need to rely on a database to be able to run tests.

Here is a sample function I may want to test with my mock objects

```javascript
exports.getUserEmail = function (userId) {
	return User.findOne({
		where: {
			id: userId,
		},
	}).then(function (user) {
	
		// Return user email in format for email client use
		return user.getFullName() + ' <' + user.get('email') + '>';
		
	})
};
```

For this function, a test might look something like this:

```javascript
describe('#getUserEmail', function () {
	it("should return a user's email in NAME <EMAIL> format", function (done) {
		myModule.getUserEmail(1).then(function (email) {
			
			// Given the defined Mock object above, the default values should be used for all the values
			email.should.equal('Jane Doe <test@example.com>')
			
			done();
			
		}).catch(done);
	});
});
```
