export const providers = {
	google: {
		label: 'Google',
		scopes: [],
		params: []
	},
	microsoft: {
		label: 'Microsoft',
		scopes: [],
		params: [{ prompt: 'consent', domain_hint: 'organizations' }]
	}
}
