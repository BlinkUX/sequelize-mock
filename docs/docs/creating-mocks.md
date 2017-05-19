# Defining Mocks

To create a mock object for use in tests, you will need to use the `define` method. This will set up basic mocking functionality similar to what Sequelize would provide. In addition to whatever default values you define, Sequelize Mock will also create an auto-incrementing `id` value as well as a `createdAt` and `updatedAt` value which defaults to the time of creation. This automatic values can be turned off the same way they can be disabled in standard Sequelize.

Defining a mock object is primarily about setting up a set of default values that will be used for new models. It is also best to define a name for the model. For the most part, you should name your mock object the same thing you have named your model. This will allow any associations to be properly set up with calls to associations.

```javascript
var User = dbMock.define('user', {
	username: 'myTestUsername',
	email: 'test@example.com',
});

var Team = dbMock.define('team', {
	name: 'Test Team',
});
```

## Instance Methods

Similar to Sequelize, you can set up methods to be available on every returned mock instance.

```javascript
var Project = dbMock.define('project', {
	name: 'Test Project',
}, {
	instanceMethods: {
		getProjectInfo: function () {
			return this.get('id') + ' - ' + this.get('name');
		}
	},
});
```
