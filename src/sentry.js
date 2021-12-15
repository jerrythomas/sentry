import { writable } from 'svelte/store'
import { Router } from './router.js'

function createSentry() {
	const { subscribe, set } = writable({
		user: {},
		token: null
	})

	let adapter
	let router
	let providers

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

	async function handleSignIn(params, baseUrl) {
		if (!(params.provider in providers)) {
			return { error: 'Provider has not been configured.', params }
		}
		const credentials =
			params.provider === 'magic'
				? { email: params.email }
				: { provider: params.provider }
		const options = {
			redirectTo: baseUrl + router.auth.pages.login,
			scopes: providers[params.provider].scopes.join(' '),
			params: providers[params.provider].params
		}

		const { error } = await adapter.auth.signIn(credentials, options)
		return { error, params, options }
	}

	async function handleSignOut() {
		await adapter.auth.signOut()
		await updateSession()
		window.location.pathname = router.auth.pages.login
	}

	function protect(route, session, response) {
		router.authRoles = session?.role
		const redirect = router.redirect(route)

		return redirect === route
			? response || {}
			: { status: 302, headers: { location: redirect } }
	}

	async function handleAuthChange() {
		adapter.auth.onAuthStateChange(async (event, session) => {
			if (session) {
				set({ user: session.user })
				router.authRoles = session.user.role
			} else {
				set({ user: {} })
				router.authRoles = ''
			}
			await updateSession(event, session)
			window.location.pathname = router.redirect(window.location.pathname)
		})
	}

	async function updateSession(event, session) {
		await fetch(router.auth.endpoints.session, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'same-origin',
			body: JSON.stringify({ event, session })
		})
	}

	function routes() {
		return {
			authUrl: router.auth.endpoints.signIn,
			loginUrl: router.auth.pages.login
		}
	}

	return {
		subscribe,
		init,
		routes,
		protect,
		handleAuthChange,
		handleSignIn,
		handleSignOut
	}
}

export const sentry = createSentry()
