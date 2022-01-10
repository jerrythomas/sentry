import { parse } from '../src/cookie.js'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'

const CookieParserSuite = suite('Cookie Parser')

CookieParserSuite('argument validation', function () {
	assert.throws(parse.bind(), /argument str must be a string/)
	assert.throws(parse.bind(null, 42), /argument str must be a string/)
})

CookieParserSuite('basic', function () {
	assert.equal(parse('foo=bar'), { foo: 'bar' })
	assert.equal(parse('foo=123'), { foo: '123' })
})

CookieParserSuite('ignore spaces', function () {
	assert.equal(parse('FOO    = bar;   baz  =   raz'), {
		FOO: 'bar',
		baz: 'raz'
	})
})

CookieParserSuite('escaping', function () {
	assert.equal(parse('foo="bar=123456789&name=Magic+Mouse"'), {
		foo: 'bar=123456789&name=Magic+Mouse'
	})

	assert.equal(parse('email=%20%22%2c%3b%2f'), { email: ' ",;/' })
})

CookieParserSuite(
	'ignore escaping error and return original value',
	function () {
		assert.equal(parse('foo=%1;bar=bar'), { foo: '%1', bar: 'bar' })
	}
)

CookieParserSuite('ignore non values', function () {
	assert.equal(parse('foo=%1;bar=bar;HttpOnly;Secure'), {
		foo: '%1',
		bar: 'bar'
	})
})

CookieParserSuite('unencoded', function () {
	assert.equal(
		parse('foo="bar=123456789&name=Magic+Mouse"', {
			decode: function (v) {
				return v
			}
		}),
		{ foo: 'bar=123456789&name=Magic+Mouse' }
	)

	assert.equal(
		parse('email=%20%22%2c%3b%2f', {
			decode: function (v) {
				return v
			}
		}),
		{ email: '%20%22%2c%3b%2f' }
	)
})

CookieParserSuite('dates', function () {
	assert.equal(
		parse('priority=true; expires=Wed, 29 Jan 2014 17:43:25 GMT; Path=/', {
			decode: function (v) {
				return v
			}
		}),
		{ priority: 'true', Path: '/', expires: 'Wed, 29 Jan 2014 17:43:25 GMT' }
	)
})

CookieParserSuite('missing value', function () {
	assert.equal(
		parse('foo; bar=1; fizz= ; buzz=2', {
			decode: function (v) {
				return v
			}
		}),
		{ bar: '1', fizz: '', buzz: '2' }
	)
})

CookieParserSuite('assign only once', function () {
	assert.equal(parse('foo=%1;bar=bar;foo=boo'), { foo: '%1', bar: 'bar' })
	assert.equal(parse('foo=false;bar=bar;foo=true'), {
		foo: 'false',
		bar: 'bar'
	})
	assert.equal(parse('foo=;bar=bar;foo=boo'), { foo: '', bar: 'bar' })
})

CookieParserSuite.run()
