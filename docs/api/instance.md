# Instance

Instances are the individual results from a Sequelize call. In SequelizeMock, these objects
have most of the same attributes as in the normal Sequelize Instance, however they also have
a few additional bits of functionality.

Values for instances are defined by defaults provided to the Model Mock on definition and
they are overriden by values provided during queries. The major exceptions are the `id`,
`createdAt`, and `updatedAt` values, which are available on all instances regardless of if
they are in the query or default values. This is the same way Sequelize will add these to
your instances.

The `id` value is an auto-incrementing value with each query (unless provided as a part of
your query). The `createdAt` and `updatedAt` values are set to the current timestamp at the
time the instance is created.

Additionally, there are a few additional test methods you can use to test functionality
coming from Sequelize behavior. These methods are prefixed with a `$` so as to distinguish
them from mocked native Sequelize functionality. Any test specific properties also include
a double underscore (`__`) so that they are also uniquely distinguished from mock internals.



<a name="Instance"></a>
## new Instance(defaults, [obj])

Instance Mock Object. Creation of this object should almost always be handled through the
`Model` class methods. In cases when you need to create an `Instance` directly, providing
the `defaults` parameter should be enough, as the `obj` overrides parameter is optional.

###  Parameters

Name | Type | Description
--- | --- | ---
defaults | Object | The default values. This will come from the Model when created via that class
[obj] | Object | Any overridden values that should be specific to this instance




<a name="dataValues"></a>
### .dataValues

As with Sequelize, we include a `dataValues` property which contains the values for the
instance. As with Sequelize, you should use other methods to edit the values for any
code that will also interact with Sequelize.

For test code, when possible, we also recommend you use other means to validate. But
this object is also available if needed. <br>**Alias** _values



<a name="addValidationError"></a>
## $addValidationError(col, [message], [type]) -> Instance

Create a new validation error to be triggered the next time a validation would run. Any
time Sequelize code would go to the database, it will trigger a check for any validation
errors that should be thrown. This allows you to test any validation failures in a more
unit-testing focused manner.

Once a validation has occured, all validation errors will be emptied from the queue and
returned in a single `ValidationError` object.

If you do add validation errors for a test, be sure to clear the errors after each test
so you don't fail your next test in case a validation does not occur. You can do so by
calling the [`$clearValidationErrors`](#clearValidationErrors) method.

**Example**

```javascript
myUser.$addValidationError('email', 'Not a valid email address', 'InvalidEmail');

// ...

myUser.save().then(function () {}, function (error) {
	// error will be a ValidationErrorItem
	error.errors[0].type === 'InvalidEmail';
});
```

**See**

 - [clearValidationErrors](#clearValidationErrors)

###  Parameters

Name | Type | Description
--- | --- | ---
col | String | Field to add validation error for
[message] | String | Message the error should contain
[type] | String | Type of the validation error


###  Return
`Instance`: Instance object for chainability



<a name="removeValidationError"></a>
## $removeValidationError(col) -> Instance

Removes all validation errors that would be triggered against a specific column.

###  Parameters

Name | Type | Description
--- | --- | ---
col | String | Field to remove validation errors for


###  Return
`Instance`: The object for chainability



<a name="clearValidationErrors"></a>
## $clearValidationErrors() -> Instance

Removes all validation errors for every column.

**Example**

```javascript
beforeEach(function () {
	myUser = new Instance({ 'name': 'Test' });
});

afterEach(function () {
	// Recommended that you always run $clearValidationErrors after
	// each test so that you don't pollute your test data
	myUser.$clearValidationErrors();
});
```

###  Return
`Instance`: The object for chainability



<a name="set"></a>
## set(key, [val]) -> Instance

Sets the value for the given key. Also accepts an object as the first parameter
and it will loop through the key/value pairs and set each.

###  Parameters

Name | Type | Description
--- | --- | ---
key | String, Object | Key to set the value for. If `key` is an Object, each key/value pair will be set on the Instance
[val] | Any | Any value to set on the Instance. If `key` is an Object, this parameter is ignored.


###  Return
`Instance`: The object for chainability



<a name="get"></a>
## get([key]) -> Any, Object

If no key is provided, it will return all values on the Instance.

If a key is provided, it will return that value

###  Parameters

Name | Type | Description
--- | --- | ---
[key] | String, Object | Key to get the value for


###  Return
`Any, Object`: either the value of the key, or all the values if there is no key or key is an object with plain set to true: {plain: true}



<a name="validate"></a>
## validate() -> Promise.&#60;ValidationErrorItem|undefined&#62;

Triggers validation. If there are errors added through `$addValidationError` they will
be returned and the queue of validation errors will be cleared.

As with Sequelize, this will **resolve** any validation errors, not throw the errors.

###  Return
`Promise.<ValidationErrorItem|undefined>`: will resolve with any errors, or with nothing if there were no errors queued.



<a name="save"></a>
## save() -> Promise.&#60;Instance&#62;

Because there is no database that it saves to, this will mainly trigger validation of
the Instance and reject the promise if there are any validation errors.

###  Return
`Promise.<Instance>`: Instance if there are no validation errors, otherwise it will reject the promise with those errors



<a name="destroy"></a>
## destroy() -> Promise

This simply sets the `deletedAt` value and has no other effect on the mock Instance

###  Return
`Promise`: will always resolve as a successful destroy



<a name="reload"></a>
## reload() -> Promise.&#60;Instance&#62;

This has no effect on the Instance

###  Return
`Promise.<Instance>`: will always resolve with the current instance



<a name="update"></a>
## update() -> Promise.&#60;Instance&#62;

Acts as a `set()` then a `save()`. That means this function will also trigger validation
and pass any errors along

**See**

 - [set](#set)
 - [save](#save)

###  Return
`Promise.<Instance>`: Promise from the save function



<a name="toJSON"></a>
## toJSON() -> Object

Returns all the values in a JSON representation. <br>**Alias** toJson

###  Return
`Object`: all the values on the object

