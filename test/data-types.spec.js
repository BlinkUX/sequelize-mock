'use strict';

var should = require('should');
var proxyquire = require('proxyquire').noCallThru();

var DataTypes = proxyquire('../src/data-types', {
	// No require's we need to override
});

describe('Data Types', function () {
	
	var MockObj;
	
	beforeEach(function () {
		MockObj = {};
		DataTypes(MockObj);
	});
	
	
	describe('.STRING', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('STRING');
			MockObj.STRING.key.should.equal('STRING');
			var verify = new MockObj.STRING();
			verify.toSql().should.equal('STRING');
			verify.should.have.property('BINARY').which.is.equal(MockObj.STRING);
		});
		
		it('should cast to a STRING if called without new', function () {
			var verify = MockObj.STRING();
			verify.should.be.instanceof(MockObj.STRING);
		});
		
		it('should record length and binary options', function () {
			var verify = new MockObj.STRING(123, true);
			verify.options.length.should.equal(123);
			verify.options.binary.should.equal(true);
		});
		
		it('should accept options as object instead of arguments', function () {
			var verify = new MockObj.STRING({ length: 123, binary: true });
			verify.options.length.should.equal(123);
			verify.options.binary.should.equal(true);
		});
		
	});
	
	describe('.CHAR', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('CHAR');
			MockObj.CHAR.key.should.equal('CHAR');
			var ch = new MockObj.CHAR();
			ch.toSql().should.equal('CHAR');
			ch.should.have.property('BINARY').which.is.equal(MockObj.STRING);
		});
		
		it('should cast to a CHAR if called without new', function () {
			var verify = MockObj.CHAR();
			verify.should.be.instanceof(MockObj.CHAR);
		});
		
		it('should record length and binary options', function () {
			var verify = new MockObj.CHAR(123, true);
			verify.options.length.should.equal(123);
			verify.options.binary.should.equal(true);
		});
		
		it('should accept options as object instead of arguments', function () {
			var verify = new MockObj.CHAR({ length: 123, binary: true });
			verify.options.length.should.equal(123);
			verify.options.binary.should.equal(true);
		});
		
	});
	
	describe('.TEXT', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('TEXT');
			MockObj.TEXT.key.should.equal('TEXT');
			var verify = new MockObj.TEXT();
			verify.toSql().should.equal('TEXT');
		});
		
		it('should cast to a TEXT if called without new', function () {
			var verify = MockObj.TEXT();
			verify.should.be.instanceof(MockObj.TEXT);
		});
		
		it('should record length option', function () {
			var verify = new MockObj.TEXT('tiny');
			verify.options.length.should.equal('tiny');
			verify.key.should.equal('TINYTEXT');
		});
		
		it('should accept options as object instead of arguments', function () {
			var verify = new MockObj.TEXT({ length: 'large' });
			verify.options.length.should.equal('large');
			verify.key.should.equal('LARGETEXT');
		});
		
	});
	
	describe('.INTEGER', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('INTEGER');
			MockObj.INTEGER.key.should.equal('INTEGER');
			var verify = new MockObj.INTEGER();
			verify.toSql().should.equal('INTEGER');
			verify.should.have.property('UNSIGNED');
			verify.should.have.property('ZEROFILL');
		});
		
		it('should cast to a INTEGER if called without new', function () {
			var verify = MockObj.INTEGER();
			verify.should.be.instanceof(MockObj.INTEGER);
		});
		
		it('should record length option', function () {
			var verify = new MockObj.INTEGER(123);
			verify.options.length.should.equal(123);
		});
		
		it('should accept options as object instead of arguments', function () {
			var verify = new MockObj.INTEGER({ length: 123 });
			verify.options.length.should.equal(123);
		});
		
		it('should return string NaN for stringify function', function () {
			var verify = new MockObj.INTEGER();
			verify.stringify(NaN).should.equal("'NaN'");
		});
		
		it('should return string Infinity for stringify function', function () {
			var verify = new MockObj.INTEGER();
			verify.stringify(Infinity).should.equal("'Infinity'");
			verify.stringify(-Infinity).should.equal("'-Infinity'");
		});
		
		it('should return stringified number for stringify function', function () {
			var verify = new MockObj.INTEGER();
			verify.stringify(123).should.be.exactly("123");
		});
		
	});
	
	describe('.BIGINT', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('BIGINT');
			MockObj.BIGINT.key.should.equal('BIGINT');
			var verify = new MockObj.BIGINT();
			verify.toSql().should.equal('BIGINT');
			verify.should.have.property('UNSIGNED');
			verify.should.have.property('ZEROFILL');
		});
		
		it('should cast to a BIGINT if called without new', function () {
			var verify = MockObj.BIGINT();
			verify.should.be.instanceof(MockObj.BIGINT);
		});
		
		it('should record length option', function () {
			var verify = new MockObj.BIGINT(123);
			verify.options.length.should.equal(123);
		});
		
		it('should accept options as object instead of arguments', function () {
			var verify = new MockObj.BIGINT({ length: 123 });
			verify.options.length.should.equal(123);
		});
		
		it('should return string NaN for stringify function', function () {
			var verify = new MockObj.BIGINT();
			verify.stringify(NaN).should.equal("'NaN'");
		});
		
		it('should return string Infinity for stringify function', function () {
			var verify = new MockObj.BIGINT();
			verify.stringify(Infinity).should.equal("'Infinity'");
			verify.stringify(-Infinity).should.equal("'-Infinity'");
		});
		
		it('should return stringified number for stringify function', function () {
			var verify = new MockObj.BIGINT();
			verify.stringify(123).should.be.exactly("123");
		});
		
	});
	
	describe('.FLOAT', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('FLOAT');
			MockObj.FLOAT.key.should.equal('FLOAT');
			var verify = new MockObj.FLOAT();
			verify.toSql().should.equal('FLOAT');
			verify.should.have.property('UNSIGNED');
			verify.should.have.property('ZEROFILL');
		});
		
		it('should cast to a FLOAT if called without new', function () {
			var verify = MockObj.FLOAT();
			verify.should.be.instanceof(MockObj.FLOAT);
		});
		
		it('should record length and decimals option', function () {
			var verify = new MockObj.FLOAT(123, 4);
			verify.options.length.should.equal(123);
			verify.options.decimals.should.equal(4);
		});
		
		it('should accept options as object instead of arguments', function () {
			var verify = new MockObj.FLOAT({ length: 123, decimals: 4 });
			verify.options.length.should.equal(123);
			verify.options.decimals.should.equal(4);
		});
		
		it('should return string NaN for stringify function', function () {
			var verify = new MockObj.FLOAT();
			verify.stringify(NaN).should.equal("'NaN'");
		});
		
		it('should return string Infinity for stringify function', function () {
			var verify = new MockObj.FLOAT();
			verify.stringify(Infinity).should.equal("'Infinity'");
			verify.stringify(-Infinity).should.equal("'-Infinity'");
		});
		
		it('should return stringified number for stringify function', function () {
			var verify = new MockObj.FLOAT();
			verify.stringify(1.23).should.be.exactly("1.23");
		});
		
	});
	
	describe('.REAL', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('REAL');
			MockObj.REAL.key.should.equal('REAL');
			var verify = new MockObj.REAL();
			verify.toSql().should.equal('REAL');
			verify.should.have.property('UNSIGNED');
			verify.should.have.property('ZEROFILL');
		});
		
		it('should cast to a REAL if called without new', function () {
			var verify = MockObj.REAL();
			verify.should.be.instanceof(MockObj.REAL);
		});
		
		it('should record length and decimals option', function () {
			var verify = new MockObj.REAL(123, 4);
			verify.options.length.should.equal(123);
			verify.options.decimals.should.equal(4);
		});
		
		it('should accept options as object instead of arguments', function () {
			var verify = new MockObj.REAL({ length: 123, decimals: 4 });
			verify.options.length.should.equal(123);
			verify.options.decimals.should.equal(4);
		});
		
		it('should return string NaN for stringify function', function () {
			var verify = new MockObj.REAL();
			verify.stringify(NaN).should.equal("'NaN'");
		});
		
		it('should return string Infinity for stringify function', function () {
			var verify = new MockObj.REAL();
			verify.stringify(Infinity).should.equal("'Infinity'");
			verify.stringify(-Infinity).should.equal("'-Infinity'");
		});
		
		it('should return stringified number for stringify function', function () {
			var verify = new MockObj.REAL();
			verify.stringify(1.23).should.be.exactly("1.23");
		});
		
	});
	
	describe('.DOUBLE', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('DOUBLE');
			MockObj.DOUBLE.key.should.equal('DOUBLE PRECISION');
			var verify = new MockObj.DOUBLE();
			verify.toSql().should.equal('DOUBLE PRECISION');
			verify.should.have.property('UNSIGNED');
			verify.should.have.property('ZEROFILL');
		});
		
		it('should cast to a DOUBLE if called without new', function () {
			var verify = MockObj.DOUBLE();
			verify.should.be.instanceof(MockObj.DOUBLE);
		});
		
		it('should record length and decimals option', function () {
			var verify = new MockObj.DOUBLE(123, 4);
			verify.options.length.should.equal(123);
			verify.options.decimals.should.equal(4);
		});
		
		it('should accept options as object instead of arguments', function () {
			var verify = new MockObj.DOUBLE({ length: 123, decimals: 4 });
			verify.options.length.should.equal(123);
			verify.options.decimals.should.equal(4);
		});
		
		it('should return string NaN for stringify function', function () {
			var verify = new MockObj.DOUBLE();
			verify.stringify(NaN).should.equal("'NaN'");
		});
		
		it('should return string Infinity for stringify function', function () {
			var verify = new MockObj.DOUBLE();
			verify.stringify(Infinity).should.equal("'Infinity'");
			verify.stringify(-Infinity).should.equal("'-Infinity'");
		});
		
		it('should return stringified number for stringify function', function () {
			var verify = new MockObj.DOUBLE();
			verify.stringify(1.23).should.be.exactly("1.23");
		});
		
	});
	
	describe('.DECIMAL', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('DECIMAL');
			MockObj.DECIMAL.key.should.equal('DECIMAL');
			var verify = new MockObj.DECIMAL();
			verify.toSql().should.equal('DECIMAL');
			verify.should.have.property('UNSIGNED');
			verify.should.have.property('ZEROFILL');
		});
		
		it('should cast to a DECIMAL if called without new', function () {
			var verify = MockObj.DECIMAL();
			verify.should.be.instanceof(MockObj.DECIMAL);
		});
		
		it('should record precision and scale option', function () {
			var verify = new MockObj.DECIMAL(123, 4);
			verify.options.precision.should.equal(123);
			verify.options.scale.should.equal(4);
		});
		
		it('should accept options as object instead of arguments', function () {
			var verify = new MockObj.DECIMAL({ precision: 123, scale: 4 });
			verify.options.precision.should.equal(123);
			verify.options.scale.should.equal(4);
		});
		
		it('should return string NaN for stringify function', function () {
			var verify = new MockObj.DECIMAL();
			verify.stringify(NaN).should.equal("'NaN'");
		});
		
		it('should return string Infinity for stringify function', function () {
			var verify = new MockObj.DECIMAL();
			verify.stringify(Infinity).should.equal("'Infinity'");
			verify.stringify(-Infinity).should.equal("'-Infinity'");
		});
		
		it('should return stringified number for stringify function', function () {
			var verify = new MockObj.DECIMAL();
			verify.stringify(1.23).should.be.exactly("1.23");
		});
		
	});
	
	describe('.BOOLEAN', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('BOOLEAN');
			MockObj.BOOLEAN.key.should.equal('BOOLEAN');
			var verify = new MockObj.BOOLEAN();
			verify.toSql().should.equal('BOOLEAN');
		});
		
		it('should cast to a BOOLEAN if called without new', function () {
			var verify = MockObj.BOOLEAN();
			verify.should.be.instanceof(MockObj.BOOLEAN);
		});
		
	});
	
	describe('.TIME', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('TIME');
			MockObj.TIME.key.should.equal('TIME');
			var verify = new MockObj.TIME();
			verify.toSql().should.equal('TIME');
		});
		
		it('should cast to a TIME if called without new', function () {
			var verify = MockObj.TIME();
			verify.should.be.instanceof(MockObj.TIME);
		});
		
	});
	
	describe('.DATE', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('DATE');
			MockObj.DATE.key.should.equal('DATE');
			var verify = new MockObj.DATE();
			verify.toSql().should.equal('DATE');
		});
		
		it('should cast to a DATE if called without new', function () {
			var verify = MockObj.DATE();
			verify.should.be.instanceof(MockObj.DATE);
		});
		
		it('should record length option', function () {
			var verify = new MockObj.DATE(123, true);
			verify.options.length.should.equal(123);
		});
		
		it('should accept options as object instead of arguments', function () {
			var verify = new MockObj.DATE({ length: 123 });
			verify.options.length.should.equal(123);
		});
		
		it('should return stringified date for stringify function', function () {
			var verify = new MockObj.DATE();
			var date = new Date();
			date.setFullYear(2001);
			date.setMonth(0);
			date.setDate(1);
			date.setHours(1);
			date.setMinutes(1);
			date.setSeconds(1);
			date.setMilliseconds(1);
			verify.stringify(date).should.be.exactly('2001-01-01 01:01:01.001 Z');
		});
		
	});
	
	describe('.DATEONLY', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('DATEONLY');
			MockObj.DATEONLY.key.should.equal('DATEONLY');
			var verify = new MockObj.DATEONLY();
			verify.toSql().should.equal('DATEONLY');
		});
		
		it('should cast to a DATEONLY if called without new', function () {
			var verify = MockObj.DATEONLY();
			verify.should.be.instanceof(MockObj.DATEONLY);
		});
		
	});
	
	describe('.HSTORE', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('HSTORE');
			MockObj.HSTORE.key.should.equal('HSTORE');
			var verify = new MockObj.HSTORE();
			verify.toSql().should.equal('HSTORE');
		});
		
		it('should cast to a HSTORE if called without new', function () {
			var verify = MockObj.HSTORE();
			verify.should.be.instanceof(MockObj.HSTORE);
		});
		
	});
	
	describe('.JSON', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('JSON');
			MockObj.JSON.key.should.equal('JSON');
			var verify = new MockObj.JSON();
			verify.toSql().should.equal('JSON');
		});
		
		it('should cast to a JSON if called without new', function () {
			var verify = MockObj.JSON();
			verify.should.be.instanceof(MockObj.JSON);
		});
		
		it('should return stringified json for stringify function', function () {
			var verify = new MockObj.JSON();
			verify.stringify({'foo':'bar'}).should.be.exactly('{"foo":"bar"}');
		});
		
	});
	
	describe('.JSONB', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('JSONB');
			MockObj.JSONB.key.should.equal('JSONB');
			var verify = new MockObj.JSONB();
			verify.toSql().should.equal('JSONB');
		});
		
		it('should cast to a JSONB if called without new', function () {
			var verify = MockObj.JSONB();
			verify.should.be.instanceof(MockObj.JSONB);
		});
		
		it('should return stringified json for stringify function', function () {
			var verify = new MockObj.JSONB();
			verify.stringify({'foo':'bar'}).should.be.exactly('{"foo":"bar"}');
		});
		
	});
	
	describe('.NOW', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('NOW');
			MockObj.NOW.key.should.equal('NOW');
			var verify = new MockObj.NOW();
			verify.toSql().should.equal('NOW');
		});
		
		it('should cast to a NOW if called without new', function () {
			var verify = MockObj.NOW();
			verify.should.be.instanceof(MockObj.NOW);
		});
		
	});
	
	describe('.BLOB', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('BLOB');
			MockObj.BLOB.key.should.equal('BLOB');
			var verify = new MockObj.BLOB();
			verify.toSql().should.equal('BLOB');
		});
		
		it('should cast to a BLOB if called without new', function () {
			var verify = MockObj.BLOB();
			verify.should.be.instanceof(MockObj.BLOB);
		});
		
		it('should record length option', function () {
			var verify = new MockObj.BLOB(123);
			verify.options.length.should.equal(123);
		});
		
		it('should accept options as object instead of arguments', function () {
			var verify = new MockObj.BLOB({ length: 123 });
			verify.options.length.should.equal(123);
		});
		
		it('should return stringified buffer for stringify function', function () {
			var verify = new MockObj.BLOB();
			verify.stringify(new Buffer('abc')).should.be.exactly('616263');
		});
		
	});
	
	describe('.RANGE', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('RANGE');
			MockObj.RANGE.key.should.equal('RANGE');
			var verify = new MockObj.RANGE();
			verify.toSql().should.equal('RANGE');
		});
		
		it('should cast to a RANGE if called without new', function () {
			var verify = MockObj.RANGE();
			verify.should.be.instanceof(MockObj.RANGE);
		});
		
		it('should default to INTEGER subtype option', function () {
			var verify = new MockObj.RANGE();
			verify.options.subtype.should.be.instanceof(MockObj.INTEGER);
		});
		
		it('should record subtype option', function () {
			var verify = new MockObj.RANGE(MockObj.STRING);
			verify.options.subtype.should.be.instanceof(MockObj.STRING);
		});
		
		it('should accept options as object instead of arguments', function () {
			var obj = {};
			var verify = new MockObj.RANGE({ subtype: obj });
			verify.options.subtype.should.equal(obj);
		});
		
	});
	
	describe('.UUID', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('UUID');
			MockObj.UUID.key.should.equal('UUID');
			var verify = new MockObj.UUID();
			verify.toSql().should.equal('UUID');
		});
		
		it('should cast to a UUID if called without new', function () {
			var verify = MockObj.UUID();
			verify.should.be.instanceof(MockObj.UUID);
		});
		
	});
	
	describe('.UUIDV1', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('UUIDV1');
			MockObj.UUIDV1.key.should.equal('UUIDV1');
			var verify = new MockObj.UUIDV1();
			verify.toSql().should.equal('UUIDV1');
		});
		
		it('should cast to a UUIDV1 if called without new', function () {
			var verify = MockObj.UUIDV1();
			verify.should.be.instanceof(MockObj.UUIDV1);
		});
		
	});
	
	describe('.UUIDV4', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('UUIDV4');
			MockObj.UUIDV4.key.should.equal('UUIDV4');
			var verify = new MockObj.UUIDV4();
			verify.toSql().should.equal('UUIDV4');
		});
		
		it('should cast to a UUIDV4 if called without new', function () {
			var verify = MockObj.UUIDV4();
			verify.should.be.instanceof(MockObj.UUIDV4);
		});
		
	});
	
	describe('.VIRTUAL', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('VIRTUAL');
			MockObj.VIRTUAL.key.should.equal('VIRTUAL');
			var verify = new MockObj.VIRTUAL();
			verify.toSql().should.equal('VIRTUAL');
		});
		
		it('should cast to a VIRTUAL if called without new', function () {
			var verify = MockObj.VIRTUAL();
			verify.should.be.instanceof(MockObj.VIRTUAL);
		});
		
		it('should default to INTEGER subtype option', function () {
			var verify = new MockObj.VIRTUAL();
			verify.returnType.should.be.instanceof(MockObj.INTEGER);
		});
		
		it('should record subtype and field options', function () {
			var fields = ['foo'];
			var verify = new MockObj.VIRTUAL(MockObj.STRING, fields);
			verify.returnType.should.be.instanceof(MockObj.STRING);
			verify.fields.should.equal(fields);
		});
		
	});
	
	describe('.ENUM', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('ENUM');
			MockObj.ENUM.key.should.equal('ENUM');
			var verify = new MockObj.ENUM();
			verify.toSql().should.equal('ENUM');
		});
		
		it('should cast to a ENUM if called without new', function () {
			var verify = MockObj.ENUM();
			verify.should.be.instanceof(MockObj.ENUM);
		});
		
		it('should record values option as an array', function () {
			var values = ['foo', 'bar'];
			var verify = new MockObj.ENUM(values);
			verify.options.values.should.equal(values);
			verify.values.should.equal(values);
		});
		
		it('should record values option as an options object', function () {
			var values = ['foo', 'bar'];
			var verify = new MockObj.ENUM({ values: values });
			verify.options.values.should.equal(values);
			verify.values.should.equal(values);
		});
		
		it('should record values option as arguments passed in', function () {
			var values = ['foo', 'bar'];
			var verify = new MockObj.ENUM('foo', 'bar');
			verify.options.values.length.should.equal(2);
			verify.options.values[0].should.equal('foo');
			verify.options.values[1].should.equal('bar');
			verify.values.should.equal(verify.options.values);
		});
		
	});
	
	describe('.ARRAY', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('ARRAY');
			MockObj.ARRAY.key.should.equal('ARRAY');
			var verify = new MockObj.ARRAY();
			verify.toSql().should.equal('ARRAY');
		});
		
		it('should cast to a ARRAY if called without new', function () {
			var verify = MockObj.ARRAY();
			verify.should.be.instanceof(MockObj.ARRAY);
		});
		
		it('should record type option', function () {
			var verify = new MockObj.ARRAY(MockObj.STRING);
			verify.options.type.should.equal(MockObj.STRING);
			verify.type.should.be.instanceof(MockObj.STRING);
		});
		
		it('should accept options as object instead of arguments', function () {
			var verify = new MockObj.ARRAY({ type: MockObj.STRING });
			verify.options.type.should.equal(MockObj.STRING);
			verify.type.should.be.instanceof(MockObj.STRING);
		});
		
		describe('.is', function () {
			
			it('should validate that an array is of a type', function () {
				var verify = new MockObj.ARRAY(MockObj.STRING);
				MockObj.ARRAY.is(verify, MockObj.STRING).should.be.true();
			});
			
			it('should validate that an array is of a type', function () {
				var verify = new MockObj.ARRAY(MockObj.INTEGER);
				MockObj.ARRAY.is(verify, MockObj.STRING).should.be.false();
			});
			
		});
		
	});
	
	describe('.GEOMETRY', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('GEOMETRY');
			MockObj.GEOMETRY.key.should.equal('GEOMETRY');
			var verify = new MockObj.GEOMETRY();
			verify.toSql().should.equal('GEOMETRY');
		});
		
		it('should cast to a GEOMETRY if called without new', function () {
			var verify = MockObj.GEOMETRY();
			verify.should.be.instanceof(MockObj.GEOMETRY);
		});
		
		it('should record type and srid options', function () {
			var verify = new MockObj.GEOMETRY(MockObj.STRING, 123);
			verify.options.type.should.equal(MockObj.STRING);
			verify.type.should.equal(MockObj.STRING);
			verify.options.srid.should.equal(123);
			verify.srid.should.equal(123);
		});
		
		it('should accept options as object instead of arguments', function () {
			var verify = new MockObj.GEOMETRY({ type: MockObj.STRING, srid: 123 });
			verify.options.type.should.equal(MockObj.STRING);
			verify.type.should.equal(MockObj.STRING);
			verify.options.srid.should.equal(123);
			verify.srid.should.equal(123);
		});
		
	});
	
	describe('.GEOGRAPHY', function () {
		
		it('should expose the property', function () {
			MockObj.should.have.property('GEOGRAPHY');
			MockObj.GEOGRAPHY.key.should.equal('GEOGRAPHY');
			var verify = new MockObj.GEOGRAPHY();
			verify.toSql().should.equal('GEOGRAPHY');
		});
		
		it('should cast to a GEOGRAPHY if called without new', function () {
			var verify = MockObj.GEOGRAPHY();
			verify.should.be.instanceof(MockObj.GEOGRAPHY);
		});
		
		it('should record type and srid options', function () {
			var verify = new MockObj.GEOGRAPHY(MockObj.STRING, 123);
			verify.options.type.should.equal(MockObj.STRING);
			verify.type.should.equal(MockObj.STRING);
			verify.options.srid.should.equal(123);
			verify.srid.should.equal(123);
		});
		
		it('should accept options as object instead of arguments', function () {
			var verify = new MockObj.GEOGRAPHY({ type: MockObj.STRING, srid: 123 });
			verify.options.type.should.equal(MockObj.STRING);
			verify.type.should.equal(MockObj.STRING);
			verify.options.srid.should.equal(123);
			verify.srid.should.equal(123);
		});
		
	});
	
});