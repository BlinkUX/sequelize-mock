# Querying Mock Objects

Sequelize Mock utilizes a special `QueryInterface` to be utilized for testing. This interface is provided and attached to give you full control over how results for queries may be returned and allows you to tweak the particulars of returned results as you need for your testing.

When you call into a function that would run a DB query in standard Sequelize, this function instead calls into our special test `QueryInterface` object to get the results for the query. Query results can be either manually queued up based on what your code may expect next, or automatically filled in from the `Model`'s defined default values.

Each query will return the first availble result from the list.

  1. The next result queued for the object the query is being run on
  2. If not available, it will return the next result queued for any parent object. For Models, this is the `Sequelize` object the Model was defined with (using `db.define`)
  3. If not available and being called on a `Model`, it will return an automatically generated result based on the defaults of the `Model` being queried, *unless configured otherwise*
  4. Any fallback function defined in the configuration for the object

If none of the above resolve to a returnable result, a `EmptyQueryQueueError` excepction will be thrown.

## Configuration

There are a few available configuration options that can be used to modify how query results are resolved.

### Sequelize Configuration

When declaring a new `SequelizeMock` object, configuration can be passed in the `options` parameter.

Option | Type | Description
--- | --- | ---
`autoQueryFallback` | Boolean | Flag indicating if defined `Model` objects should fallback to the automatic query result generation functionality. Defaults to true. Can be overridden by `Model` configuration
`stopPropagation` | Boolean | Whether `Model`'s defined on this should propagate queries up to this object if they are not resolved by the `Model` themselves. Defaults to false. Can be overridden by `Model` configuration

### Model Configuration

When declaring a new `Model`, configuration can be passed in through the `options` parameter.

Option | Type | Description
--- | --- | ---
`autoQueryFallback` | Boolean | Flag indicating if `Model` should fallback to the automatic query result generation functionality. Defaults to true unless inherited from `SequelizeMock` object
`stopPropagation` | Boolean | Whether queries should attempt to propagate up to the defining `SequelizeMock` if they are not resolved by the `Model` themselves. Defaults to false unless inherited from `SequelizeMock` object

## Queued Results

Query results can be queued against an object to be returned upon the triggering of a query based function. Results will be returned in the order they are added to the queue and can contain any values or objects.

```javascript
User.$queueResult( User.build({ id: 1337 }) );

User.findOne().then(function (user) {
	user.get('id'); // === 1337
});
```

Results are returned without modification so this functionality can be used to return multiple rows for a single query.

```javascript
// You can also return multiple rows for a single query this way
User.$queueResult( [User.build(), User.build(), /* ... */] );

User.findAll().then(function (users) {
	users.length; // === length of the array above
});
```

Some functions require additional parameters or configuration. You can specify behavior by passing in the `options` parameter when queueing the results. These values will only be passed along when the function requires more than one value in the return, and will otherwise be ignored.

```javascript
User.$queueResult( User.build(), { wasCreated: true } );

User.findOrCreate().spread(function (user, wasCreated) {
	wasCreated; // === true
});
```

#### Testing Errors

You can also use this method to test for errors from the server. If the next queued item is a failure result, the query promise will be rejected with the given `Error`.

```javascript
User.$queueFailure( 'My test error' );

User.findOne().catch(function (err) {
	err.message; // === 'My test error'
});
```

By default, if the objects passed in are not `Error` objects, they are converted to `Sequelize.Error` objects. You can disable this functionality if you need by passing in the option `{ convertNonErrors: false }`.

### Recommendations

At the end of each test, it is highly recommended you clear the queue of pending query results. This will help limit the number of false failures in your test results due to left over query results.

```javascript
afterEach(function () {
	User.$clearQueue();
})
```

## Automated Results

Automated results are generated based on a combination of the default values specified when declaring your mock `Model`s, any auto-generated values like `id` or `createdAt`, and the query being run. For example, for a `findOne()` query, it will use the `where` properties to build a new object to return to you.

```javascript
User.findOne({
	where: {
		name: 'Marty McFly'
	},
}).then(function (user) {
	user.get('id'); // === Auto-generated ID
	user.get('name'); // === 'Marty McFly'
});
```
