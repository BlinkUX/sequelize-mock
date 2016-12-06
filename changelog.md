# Changelog

v0.6.0 - Dec 6th 2016
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
