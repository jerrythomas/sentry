import cookie from '../src/cookie.js'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'

const CookieSerializeSuite = suite('Cookie Serialize')

CookieSerializeSuite('basic', function () {
	assert.equal(cookie.serialize('foo', 'bar'), 'foo=bar')
	assert.equal(cookie.serialize('foo', 'bar baz'), 'foo=bar%20baz')
	assert.equal(cookie.serialize('foo', ''), 'foo=')
	assert.throws(
		cookie.serialize.bind(cookie, 'foo\n', 'bar'),
		/argument name is invalid/
	)
	assert.throws(
		cookie.serialize.bind(cookie, 'foo\u280a', 'bar'),
		/argument name is invalid/
	)
	assert.throws(
		cookie.serialize.bind(cookie, 'foo', 'bar', { encode: 42 }),
		/option encode is invalid/
	)
})

CookieSerializeSuite('path', function () {
	assert.equal(cookie.serialize('foo', 'bar', { path: '/' }), 'foo=bar; Path=/')
	assert.throws(
		cookie.serialize.bind(cookie, 'foo', 'bar', {
			path: '/\n'
		}),
		/option path is invalid/
	)
})

CookieSerializeSuite('secure', function () {
	assert.equal(
		cookie.serialize('foo', 'bar', { secure: true }),
		'foo=bar; Secure'
	)
	assert.equal(cookie.serialize('foo', 'bar', { secure: false }), 'foo=bar')
})

CookieSerializeSuite('domain', function () {
	assert.equal(
		cookie.serialize('foo', 'bar', { domain: 'example.com' }),
		'foo=bar; Domain=example.com'
	)
	assert.throws(
		cookie.serialize.bind(cookie, 'foo', 'bar', {
			domain: 'example.com\n'
		}),
		/option domain is invalid/
	)
})

CookieSerializeSuite('httpOnly', function () {
	assert.equal(
		cookie.serialize('foo', 'bar', { httpOnly: true }),
		'foo=bar; HttpOnly'
	)
})

CookieSerializeSuite('maxAge', function () {
	assert.throws(function () {
		cookie.serialize('foo', 'bar', {
			maxAge: 'buzz'
		})
	}, /option maxAge is invalid/)

	assert.throws(function () {
		cookie.serialize('foo', 'bar', {
			maxAge: Infinity
		})
	}, /option maxAge is invalid/)

	assert.equal(
		cookie.serialize('foo', 'bar', { maxAge: 1000 }),
		'foo=bar; Max-Age=1000'
	)
	assert.equal(
		cookie.serialize('foo', 'bar', { maxAge: '1000' }),
		'foo=bar; Max-Age=1000'
	)
	assert.equal(
		cookie.serialize('foo', 'bar', { maxAge: 0 }),
		'foo=bar; Max-Age=0'
	)
	assert.equal(
		cookie.serialize('foo', 'bar', { maxAge: '0' }),
		'foo=bar; Max-Age=0'
	)
	assert.equal(cookie.serialize('foo', 'bar', { maxAge: null }), 'foo=bar')
	assert.equal(cookie.serialize('foo', 'bar', { maxAge: undefined }), 'foo=bar')
	assert.equal(
		cookie.serialize('foo', 'bar', { maxAge: 3.14 }),
		'foo=bar; Max-Age=3'
	)
})

CookieSerializeSuite('expires', function () {
	assert.equal(
		cookie.serialize('foo', 'bar', {
			expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900))
		}),
		'foo=bar; Expires=Sun, 24 Dec 2000 10:30:59 GMT'
	)

	assert.throws(
		cookie.serialize.bind(cookie, 'foo', 'bar', {
			expires: Date.now()
		}),
		/option expires is invalid/
	)
})

CookieSerializeSuite('sameSite', function () {
	assert.equal(
		cookie.serialize('foo', 'bar', { sameSite: true }),
		'foo=bar; SameSite=Strict'
	)
	assert.equal(
		cookie.serialize('foo', 'bar', { sameSite: 'Strict' }),
		'foo=bar; SameSite=Strict'
	)
	assert.equal(
		cookie.serialize('foo', 'bar', { sameSite: 'strict' }),
		'foo=bar; SameSite=Strict'
	)
	assert.equal(
		cookie.serialize('foo', 'bar', { sameSite: 'Lax' }),
		'foo=bar; SameSite=Lax'
	)
	assert.equal(
		cookie.serialize('foo', 'bar', { sameSite: 'lax' }),
		'foo=bar; SameSite=Lax'
	)
	assert.equal(
		cookie.serialize('foo', 'bar', { sameSite: 'None' }),
		'foo=bar; SameSite=None'
	)
	assert.equal(
		cookie.serialize('foo', 'bar', { sameSite: 'none' }),
		'foo=bar; SameSite=None'
	)
	assert.equal(cookie.serialize('foo', 'bar', { sameSite: false }), 'foo=bar')

	assert.throws(
		cookie.serialize.bind(cookie, 'foo', 'bar', {
			sameSite: 'foo'
		}),
		/option sameSite is invalid/
	)
})

CookieSerializeSuite('escaping', function () {
	assert.equal(cookie.serialize('cat', '+ '), 'cat=%2B%20')
})

CookieSerializeSuite('parse->serialize', function () {
	assert.equal(cookie.parse(cookie.serialize('cat', 'foo=123&name=baz five')), {
		cat: 'foo=123&name=baz five'
	})

	assert.equal(cookie.parse(cookie.serialize('cat', ' ";/')), { cat: ' ";/' })
})

CookieSerializeSuite('unencoded', function () {
	assert.equal(
		cookie.serialize('cat', '+ ', {
			encode: function (value) {
				return value
			}
		}),
		'cat=+ '
	)

	assert.throws(
		cookie.serialize.bind(cookie, 'cat', '+ \n', {
			encode: function (value) {
				return value
			}
		}),
		/argument val is invalid/
	)
})

CookieSerializeSuite.run()
