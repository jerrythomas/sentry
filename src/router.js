const ROOT = '/'

export class Router {
	constructor(options) {
		this.home = options?.home || ROOT
		this.login = options?.login || '/login'
		this.logout = options?.logout || '/logout'
		this.endpoints = options?.endpoints || {
			signIn: '/auth/signin',
			sessionCookie: '/auth/session'
		}

		this.allowedRoutes = []

		let routes = options?.byRole || {}
		routes.public = routes.public || []
		routes.authenticated = routes.authenticated || []

		this.byRole = {}
		Object.keys(routes).map((role) => {
			this._add(role, routes[role])
		})
		console.log(this.byRole)
		this.authRoles = null
	}

	_add(role, routes) {
		let publicRoutes = [
			this.login,
			this.endpoints.signIn,
			this.endpoints.sessionCookie
		]
		if (role === 'public') {
			publicRoutes = [...new Set([...publicRoutes, ...routes])]
			this.byRole[role] = publicRoutes.sort()
			// this.rootIsPublic = this.publicRoutes.includes(ROOT)
		} else {
			this.byRole[role] = [...new Set([...routes, this.home])].sort()
		}
	}

	set authRoles(roles) {
		this.isAuthenticated = roles && roles !== '' ? true : false
		this.authorizedRoles = (Array.isArray(roles) ? roles : [roles]).filter(
			(role) => role && role !== ''
		)
		this.authorizedRoles = ['public', ...this.authorizedRoles]
		this.allowedRoutes = []

		if (this.isAuthenticated) {
			this.authorizedRoles.map((role) => {
				if (role in this.byRole)
					this.allowedRoutes = [...this.allowedRoutes, ...this.byRole[role]]
			})

			this.allowedRoutes = [...new Set([...this.allowedRoutes, this.logout])]
				.filter((route) => route !== this.login)
				.sort()
		} else {
			this.allowedRoutes = this.byRole['public']
		}
	}

	redirect(route) {
		let isAllowed = false
		// console.log(route, this.isAuthenticated, this.allowedRoutes)
		for (let i = 0; i < this.allowedRoutes.length && !isAllowed; i++) {
			isAllowed =
				route === this.allowedRoutes[i] ||
				route.startsWith(this.allowedRoutes[i] + '/')
			// this.allowedRoutes[i] === ROOT
			// 	? route === this.allowedRoutes[i]
			// 	: route === this.allowedRoutes[i] ||
			// route.startsWith(this.allowedRoutes[i] + '/')
			// route.startsWith(this.allowedRoutes[i] + '?')
			// console.log(isAllowed, route, this.allowedRoutes[i])
		}

		return isAllowed ? route : this.isAuthenticated ? this.home : this.login
	}
}
