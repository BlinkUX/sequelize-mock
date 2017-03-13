# Errors

Error objects are exposed via the base SequelizeMock object and can be used in much the same
way that native Sequelize errors can be used. Because no queries are run, any errors that
would normally contain a `sql` property include it with a value indicating this is test code

*NOTE:* Error names are copied exactly from Sequelize in the off-chance code is relying on
error name instead of equality or instanceof



<a name="BaseError"></a>
## new BaseError()

BaseError is the base class most other Sequelize Mock Error classes inherit from
Mostly based off of [the Sequelize.js equivalent code](https://github.com/sequelize/sequelize/blob/3e5b8772ef75169685fc96024366bca9958fee63/lib/errors.js#L20) <br>**Extends** Error <br>**Alias** Error



<a name="ValidationError"></a>
## new ValidationError(msg, [errors])

ValidationError is the class used for validation errors returned by Sequelize Mock.
The most common way you will see this error is using the `$addValidationError` test
helper method on instances.

ValidationErrors contain an `errors` property which contains a list of the specific
validation errors that were encountered. For example, if two validation errors were
encountered, it will be an array of length two. Objects in this array are of type
`ValidationErrorItem`. <br>**Extends** [BaseError](#BaseError)

**See**

 - [ValidationErrorItem](#ValidationErrorItem)

###  Parameters

Name | Type | Description
--- | --- | ---
msg | String | Error Message
[errors] | Array.&#60;ValidationErrorItem&#62; | Error Message




<a name="errors"></a>
### .errors

Array of all validation errors that were encountered with
this validation



<a name="get"></a>
### #get(path) -> Array.&#60;ValidationErrorItem&#62;

Get the validation error for a particular field

####  Parameters

Name | Type | Description
--- | --- | ---
path | String | Field you would like the list of validation errors for


####  Return
`Array.<ValidationErrorItem>`: Array of validation errors for the given field



<a name="ValidationErrorItem"></a>
## new ValidationErrorItem(msg, type, path, value)

A specific validation failure result

**See**

 - ValidationError

###  Parameters

Name | Type | Description
--- | --- | ---
msg | String | Error Message
type | String | Type of the error
path | String | Field with the error
value | String | Value with the error




<a name="DatabaseError"></a>
## new DatabaseError(parentError)

The generic base Database Error class <br>**Extends** [BaseError](#BaseError)

###  Parameters

Name | Type | Description
--- | --- | ---
parentError | Error | Original error that triggered this error




<a name="sql"></a>
### .sql

Ordinarily contains the SQL that triggered the error.
However, because test code does not go to the DB and
therefore does not have SQL, this will contain an SQL
comment stating it is from Sequelize Mock.



<a name="TimeoutError"></a>
## new TimeoutError()

Database timeout error <br>**Extends** [DatabaseError](#DatabaseError)



<a name="UniqueConstraintError"></a>
## new UniqueConstraintError(opts)

Unique constraint violation error <br>**Extends** [ValidationError](#ValidationError), [DatabaseError](#DatabaseError)

###  Parameters

Name | Type | Description
--- | --- | ---
opts | Object | Unique constraint error information
opts.message | String | Error message
[opts.errors] | Array.&#60;ValidationErrorItem&#62; | Errors that were encountered
[opts.fields] | Array.&#60;String&#62; | Fields that violated the unique constraint




<a name="ForeignKeyConstraintError"></a>
## new ForeignKeyConstraintError(opts)

Foreign key constraint violation error <br>**Extends** [BaseError](#BaseError), [DatabaseError](#DatabaseError)

###  Parameters

Name | Type | Description
--- | --- | ---
opts | Object | Unique constraint error information
opts.message | String | Error message
[opts.fields] | Array.&#60;String&#62; | Fields that violated the unique constraint
opts.table | String | Name of the table the failure is for
opts.value | String | Invalid value
opts.index | String | Name of the foreign key index that was violated




<a name="ExclusionConstraintError"></a>
## new ExclusionConstraintError(opts)

Exclusion constraint violation error <br>**Extends** [BaseError](#BaseError), [DatabaseError](#DatabaseError)

###  Parameters

Name | Type | Description
--- | --- | ---
opts | Object | Unique constraint error information
opts.message | String | Error message
[opts.fields] | Array.&#60;String&#62; | Fields that violated the unique constraint
opts.table | String | Name of the table the failure is for
opts.constraint | String | Name of the constraint that was violated




<a name="ConnectionError"></a>
## new ConnectionError(parentError)

Generic database connection error <br>**Extends** [BaseError](#BaseError)

###  Parameters

Name | Type | Description
--- | --- | ---
parentError | Error | Original error that triggered this error




<a name="ConnectionRefusedError"></a>
## new ConnectionRefusedError(parentError)

Database connection refused error <br>**Extends** [ConnectionError](#ConnectionError)

###  Parameters

Name | Type | Description
--- | --- | ---
parentError | Error | Original error that triggered this error




<a name="AccessDeniedError"></a>
## new AccessDeniedError(parentError)

Database access denied connection error <br>**Extends** [ConnectionError](#ConnectionError)

###  Parameters

Name | Type | Description
--- | --- | ---
parentError | Error | Original error that triggered this error




<a name="HostNotFoundError"></a>
## new HostNotFoundError(parentError)

Database host not found connection error <br>**Extends** [ConnectionError](#ConnectionError)

###  Parameters

Name | Type | Description
--- | --- | ---
parentError | Error | Original error that triggered this error




<a name="HostNotReachableError"></a>
## new HostNotReachableError(parentError)

Database host not reachable connection error <br>**Extends** [ConnectionError](#ConnectionError)

###  Parameters

Name | Type | Description
--- | --- | ---
parentError | Error | Original error that triggered this error




<a name="InvalidConnectionError"></a>
## new InvalidConnectionError(parentError)

Database invalid connection error <br>**Extends** [ConnectionError](#ConnectionError)

###  Parameters

Name | Type | Description
--- | --- | ---
parentError | Error | Original error that triggered this error




<a name="ConnectionTimedOutError"></a>
## new ConnectionTimedOutError(parentError)

Database connection timed out error <br>**Extends** [ConnectionError](#ConnectionError)

###  Parameters

Name | Type | Description
--- | --- | ---
parentError | Error | Original error that triggered this error




<a name="InstanceError"></a>
## new InstanceError(message)

Error from a Sequelize (Mock) Instance <br>**Extends** [BaseError](#BaseError)

###  Parameters

Name | Type | Description
--- | --- | ---
message | Error | Error message


