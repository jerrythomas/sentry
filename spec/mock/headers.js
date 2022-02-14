export class Headers {
	location
	#cookie

	constructor(headers) {
		if (headers.location) this.location = headers.location
		if (headers.cookie) this.#cookie = headers.cookie
	}

	get(key) {
		if (key === 'cookie') return this.#cookie
	}
}
