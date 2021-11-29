import { createClient } from '@supabase/supabase-js'

function createSentry() {
	const { subscribe, set } = writable({})

	let supabase
	let homePage
	let startPage

	function init(config, routes) {
		reset()
		supabase = createClient(config.supabaseUrl, config.supabaseAnonKey)
		homePage = routes.home
		startPage = routes.start
	}

	function reset() {
		set({ user: {}, token: null })
	}

	async function watch() {
		supabase.auth.onAuthStateChange((event, session) => {
			console.log(event, session)
			if (!paused) onChange({ user })
		})
	}

	function getLoginHandler(provider, scopes = [], params = []) {
		const { user, session, error } = await supabase.auth.signIn(
			{
				// provider can be 'github', 'google', 'gitlab', or 'bitbucket'
				provider
			},
			{ scopes, params }
		)
		// const authProvider = authProviders[provider]()
		// scopes.map((scope) => authProvider.addScope(scope))
		// params.map((param) => authProvider.setCustomParameters(param))
		console.log(user, session, error)
		// const oAuthToken = session.provider_token
		// const login = async () => {
		// 	paused = true
		// 	const result = await signInWithPopup(auth, authProvider)
		// 	if (result.user) {
		// 		await onChange(result, true)
		// 	}
		// }
		// return login
	}

	async function logout() {
		paused = true
		const { error } = await supabase.auth.signOut()
		await onChange()
	}

	async function onChange(result, refresh = false) {
		// let user = {}
		let token = null
		let register = null
		let loggedIn = false

		if ('user' in result) {
			user = {
				name: result.user.displayName,
				avatar: result.user.photoURL,
				email: result.user.email,
				emailVerified: result.user.emailVerified,
				domain: result.user.email.split('@')[1],
				id: result.user.uid
			}
			// const credential = OAuthProvider.credentialFromResult(result)
			if ('session' in result) token = result.session.provider_token
			loggedIn = true

			if (refresh) register = { ...user }
		}

		await setCookie(user)
		set({ user, loggedIn, token, register })
		paused = false
		redirect(user.id ? homePage : startPage)
	}

	function redirect(path) {
		if (window.location.pathname != path) {
			invalidate(path)
			goto(path)
		}
	}

	return { subscribe, init, getLoginHandler, logout, watch }
}

export const sentry = createSentry()
