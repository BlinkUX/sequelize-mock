# Sequelize Mock
A simple mocking interface designed for applications that use the [sequelize.js](http://sequelizejs.com) library. This library is specifically for testing code relying on Sequelize models **and is therefore a very bare library at the moment**. The more complex functionality of Sequelize has not been included and the library will likely be fleshed out to include this functionality as needed.

Once Mock models have been defined, the mock models should be drop in replacements for your Sequelize model objects. Data is not retrieved from a database and instead is returned based on the setup of the mock objects, the query being made, and other applied or included information.

## Example Usage

```javascript
// Import the mock library
var SequelizeMock = require('sequelize-mock');

// Setup the mock database connection
var DBConnectionMock = new SequelizeMock();

// Define our Model
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

// You can also associate mock models as well
var GroupMock = DBConnectionMock.define('groups', {
	'name': 'My Awesome Group',
});

UserMock.belongsTo(GroupMock);

// From there we can start using it like a normal model
UserMock.findOne({
	where: {
		username: 'my-user',
	},
}).then(function (user) {
	// `user` is a Sequelize Model-like object
	user.get('id');         // Auto-Incrementing ID available on all Models
	user.get('email');      // 'email@example.com'; Pulled from default values
	user.get('username')';  // 'my-user'; Pulled from the `where` in the query
	
	user.myTestFunc(); // Will return 'Test User' as defined above
	
	user.getGroup(); // Will return a `GroupMock` object
});
```

# License

Created by Blink UX and licensed under the MIT license. Check the LICENSE file for more information.
