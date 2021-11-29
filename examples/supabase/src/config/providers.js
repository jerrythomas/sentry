export const providers = [
	{
		provider: 'google',
		label: 'Google',
		scopes: [],
		params: [],
	},
	{
		provider: 'microsoft',
		label: 'Microsoft',
		scopes: [],
		params: [{ prompt: 'consent', domain_hint: 'organizations' }],
	},
]
