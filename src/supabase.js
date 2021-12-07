import { writable } from 'svelte/store'
import { Router } from './router.js'

function createSentry() {
	const { subscribe, set } = writable({
		user: {},
		token: null
	})

	let supabase
	let router

	// this should go intou router
	let endpoints = {
		signIn: '/api/signin',
		sessionCookie: '/api/session'
	}

	// let providers = [{ provider: 'magic', label: 'email for Magic Link' }]

	function init(config) {
		router = new Router(config)
		supabase = config.supabase

		// check if providers is an array and throw exception
		// providers =
		// 	Array.isArray(config.providers) && config.providers.length > 0
		// 		? config.providers
		// 		: providers

		set({ user: supabase.auth.user(), token: null })
	}

	async function handleSignIn(request) {
		const { email, provider } = Object.assign(
			Object.fromEntries(request.query.entries()),
			Object.fromEntries(request.body.entries())
		)
		// console.log(email, provider)
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

	function protect(route, session) {
		const redirect = router.redirect(route, session?.role)
		return redirect === route ? {} : { status: 302, redirect }
	}

	async function handleAuthChange() {
		supabase.auth.onAuthStateChange(async (event, session) => {
			// console.log('auth change', event, session)
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
		try {
			await fetch(endpoints.sessionCookie, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'same-origin',
				body: JSON.stringify({ event, session })
			})
		} catch (err) {
			console.error(err.message)
		}
	}

	return {
		subscribe,
		init,
		protect,
		handleAuthChange,
		handleSignIn,
		handleSignOut
	}
}

export const sentry = createSentry()
