import { writable } from 'svelte/store'
import { Router } from './router.js'

function createSentry() {
	const { subscribe, set } = writable({
		user: {},
		token: null
	})

	let supabase
	let router

	function init(config) {
		router = new Router(config)
		supabase = config.supabase

		set({ user: supabase.auth.user(), token: null })
	}

	async function handleSignIn(request) {
		const { email, provider } = Object.assign(
			Object.fromEntries(request.query.entries()),
			Object.fromEntries(request.body.entries())
		)

		if (provider === 'magic') {
			const { error } = await supabase.auth.signIn(
				{ email },
				{ redirectTo: request.headers.origin }
			)
			return { error, email, provider }
		}
		return 'not supported yet'
	}

	async function handleSignOut() {
		await supabase.auth.signOut()
		await updateSession()
		window.location.href = router.login
	}

	function protect(route, session, response) {
		router.authRoles = session?.role
		const redirect = router.redirect(route)

		if (response) {
			return redirect === route
				? response
				: { status: 302, headers: { location: redirect } }
		} else {
			return redirect === route ? {} : { status: 302, redirect }
		}
	}

	async function handleAuthChange() {
		supabase.auth.onAuthStateChange(async (event, session) => {
			await updateSession(event, session)

			if (session) {
				set({ user: session.user })
				window.location.href = router.home
			} else {
				set({ user: {} })
				window.location.href = router.login
			}
		})
	}

	async function updateSession(event, session) {
		await fetch(router.endpoints.sessionCookie, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'same-origin',
			body: JSON.stringify({ event, session })
		})
	}

	function routes() {
		return { authUrl: router.endpoints.signIn, loginUrl: router.login }
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
