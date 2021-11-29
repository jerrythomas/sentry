import * as cookie from 'cookie'

export async function get(request) {
	console.log('auth/register:get', request.body)
	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: { message: 'get' }
	}
}

export async function put(request) {
	console.log('auth/register:put', request.body)
	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: { message: 'put' }
	}
}

export async function post(request) {
	console.log('auth/register:post', request.body)
	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: { message: 'post' }
	}
}

export async function del(request) {
	console.log('auth/register:del', request.body)
	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: { message: 'delete' }
	}
}
