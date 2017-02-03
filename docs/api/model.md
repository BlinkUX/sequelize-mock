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




<a name="name"></a>
### .name

Name given to the model on initialization



<a name="Instance"></a>
### .Instance

An empty object with the proper prototype for what functions an Instance gets



<a name="sync"></a>
## sync() -> Promise.&#60;Model&#62;

No-op that returns a promise with the current object

###  Return
Returns <Promise.&#60;Model&#62;> Self



<a name="drop"></a>
## drop() -> Promise

No-op that returns a promise that always resolves

###  Return
Returns <Promise> Promise that always resolves



<a name="getTableName"></a>
## getTableName() -> String

Returns the name of the model

###  Return
Returns <String> the name of the model



<a name="unscoped"></a>
## unscoped() -> Model

No-op that returns the current object

###  Return
Returns <Model> Self



<a name="scope"></a>
## scope() -> Model

No-op that returns the current object

###  Return
Returns <Model> Self



<a name="findAll"></a>
## findAll([options]) -> Promise.&#60;Array.&#60;Instance&#62;&#62;

Creates an array of a single result based on the where query in the options and
wraps it in a promise.

**Example**

```javascript
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
[options] | Object | Map of values that the instance should have


###  Return
Returns <Promise.&#60;Array.&#60;Instance&#62;&#62;> Promise that resolves with an array of length 1



<a name="findById"></a>
## findById(id) -> Promise.&#60;Instance&#62;

Builds a new Instance with the given id and wraps it in a promise.

**See**

 - [findAll](#findAll)

###  Parameters

Name | Type | Description
--- | --- | ---
id | Integer | ID of the instance


###  Return
Returns <Promise.&#60;Instance&#62;> Promise that resolves with an instance with the given ID



<a name="findOne"></a>
## findOne([options]) -> Promise.&#60;Instance&#62;

Builds a new Instance with the given properties pulled from the where object in the
options and wraps it in a promise. <br>**Alias** find

**Example**

```javascript
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
Returns <Promise.&#60;Instance&#62;> Promise that resolves with an instance with the given properties



<a name="max"></a>
## max(field) -> Any

Returns the default value for the given field

###  Parameters

Name | Type | Description
--- | --- | ---
field | String | Name of the field to return for


###  Return
Returns <Any> the default value for the given field



<a name="min"></a>
## min(field) -> Any

Returns the default value for the given field

###  Parameters

Name | Type | Description
--- | --- | ---
field | String | Name of the field to return for


###  Return
Returns <Any> the default value for the given field



<a name="sum"></a>
## sum(field) -> Any

Returns the default value for the given field

###  Parameters

Name | Type | Description
--- | --- | ---
field | String | Name of the field to return for


###  Return
Returns <Any> the default value for the given field



<a name="build"></a>
## build([options]) -> Instance

Builds a new Instance with the given properties

###  Parameters

Name | Type | Description
--- | --- | ---
[options] | Object | Map of values that the instance should have


###  Return
Returns <Instance> a new instance with any given properties



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
Returns <Promise.&#60;Instance&#62;> a promise that resolves after saving a new instance with the given properties



<a name="findOrCreate"></a>
## findOrCreate(options) -> Promise.&#60;Array.&#60;Instance, Boolean&#62;&#62;

By default triggers a create action based on the given properties from the where in
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
Returns <Promise.&#60;Array.&#60;Instance, Boolean&#62;&#62;> Promise that includes the instance and whether or not it was created



<a name="upsert"></a>
## upsert(values) -> Promise.&#60;Boolean&#62;

Attempts to save an instance with the given options. By default will return true <br>**Alias** insertOrUpdate

###  Parameters

Name | Type | Description
--- | --- | ---
values | Object | Values of the Instance being created


###  Return
Returns <Promise.&#60;Boolean&#62;> Promise that resolves with a boolean meant to indicate if something was inserted



<a name="bulkCreate"></a>
## bulkCreate(set) -> Promise.&#60;Array.&#60;Instance&#62;&#62;

Takes an array of value sets and creates a set of instances of this model.

**See**

 - [create](#create)

###  Parameters

Name | Type | Description
--- | --- | ---
set | Array.&#60;Object&#62; | Set of values to create objects for


###  Return
Returns <Promise.&#60;Array.&#60;Instance&#62;&#62;> Promise that contains all created Instances



<a name="destroy"></a>
## destroy([options]) -> Promise.&#60;Integer&#62;

Always resolves with either the limit from the options or a 1, indicating how many
rows would be deleted

###  Parameters

Name | Type | Description
--- | --- | ---
[options] | Object | Options for the query
[options.limit] | Number | Number of rows that are deleted


###  Return
Returns <Promise.&#60;Integer&#62;> Promise with number of deleted rows



<a name="update"></a>
## update(values) -> Promise.&#60;Array.&#60;Integer, Array.&#60;Instance&#62;&#62;&#62;

Creates 1 new Instance that matches the where value from the first parameter and
returns a Promise with an array of the count of affected rows (always 1) and the
affected rows (the newly created Instance)

###  Parameters

Name | Type | Description
--- | --- | ---
values | Object | Values to build the Instance


###  Return
Returns <Promise.&#60;Array.&#60;Integer, Array.&#60;Instance&#62;&#62;&#62;> Promise with an array of the number of affected rows and the affected rows themselves

