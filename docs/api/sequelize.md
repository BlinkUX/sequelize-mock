# Sequelize

The mock class for the base Sequelize interface.



<a name="Sequelize"></a>
## new Sequelize([database], [username], [password], [options])

Sequelize Mock Object. This can be initialize much the same way that Sequelize itself
is initialized. Any configuration or options is ignored, so it can be used as a drop-in
replacement for Sequelize but does not have all the same functionality or features.

###  Parameters

Name | Type | Description
--- | --- | ---
[database] | String | Ignored for Mock objects, supported to match Sequelize
[username] | String | Ignored for Mock objects, supported to match Sequelize
[password] | String | Ignored for Mock objects, supported to match Sequelize
[options] | String | Options object. Most default Sequelize options are ignored unless listed below. All, however, are available by accessing `sequelize.options`
[options.dialect='mock'] | String | Dialect that the system will use. Avaible to be returned by `getDialect()` but has no other effect
[options.autoQueryFallback] | Boolean | Flag inherited by defined Models indicating if we should try and generate results based on the query automatically
[options.stopPropagation] | Boolean | Flag inherited by defined Models indicating if we should not propagate to the parent




<a name="options"></a>
### .options

Options passed into the Sequelize initialization



<a name="models"></a>
### .models

Models that have been defined in this Sequelize Mock instances



<a name="version"></a>
### .version

Version number for the Mock library



<a name="Sequelize"></a>
## Sequelize

Reference to the mock Sequelize class



<a name="Utils"></a>
## Utils

Reference to the Util functions



<a name="Promise"></a>
## Promise

Reference to the bluebird promise library



<a name="QueryTypes"></a>
## QueryTypes

Object containing all of the [Sequelize QueryTypes](https://github.com/sequelize/sequelize/blob/3e5b8772ef75169685fc96024366bca9958fee63/lib/query-types.js).



<a name="Model"></a>
## Model

Reference to the mock Model class



<a name="Instance"></a>
## Instance

Reference to the mock Instance class



<a name="queueResult"></a>
## $queueResult(result) -> Sequelize

Queue a new query result to be returned by either the `query` method call or as a
fallback from queries from `Model`s defined through the `define` method. <br>**Alias** $queueQueryResult, $qqr

**See**

 - [query](#query)

###  Parameters

Name | Type | Description
--- | --- | ---
result | Any | The object or value to be returned as the result of a query


###  Return
`Sequelize`: self



<a name="queueFailure"></a>
## $queueFailure(error, [options]) -> Sequelize

Queue a new query result to be returned by either the `query` method call or as a
fallback from queries from `Model`s defined through the `define` method. This result
is returned as a rejected promise for testing error handling. <br>**Alias** $queueQueryFailure, $queueError, $queueQueryError, $qqf

**See**

 - [query](#query)

###  Parameters

Name | Type | Description
--- | --- | ---
error | Any | The object or value to be returned as the failure for a query
[options] | Object | 
[options.convertNonErrors] | Boolean | Flag indicating if non `Error` objects should be allowed. Defaults to true


###  Return
`Sequelize`: self



<a name="clearQueue"></a>
## $clearQueue() -> Sequelize

Clears any queued results from `$queueResult` or `$queueFailure` <br>**Alias** $queueClear, $queueQueryClear, $cqq, $qqc

**See**

 - [$queueResult](#queueResult)
 - [$queueFailure](#queueFailure)

###  Return
`Sequelize`: self



<a name="getDialect"></a>
## getDialect() -> String

Returns the specified dialect

###  Return
`String`: The specified dialect



<a name="getQueryInterface"></a>
## getQueryInterface() -> QueryInterface

Returns the current instance of `QueryInterface`

**See**

 - [QueryInterface](./queryinterface.md)
 - [query](#query)

###  Return
`QueryInterface`: The instantiated `QueryInterface` object used for test `query`



<a name="define"></a>
## define(name, [obj={}], [opts]) -> Model

Define a new mock Model. You should provide a name and a set of default values for this
new Model. The default values will be used any time a new Instance of this model is
created and will be overridden by any values provided specifically to that Instance.

Additionally an options object can be passed in with an `instanceMethods` map. All of
functions in this object will be added to any Instance of the Model that is created.

All models are available by name via the `.models` property

**Example**

```javascript
sequelize.define('user', {
		'name': 'Test User',
		'email': 'test@example.com',
		'joined': new Date(),
	}, {
		'instanceMethods': {
			'tenure': function () { return Date.now() - this.get('joined'); },
		},
	});
```

**See**

 - Model

###  Parameters

Name | Type | Description
--- | --- | ---
name | String | Name of the mock Model
[obj={}] | Object | Map of keys and their default values that will be used when querying against this object
[opts] | Object | Options for the mock model
[opts.instanceMethods] | Object | Map of function names and the functions to be run. These functions will be added to any instances of this Model type


###  Return
`Model`: Mock Model as defined by the name, default values, and options provided



<a name="isDefined"></a>
## isDefined(name) -> Boolean

Checks whether a model with the given name is defined.

Uses the `.models` property for lookup.

###  Parameters

Name | Type | Description
--- | --- | ---
name | String | Name of the model


###  Return
`Boolean`: True if the model is defined, false otherwise



<a name="model"></a>
## model(name) -> Model

Fetch a Model which is already defined.

Uses the `.models` property for lookup.

###  Parameters

Name | Type | Description
--- | --- | ---
name | String | Name of the model


###  Return
`Model`: Mock model which was defined with the specified name



<a name="query"></a>
## query() -> Promise.&#60;Any&#62;

Run a mock query against the `QueryInterface` associated with this Sequelize instance

###  Return
`Promise.<Any>`: The next result of a query as queued to the `QueryInterface`



<a name="transaction"></a>
## transaction([fn]) -> Promise

This function will simulate the wrapping of a set of queries in a transaction. Because
Sequelize Mock does not run any actual queries, there is no difference between code
run through transactions and those that aren't.

###  Parameters

Name | Type | Description
--- | --- | ---
[fn] | Function | Optional function to run as a tranasction


###  Return
`Promise`: Promise that resolves the code is successfully run, otherwise it is rejected



<a name="literal"></a>
## literal(arg) -> Any

Simply returns the first argument passed in, unmodified.

###  Parameters

Name | Type | Description
--- | --- | ---
arg | Any | Value to return


###  Return
`Any`: value passed in

