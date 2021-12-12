const ROOT = '/'

export class Router {
	constructor(options) {
		this.home = options?.home || ROOT
		this.auth = {
			pages: {
				login: options?.auth?.pages?.login || '/auth',
				logout: options?.auth?.pages?.logout || '/auth/logout'
			},
			endpoints: {
				signIn: options?.auth?.endpoints?.signIn || '/auth/signin',
				session: options?.auth?.endpoints?.session || '/auth/session'
			}
		}
		// this.login = options?.login || '/auth'
		// this.logout = options?.logout || '/auth/logout'
		// this.endpoints = options?.endpoints || {
		// 	signIn: '/auth/signin',
		// 	sessionCookie: '/auth/session'
		// }

		this.allowedRoutes = []

		let routes = options?.byRole || {}
		routes.public = routes.public || []
		routes.authenticated = routes.authenticated || []

		this.byRole = {}
		Object.keys(routes).map((role) => {
			this._add(role, routes[role])
		})

		this.authRoles = null
	}

	_add(role, routes) {
		if (role === 'public') {
			let publicRoutes = [
				this.auth.pages.login,
				this.auth.endpoints.signIn,
				this.auth.endpoints.session
			]
			publicRoutes = [...new Set([...publicRoutes, ...routes])]
			this.byRole[role] = publicRoutes.sort()
		} else {
			this.byRole[role] = [...new Set([...routes, this.home])].sort()
		}

		// Remove child routes if parent is already in the list
		for (let i = 0; i < this.byRole[role].length; i++) {
			const current = this.byRole[role][i]
			for (let j = i + 1; j < this.byRole[role].length; j++) {
				while (
					j < this.byRole[role].length &&
					this.byRole[role][j].startsWith(current + '/')
				) {
					// console.log('before', this.byRole[role][j], this.byRole[role])
					this.byRole[role].splice(j, 1)
					// console.log('after', this.byRole[role][j], this.byRole[role])
				}
			}
		}
		// console.log('final', role, this.byRole[role])
	}

	/**
	 * @param {string|string[]} roles
	 */
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

			this.allowedRoutes = [
				...new Set([
					...this.allowedRoutes,
					this.auth.pages.logout,
					this.auth.endpoints.session
				])
			]
				.filter(
					(route) =>
						route !== this.auth.pages.login &&
						route !== this.auth.endpoints.signIn
				)
				.sort()
		} else {
			this.allowedRoutes = this.byRole['public']
		}
	}

	/**
	 *
	 * @param {string} route
	 * @returns {string}
	 */
	redirect(route) {
		let isAllowed = false

		if (route !== this.auth.pages.logout || this.isAuthenticated) {
			for (let i = 0; i < this.allowedRoutes.length && !isAllowed; i++) {
				isAllowed =
					route === this.allowedRoutes[i] ||
					route.startsWith(this.allowedRoutes[i] + '/')
			}
		}

		// console.log(route, this.isAuthenticated, isAllowed)

		return isAllowed
			? route
			: this.isAuthenticated
			? this.home
			: this.auth.pages.login
	}
}
