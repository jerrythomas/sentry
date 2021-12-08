import { createClient } from '@supabase/supabase-js'
import { writable } from 'svelte/store'
import cookie from 'cookie'

const ROOT = '/'

function createSentry() {
	const { subscribe, set } = writable({
		user: {},
		alert: {},
		token: null
	})

	let supabase

	let routes = {
		home: '/',
		login: '/login',
		logout: '/logout',
		public: ['/api', '/login'],
		rootIsPublic: true
	}

	let endpoints = {
		signIn: '/api/signin',
		sessionCookie: '/api/session'
	}

	let providers = [{ provider: 'magic', label: 'email for Magic Link' }]

	function init(config) {
		routes = Object.assign(routes, config.routes | {})
		routes.rootIsPublic = routes.home === ROOT || routes.public.includes(ROOT)
		routes.public = routes.public.filter((route) => route !== ROOT)
		if (routes.home !== ROOT && !routes.public.includes(routes.home)) {
			routes.public = [routes.home, ...routes.public]
		}

		providers =
			Array.isArray(config.providers) && config.providers.length > 0
				? config.providers
				: providers
		endpoints = Object.assign(endpoints, config.endpoints | {})
		supabase = createClient(
			config.auth.supabaseUrl,
			config.auth.supabaseAnonKey
		)

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
		window.location.href = '/login'
	}

	function handleTraffic(route, session) {
		const isAuthorized =
			session != null && (session.id != '' || session.email != '')
		let isAllowed = isAuthorized || (route === ROOT && routes.rootIsPublic)

		// console.log(
		// 	'allowed',
		// 	isAllowed,
		// 	route === routes.root,
		// 	routes.rootIsPublic,
		// 	route,
		// 	routes.public
		// )

		for (let i = 0; i < routes.public.length && !isAllowed; i++) {
			isAllowed = route.startsWith(routes.public[i])
			// console.log('allowed', isAllowed, route, routes.public[i], route.startsWith(routes.public[i]))
		}

		return isAllowed
			? {}
			: { status: 302, redirect: isAuthorized ? routes.home : routes.login }
	}

	async function handleAuthChange() {
		supabase.auth.onAuthStateChange(async (event, session) => {
			console.log('auth change', event, session)
			await updateSession(event, session)

			if (session) {
				set({ user: session.user })
				window.location.href = routes.home
			} else {
				set({ user: {} })
				window.location.href = routes.login
			}
		})
	}

	async function updateSession(event, session) {
		await fetch(endpoints.sessionCookie, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'same-origin',
			body: JSON.stringify({ event, session })
		})
	}

	return {
		subscribe,
		init,
		routes,
		handleAuthChange,
		handleTraffic,
		handleSignIn,
		handleSignOut
	}
}

export function sessionFromCookies(request) {
	console.log(request.headers.cookie)
	const cookies = cookie.parse(request.headers.cookie || '')
	const keys = ['id', 'email', 'role']
	let session = {}

	// ramda pick?
	keys.map((key) => {
		session[key] = key in cookies ? cookies[key] : ''
	})

	return session
}

export function cookiesFromSession(session) {
	const keys = ['id', 'email', 'role']
	const user = session?.user || null
	const cookies = keys.map((key) =>
		cookie.serialize(key, user ? user[key] : '', {
			path: '/',
			httpOnly: true,
			sameSite: true,
			maxAge: 3600
		})
	)

	return {
		status: 200,
		headers: {
			'content-type': 'application/json',
			'set-cookie': cookies
		}
	}
}

export const sentry = createSentry()
