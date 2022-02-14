import { writable } from 'svelte/store'
import { Router } from './router.js'
import { sessionFromCookies } from './helper.js'
// import { hasAuthParams } from './helper.js'

export let isAuthorizing = writable(false)

function createSentry() {
	const { subscribe, set } = writable({
		user: {},
		token: null
	})

	let adapter
	let router
	let providers
	let isLoggedIn = false

	function init(config) {
		router = new Router(config.routes)
		adapter = config.adapter
		providers = config.providers.reduce(
			(obj, cur) => ({
				...obj,
				[cur.provider]: {
					scopes: cur.scopes || [],
					params: cur.params || []
				}
			}),
			{}
		)

		set({ user: adapter.auth.user(), token: null })
	}

	/**
	 * @typedef {AuthParams}
	 * @property {string} [email]
	 * @property {string} [provider]
	 */
	/**
	 *
	 * @param {AuthParams} params
	 * @param {string} baseUrl
	 * @returns
	 */
	async function handleSignIn(params, baseUrl) {
		if (!(params.provider in providers)) {
			return { error: 'Provider has not been configured.', params }
		}
		const credentials =
			params.provider === 'magic'
				? { email: params.email }
				: { provider: params.provider }

		// console.log('handleSignIn', params, credentials)
		const options = {
			redirectTo: baseUrl + router.login,
			scopes: providers[params.provider].scopes.join(' '),
			params: providers[params.provider].params
		}

		const { error } = await adapter.auth.signIn(credentials, options)
		return { error, params, options }
	}

	async function handleSignOut() {
		await adapter.auth.signOut()
		await updateSession()
		window.location.pathname = router.login
	}

	function protectBrowser(route) {
		const location = router.redirect(route)
		console.log(router.authRoles, location)
		// if (route !== location) window.location.pathname = location
		// return { status: 302, redirect: location }
	}

	function protect(event, response) {
		const session = sessionFromCookies(event)
		// if (session !== event.locals)
		event.locals = session
		if (!event.url) return response

		const route = event.url.pathname
		router.authRoles = session.role
		const location = router.redirect(route)

		console.log('Redirection', route, session.role, location)

		if (location !== route) {
			return new Response('', {
				status: 302,
				headers: new Headers({ location })
			})
		}
		return response
	}

	async function handleAuthChange(path = '/') {
		// isAuthorizing.set(true)
		if (path !== router.login) {
			window.sessionStorage.setItem('path', path)
			// console.log('cached current path', path)
		}
		// isAuthorizing.set(sess)
		adapter.auth.onAuthStateChange(async (event, session) => {
			// console.log('Auth change event fired')
			isAuthorizing.set(true)
			// console.log('In auth change cb')
			await updateSession(event, session)
			// console.log('session updated')
			if (session) {
				set({ user: session.user })
				router.authRoles = session.user.role
			} else {
				set({ user: {} })
				router.authRoles = ''
			}
			isAuthorizing.set(false)
			const detour = router.redirect(window.sessionStorage.getItem('path'))
			if (detour !== window.location.pathname) window.location.pathname = detour
		})
	}

	async function updateSession(event, session) {
		await fetch(router.session, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'same-origin',
			body: JSON.stringify({ event, session })
		})
	}

	function routes() {
		return {
			authUrl: router.authUrl,
			loginUrl: router.login
		}
	}

	return {
		subscribe,
		init,
		routes,
		protect,
		protectBrowser,
		handleAuthChange,
		handleSignIn,
		handleSignOut
	}
}

export const sentry = createSentry()
