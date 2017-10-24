# Model

This is the base mock Model class that will be the primary way to use Sequelize Mock.

Mock Models should mostly behave as drop-in replacements for your Sequelize Models
when running unit tests for your code.



<a name="Model"></a>
## new Model(name, [defaults={}], [opts])

Model mock class. Models most often should be defined using the `sequelize.define()`
function.

###  Parameters

Name | Type | Description
--- | --- | ---
name | Object | Name of the model
[defaults={}] | Object | The default values to use when creating a new instance
[opts] | Object | Options for the mock model
[opts.instanceMethods] | Object | Map of function names and the functions to be run. These functions will be added to any instances of this Model type
[opts.sequelize] | Object | Sequelize instance that this is tied to




<a name="options"></a>
### .options

The current options for the model



<a name="name"></a>
### .name

Name given to the model on initialization



<a name="Instance"></a>
### #Instance()

The Model's copy of the Instance class used to build instances



<a name="queryInterface"></a>
### .$queryInterface

QueryInterface used to run all queries against for models

If this model is defined with the `Sequelize.define` method, this QueryInterface
will reference the calling `Sequelize` instances QueryInterface when inheriting
any options or propagating any queries.



<a name="queueResult"></a>
## $queueResult(result, [options]) -> QueryInterface

Queues a result for any query run against this model. This result will be wrapped
in a Promise and resolved for most any method that would ordinarily run a query
against the database.

**Example**

```javascript
UserMock.$queueResult(UserMock.build({
	name: 'Alex',
}));
UserMock.findOne().then(function (result) {
	// `result` is the passed in built object
	result.get('name'); // 'Alex'
});

// For `findOrCreate` there is an extra option that can be passed in
UserMock.$queueResult(UserMock.build(), { wasCreated: false });
UserMock.findOrCreate({
	// ...
}).spread(function (user, created) {
	// created == false
});
```

