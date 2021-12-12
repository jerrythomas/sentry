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
		router = new Router(config.routes)
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
				{ redirectTo: request.headers.origin + router.auth.pages.login }
			)

			return { error, email, provider }
		}
		return 'not supported yet'
	}

	async function handleSignOut() {
		await supabase.auth.signOut()
		await updateSession()
		window.location.href = router.auth.pages.login
	}

	function protect(route, session, response) {
		router.authRoles = session?.role
		const redirect = router.redirect(route)

		// if (response) {
		return redirect === route
			? response || {}
			: { status: 302, headers: { location: redirect } }
		// } else {
		// 	return redirect === route ? {} : { status: 302, redirect }
		// }
	}

	async function handleAuthChange() {
		supabase.auth.onAuthStateChange(async (event, session) => {
			await updateSession(event, session)

			if (session) {
				set({ user: session.user })
				window.location.href = router.home
			} else {
				set({ user: {} })
				window.location.href = router.auth.pages.login
			}
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
