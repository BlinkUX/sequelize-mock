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



<a name="getDialect"></a>
## getDialect() -> String

Returns the specified dialect

###  Return
Returns <String> The specified dialect



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
Returns <Model> Mock Model as defined by the name, default values, and options provided



<a name="query"></a>
## query() -> Promise

This function will always return a rejected Promise. This method should be overriden
as needed in your tests to return the proper data from your raw queries.

###  Return
Returns <Promise> A rejected promise with an error detailing that mock queries are too broad to stub in a meaningful way



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
Returns <Promise> Promise that resolves the code is successfully run, otherwise it is rejected



<a name="literal"></a>
## literal(arg) -> Any

Simply returns the first argument passed in, unmodified.

###  Parameters

Name | Type | Description
--- | --- | ---
arg | Any | Value to return


###  Return
Returns <Any> value passed in