**See**

 - [QueryInterface.$queueResult](./queryinterface.md#queueResult)

###  Parameters

Name | Type | Description
--- | --- | ---
result | Any | The object or value to be returned as the result of a query
[options] | Object | Options used when returning the result
[options.wasCreated] | Boolean | Optional flag if a query requires a `created` value in the return indicating if the object was "created" in the DB
[options.affectedRows] | Array.&#60;Any&#62; | Optional array of objects if the query requires an `affectedRows` return value


###  Return
`QueryInterface`: model instance of QueryInterface



<a name="queueFailure"></a>
## $queueFailure(error, [options]) -> QueryInterface

Queues an error/failure for any query run against this model. This error will be wrapped
in a rejected Promise and be returned for most any method that would ordinarily run a
query against the database. <br>**Alias** $queueError

**Example**

```javascript
UserMock.$queueFailure(new Error('My test error'));
UserMock.findOne().catch(function (error) {
	error.message; // 'My test error'
});

// Non error objects by default are converted to Sequelize.Error objects
UserMock.$queueFailure('Another Test Error');
UserMock.findOne().catch(function (error) {
	error instanceof UserMock.sequelize.Error; // true
});
```

**See**

 - [QueryInterface.$queueFailure](./queryinterface.md#queueFailure)

###  Parameters

Name | Type | Description
--- | --- | ---
error | Any | The object or value to be returned as the failure for a query
[options] | Object | Options used when returning the result
[options.convertNonErrors] | Boolean | Flag indicating if non `Error` objects should be allowed. Defaults to true


###  Return
`QueryInterface`: model instance of QueryInterface



<a name="clearQueue"></a>
## $clearQueue([options]) -> QueryInterface

Clears any queued results or failures for this Model. <br>**Alias** $queueClear

**Example**

```javascript
UserMock.$queueResult(UserMock.build());
// == 1 item in query queue
UserMock.$queueFailure(new Error());
// == 2 items in query queue
UserMock.$clearQueue();
// == 0 items in query queue
```

**See**

 - [QueryInterface.$clearQueue](./queryinterface.md#clearQueue)

###  Parameters

Name | Type | Description
--- | --- | ---
[options] | Object | Options used when returning the result
[options.propagateClear] | Boolean | Propagate this clear up to any parent `QueryInterface`s. Defaults to false


###  Return
`QueryInterface`: model instance of QueryInterface



<a name="sync"></a>
## sync() -> Promise.&#60;Model&#62;

No-op that returns a promise with the current object

###  Return
`Promise.<Model>`: Self



<a name="drop"></a>
## drop() -> Promise

No-op that returns a promise that always resolves

###  Return
`Promise`: Promise that always resolves



<a name="getTableName"></a>
## getTableName() -> String

Returns the name of the model

###  Return
`String`: the name of the model



<a name="unscoped"></a>
## unscoped() -> Model

No-op that returns the current object

###  Return
`Model`: Self



<a name="scope"></a>
## scope() -> Model

No-op that returns the current object

###  Return
`Model`: Self



<a name="findAll"></a>
## findAll([options]) -> Promise.&#60;Array.&#60;Instance&#62;&#62;

Executes a mock query to find all of the instances with any provided options. Without
any other configuration, the default behavior when no queueud query result is present
is to create an array of a single result based on the where query in the options and
wraps it in a promise.

To turn off this behavior, the `$autoQueryFallback` option on the model should be set
to `false`.

**Example**

```javascript
// This is an example of the default behavior with no queued results
// If there is a queued result or failure, that will be returned instead
User.findAll({
	where: {
		email: 'myEmail@example.com',
	},
}).then(function (results) {
	// results is an array of 1
	results[0].get('email') === 'myEmail@example.com'; // true
});
```

###  Parameters

Name | Type | Description
--- | --- | ---
[options] | Object | Options for the findAll query
[options.where] | Object | Values that any automatically created Instances should have


###  Return
`Promise.<Array.<Instance>>`: result returned by the mock query



<a name="findAndCount"></a>
## findAndCount([options]) -> Promise.&#60;Object&#62;

Executes a mock query to find all of the instances with any provided options and also return 
the count. Without any other configuration, the default behavior when no queueud query result 
is present is to create an array of a single result based on the where query in the options and
wraps it in a promise.

To turn off this behavior, the `$autoQueryFallback` option on the model should be set
to `false`. <br>**Alias** findAndCountAll

**Example**

```javascript
// This is an example of the default behavior with no queued results
// If there is a queued result or failure, that will be returned instead
User.findAndCountAll({
	where: {
		email: 'myEmail@example.com',
	},
}).then(function (results) {
	// results is an array of 1
 results.count = 1
	results.rows[0].get('email') === 'myEmail@example.com'; // true
});
```

###  Parameters

Name | Type | Description
--- | --- | ---
[options] | Object | Options for the findAll query
[options.where] | Object | Values that any automatically created Instances should have


###  Return
`Promise.<Object>`: result returned by the mock query



<a name="findById"></a>
## findById(id) -> Promise.&#60;Instance&#62;

Executes a mock query to find an instance with the given ID value. Without any other
configuration, the default behavior when no queueud query result is present is to
create a new Instance with the given id and wrap it in a promise.

To turn off this behavior, the `$autoQueryFallback` option on the model should be set
to `false`.

###  Parameters

Name | Type | Description
--- | --- | ---
id | Integer | ID of the instance


###  Return
`Promise.<Instance>`: Promise that resolves with an instance with the given ID



<a name="findOne"></a>
## findOne([options]) -> Promise.&#60;Instance&#62;

Executes a mock query to find an instance with the given infomation. Without any other
configuration, the default behavior when no queueud query result is present is to
build a new Instance with the given properties pulled from the where object in the
options and wrap it in a promise. <br>**Alias** find

**Example**

```javascript
// This is an example of the default behavior with no queued results
// If there is a queued result or failure, that will be returned instead
User.find({
	where: {
		email: 'myEmail@example.com',
	},
}).then(function (user) {
	user.get('email') === 'myEmail@example.com'; // true
});
```

**See**

 - [findAll](#findAll)

###  Parameters

Name | Type | Description
--- | --- | ---
[options] | Object | Map of values that the instance should have


###  Return
`Promise.<Instance>`: Promise that resolves with an instance with the given properties



<a name="max"></a>
## max(field) -> Any

Executes a mock query to find the max value of a field. Without any other
configuration, the default behavior when no queueud query result is present
is to return the default value for the given field

###  Parameters

Name | Type | Description
--- | --- | ---
field | String | Name of the field to return for


###  Return
`Any`: the default value for the given field



<a name="min"></a>
## min(field) -> Any

Executes a mock query to find the min value of a field. Without any other
configuration, the default behavior when no queueud query result is present
is to return the default value for the given field

###  Parameters

Name | Type | Description
--- | --- | ---
field | String | Name of the field to return for


###  Return
`Any`: the default value for the given field



<a name="sum"></a>
## sum(field) -> Any

Executes a mock query to find the sum value of a field. Without any other
configuration, the default behavior when no queueud query result is present
is to return the default value for the given field

###  Parameters

Name | Type | Description
--- | --- | ---
field | String | Name of the field to return for


###  Return
`Any`: the default value for the given field



<a name="build"></a>
## build([values], [options]) -> Instance

Builds a new Instance with the given properties

###  Parameters

Name | Type | Description
--- | --- | ---
[values] | Object | Map of values that the instance should have
[options] | Object | Options for creating the instance
[options.isNewRecord] | Object | Flag inidicating if this is a new mock record. Defaults to true


###  Return
`Instance`: a new instance with any given properties



<a name="create"></a>
## create(options) -> Promise.&#60;Instance&#62;

Creates a new Instance with the given properties and triggers a save

**See**

 - [build](#build)
 - Instance.save()

###  Parameters

Name | Type | Description
--- | --- | ---
options | Object | Map of values that the instance should have


###  Return
`Promise.<Instance>`: a promise that resolves after saving a new instance with the given properties



<a name="findOrCreate"></a>
## findOrCreate(options) -> Promise.&#60;Array.&#60;Instance, Boolean&#62;&#62;

Executes a mock query to find or create an Instance with the given properties. Without
any other configuration, the default behavior when no queueud query result is present
is to trigger a create action based on the given properties from the where in
the options object.

**See**

 - [findAll](#findAll)
 - [create](#create)

###  Parameters

Name | Type | Description
--- | --- | ---
options | Object | Options for the query
options.where | Object | Map of values that the instance should have


###  Return
`Promise.<Array.<Instance, Boolean>>`: Promise that includes the instance and whether or not it was created



<a name="upsert"></a>
## upsert(values) -> Promise.&#60;Boolean&#62;

Executes a mock query to upsert an Instance with the given properties. Without any
other configuration, the default behavior when no queueud query result is present is
to return the `options.createdDefault` value indicating if a new item has been created <br>**Alias** insertOrUpdate

###  Parameters

Name | Type | Description
--- | --- | ---
values | Object | Values of the Instance being created


###  Return
`Promise.<Boolean>`: Promise that resolves with a boolean meant to indicate if something was inserted



<a name="bulkCreate"></a>
## bulkCreate(set) -> Promise.&#60;Array.&#60;Instance&#62;&#62;

Executes a mock query to create a set of new Instances in a bulk fashion. Without any
other configuration, the default behavior when no queueud query result is present is
to trigger a create on each item in a the given `set`.

**See**

 - [create](#create)

###  Parameters

Name | Type | Description
--- | --- | ---
set | Array.&#60;Object&#62; | Set of values to create objects for


###  Return
`Promise.<Array.<Instance>>`: Promise that contains all created Instances



<a name="destroy"></a>
## destroy([options]) -> Promise.&#60;Integer&#62;

Executes a mock query to destroy a set of Instances. Without any other configuration,
the default behavior when no queueud query result is present is to resolve with either
the limit from the options or a 1.

###  Parameters

Name | Type | Description
--- | --- | ---
[options] | Object | Options for the query
[options.limit] | Number | Number of rows that are deleted


###  Return
`Promise.<Integer>`: Promise with number of deleted rows



<a name="update"></a>
## update(values, [options]) -> Promise.&#60;Array&#62;

Executes a mock query to update a set of instances. Without any other configuration,
the default behavior when no queueud query result is present is to create 1 new
Instance that matches the where value from the first parameter and returns a Promise
with an array of the count of affected rows (always 1) and the affected rows if the
`returning` option is set to true

###  Parameters

Name | Type | Description
--- | --- | ---
values | Object | Values to build the Instance
[options] | Object | Options to use for the update
[options.returning] | Object | Whether or not to include the updated models in the return


###  Return
`Promise.<Array>`: Promise with an array of the number of affected rows and the affected rows themselves if `options.returning` is true

