let calls = []
let user = {}
let authStateCallback = null

export const supabase = {
	auth: {
		user: () => {
			calls.push({ function: 'user', user })
			return user
		},
		signIn: async (input, options) => {
			calls.push({ function: 'signIn', input, options })
			if (input.email === ERROR_EMAIL) {
				return { error: 'Rate limit error' }
			} else {
				return { error: null }
			}
		},
		signOut: async () => {
			user = {}
			calls.push({ function: 'signOut', user })
			await authStateCallback('SIGNED_OUT', null)
		},
		onAuthStateChange: (cb) => {
			authStateCallback = cb
		}
	},
	user,
	calls,
	authStateCallback
}
