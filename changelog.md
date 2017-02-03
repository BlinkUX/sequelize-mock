# Changelog

v0.7.0 - bcfb924 - Feb 3rd 2017
  * Add `Model.bulkCreate()` support
  * Add `Instance.set()` Object parameter support
  * Add `Instance.get()` no parameter support to get a cloned Object of all of the values
  * Add `Instance.destroy()` will now set a `deletedAt` property to the current date
  * Add `Sequelize.Utils._` which points to the lodash library
  * Add `options` parameter in the `Sequelize` constructor
  * Add `getDialect()` to Sequelize instances which will return the value from the `options` passed into the constructor
  * Add `Sequelize.Instance` which points to the mock Instance class
  * Change `Model.destroy()` will return the value of `options.limit` if that value exists and is a number
  * BREAKING Removed `Model.generateTestModel()`, `Model.generateModelPromise()`, and `Model.generateModelsPromises()`
  * *DEV* Added documentation generation via `npm run docs-gen`

v0.6.1 - d65cbc9 - Dec 7th 2016
  * Fix `Instance` initialization modifying the original passed in object

v0.6.0 - 4315930 - Dec 6th 2016
  * Add Sequelize Error object mocks
  * Add `validate()` function + calls in the appropriate places
  * Add `$addValidationError(col[, message[, type]])` to Instances which will trigger a validation error on the next call to `.validate()` from any of places it can be called
  * Add `$removeValidationError(col)` to Instances which will remove any validation errors for that column
  * Add `$clearValidationErrors()` to Instances which removes all validation errors from all of the columns

v0.5.1 - b9a34d2 - Nov 4th 2016
  * Add `Model.unscoped()`
  * Add `Model.insertOrUpdate()` as alias for `Model.upsert()`
  * Fix for `Sequelize.Utils.lowercaseFirst()`
  * Fix `Model.update()` affected rows return value to be array

v0.5.0 - 3d436f7 - Oct 7th 2016
  * Initial Public Release
