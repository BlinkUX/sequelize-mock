# Defining Mocks

To create a mock object for use in tests, you will need to use the `define` method. This will set up basic mocking functionality similar to what Sequelize would provide. In addition to whatever default values you define, Sequelize Mock will also create an auto-incrementing `id` value as well as a `createdAt` and `updatedAt` value which defaults to the time of creation.

Defining a mock object is primarily about setting up a set of default values you will return for a query. Optionally, you can include a name of the model. For the most part, you should name your mock object the same thing you have named your model. This will allow any associations to be properly set up with calls to associations.

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

# Usage

Sequelize Mocks will return mock objects that are a combination of the default values provided as well as any queried values. Any values in the `where` query for any function that would normally hit the database will return an object with the where parameters as well as the default values provided.

```javascript
var Team = dbMock.define('team', {
	name: 'Test Team',
});

Team.findOne({
	where: {
		name: 'My Other Team',
		group: 'Team Group 1'
	},
}).then(function (team) {
	
	team.get('name');  // 'My Other Team'
	team.get('group'); // 'Team Group 1'
	
});
```
