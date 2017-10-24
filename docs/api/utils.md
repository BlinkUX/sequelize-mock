# Utils

Interface for some of the Sequelize Utilities exposed in the `Sequelize.Utils` object.



<a name="uppercaseFirst"></a>
## uppercaseFirst(str) -> String

Uppercase the first character in a string. Matches Sequelize functionality.

###  Parameters

Name | Type | Description
--- | --- | ---
str | String | String to uppercase the first character of


###  Return
`String`: modified string



<a name="lowercaseFirst"></a>
## lowercaseFirst(str) -> String

Lowercase the first character in a string. Matches Sequelize functionality.

###  Parameters

Name | Type | Description
--- | --- | ---
str | String | String to uppercase the first character of


###  Return
`String`: modified string



<a name="singularize"></a>
## singularize(str) -> String

Returns the "singular" version of a word. As with Sequelize, this uses the [inflection
library](https://github.com/dreamerslab/node.inflection) to accomplish this.

###  Parameters

Name | Type | Description
--- | --- | ---
str | String | Word to convert to its singular form


###  Return
`String`: singular version of the given word



<a name="pluralize"></a>
## pluralize(str) -> String

Returns the "plural" version of a word. As with Sequelize, this uses the [inflection
library](https://github.com/dreamerslab/node.inflection) to accomplish this.

###  Parameters

Name | Type | Description
--- | --- | ---
str | String | Word to convert to its plural form


###  Return
`String`: plural version of the given word



<a name="stack"></a>
## stack()

Gets the current stack frame



<a name="lodash"></a>
## lodash

Exposed version of the lodash library <br>**Alias** _

