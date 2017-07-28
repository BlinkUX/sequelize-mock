# QueryInterface

To support running mock queries, we use this object to queue results for queries. This
is to provide full control over the objects that are returned and do so in a way that
allows you to target specific code paths.

Queries are queued in a "first in, last out" manner, so they should be inserted in the
order your code would expect them in. The queue itself does no checking or validation
for what types of objects are being passed around except in the case of failures
(see `$queueFailure`).

**Note:** This is not an equivalent mock of Sequelize's built in `QueryInterface` at
the moment. The built in object for Sequelize is undocumented and is marked as `@private`
in their code, meaning it is not likely something to be relied on. If this changes it
can be mocked here. Functions have been prefixed with the mock prefix (`$`) for this
reason.



<a name="QueryInterface"></a>
## new QueryInterface([options])

The `QueryInterface` class is used to provide common mock query functionality. New
instances of this class should mostly be created internally, however the functions on
the class are exposed on objects utilize this class.

###  Parameters

Name | Type | Description
--- | --- | ---
[options] | Object | Options for the query interface to use
[options.parent] | QueryInterface | Parent `QueryInterface` object to propagate up to
[options.stopPropagation] | Boolean | Flag indicating if we should not propagate to the parent
[options.createdDefault] | Boolean | Default value to be used for if something has been created if one is not passed in by the query. Defaults to true
[options.fallbackFn] | Function | Default function to call as a fallback if nothing is left in the queue and a fallback function is not passed in with the query




<a name="queueResult"></a>
## $queueResult(result, [options]) -> QueryInterface

Queue a new success result from the mock database

###  Parameters

Name | Type | Description
--- | --- | ---
result | Any | The object or value to be returned as the result of a query
[options] | Object | Options used when returning the result
[options.wasCreated] | Boolean | Optional flag if a query requires a `created` value in the return indicating if the object was "created" in the DB
[options.affectedRows] | Array.&#60;Any&#62; | Optional array of objects if the query requires an `affectedRows` return value


###  Return
`QueryInterface`: self



<a name="queueFailure"></a>
## $queueFailure(error, [options]) -> QueryInterface

Queue a new error or failure result from the mock database. This will cause a query
to be rejected with the given error/failure object. The error is converted into a
`BaseError` object unless specified by the `options.convertNonErrors` parameter. <br>**Alias** $queueError

###  Parameters

Name | Type | Description
--- | --- | ---
error | Any | The object or value to be returned as the failure for a query
[options] | Object | Options used when returning the result
[options.convertNonErrors] | Boolean | Flag indicating if non `Error` objects should be allowed. Defaults to true


###  Return
`QueryInterface`: self



<a name="useHandler"></a>
## $useHandler(handler) -> QueryInterface

Adds a new query handler from the mock database

###  Parameters

Name | Type | Description
--- | --- | ---
handler | Function | The function that will be invoked with the query.


###  Return
`QueryInterface`: self



<a name="clearQueue"></a>
## $clearQueue([options]) -> QueryInterface

Clears any queued query results <br>**Alias** $queueClear

###  Parameters

Name | Type | Description
--- | --- | ---
[options] | Object | Options used when returning the result
[options.propagateClear] | Boolean | Propagate this clear up to any parent `QueryInterface`s. Defaults to false


###  Return
`QueryInterface`: self



<a name="clearHandlers"></a>
## $clearHandlers([options]) -> QueryInterface

Clears any handles <br>**Alias** $handlersClear

###  Parameters

Name | Type | Description
--- | --- | ---
[options] | Object | Options used when returning the result
[options.propagateClear] | Boolean | Propagate this clear up to any parent `QueryInterface`s. Defaults to false


###  Return
`QueryInterface`: self



<a name="clearResults"></a>
## $clearResults([options]) -> QueryInterface

Clears any reesults (both handlers and queued results) <br>**Alias** $handlersClear

###  Parameters

Name | Type | Description
--- | --- | ---
[options] | Object | Options used when returning the result
[options.propagateClear] | Boolean | Propagate this clear up to any parent `QueryInterface`s. Defaults to false


###  Return
`QueryInterface`: self



<a name="query"></a>
## $query([options]) -> Promise

This is the mock method for getting results from the `QueryInterface`. This function
will get the next result in the queue and return that wrapped in a promise.

###  Parameters

Name | Type | Description
--- | --- | ---
[options] | Object | Options used for this query
[options.fallbackFn] | Function | A fallback function to run if there are no results queued
[options.includeCreated] | Boolean | Flag indicating if a `created` value should be returned with the result for this query. Defaults to false
[options.includeAffectedRows] | Boolean | Flag indicating if the query expects `affectedRows` in the returned result parameters. Defautls to false
[options.stopPropagation] | Boolean | Flag indicating if result queue propagation should be stopped on this query. Defaults to false
[options.query] | String | Name of the original query: "findOne", "findOrCreate", "upsert", etc.
[options.queryOptions] | Object | Array with the arguments passed to the original query method


###  Return
`Promise`: resolved or rejected promise from the next item in the review queue

