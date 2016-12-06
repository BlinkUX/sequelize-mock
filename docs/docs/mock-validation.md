# Validation on Mock Objects

We *do not* include the complex validation provided by Sequelize for validating your object input. However, we do support testing against validation errors. There is a simple Mock Object specific interface for setting up any validation errors.

Queued validation errors will be returned any time `save()`, or `update()` are called on Instances, as well as from `create()` on Models. Any validation errors will be returned in a `ValidationError` object, and then the error list will be cleared for the next `validate()` call.

## Usage

To queue validation errors, call `$addValidationError(column[, message[, type]])` on an Instance and any queries to that instance that trigger validation will cause a validation error to be returned or thrown.

```javascript
var user = UserMock.build();

user.$addValidationError('username', 'Username is too short');

user.update({
	'username': 'abc',
}).catch(function (error) {
	// Validation error caught here
});
```

## Error object

The error object is a copy of the `ValidationError` object that would be [returned by Sequelize](http://docs.sequelizejs.com/en/latest/api/errors/#new-validationerrormessage-errors).

This will return 1 object with a sub array of `errors` that will include each of the errors above with the following format.

```javascript
{
	"message": "", // Message passed in to each validation error
	"type":    "", // Type passed in to each validation error
	"path":    "", // Column name that has the validation error
	"value":   ""  // Value of the column in that object
}
```
