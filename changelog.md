# Changelog

v0.9.0 - Jul 28th 2017
  * Add DataType mock objects for use with any DataType funcitonality
  * Add support for conditional query result handling (thanks to @scinos)
  * Add support for `instance.get({ plain: true })` (thanks to @fredstrange)
  * Add support for `sequelize.model` and `sequelize.isDefined` (thanks to @Thylossus)
  * Fix setting `isNewRecord` on instances to false after saving (issue #19; thanks to @scinos)

v0.8.1 - c2527de - May 22nd 2017
  * Fix creating Associations throws an error (issue #10)

v0.8.0 - 60397ec - May 18th 2017
  * Add `$queueResult()`, `$queueFailure()`, and `$clearQueue()` test methods to `Sequelize` and `Model` objects
  * Add `QueryInterface` object to support test result mocking
  * Add `getQueryInterface()` to Sequelize instances which will get the associated `QueryInterface` object
  * Add getters/setters for accessing Instance data values via using the simple object syntax (e.g. `instance.foo = 'bar'`)
  * Add support for `hasPrimary` and `timestamps` options on Models
  * Add `instance.Model` reference to the calling `Model` object that the instance is based on
  * Change `Model.Instance` can now be directly used to create a mock `Instance` object of the given model
  * BREAKING The `query()` method for Sequelize instances will now throw instead of returning a rejected `Promise` by default. See the `$queueResult` or `$queueFailure` methods for getting proper returns from calls to this function
  * BREAKING The `Instance` object should now only be instantiated by going through a Model using either `model.build()` or `Model.Instance`
  * *DEV* Added HTML code coverage report to default `npm test` run

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
