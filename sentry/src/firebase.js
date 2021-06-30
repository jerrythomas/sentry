import { writable } from 'svelte/store'
import { goto, invalidate } from '$app/navigation'
import { initializeApp, getApps, getApp } from 'firebase/app'

import * as pkg from 'firebase/auth'

import {
  // signInWithPopup,
  signOut,
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from 'firebase/auth'

const { signInWithPopup } = pkg

const authProviders = {
  apple: () => new OAuthProvider('apple.com'),
  facebook: () => new FacebookAuthProvider(),
  github: () => new GithubAuthProvider(),
  google: () => new GoogleAuthProvider(),
  twitter: () => new TwitterAuthProvider(),
  microsoft: () => new OAuthProvider('microsoft'),
  yahoo: () => new OAuthProvider('yahoo'),
}

function createSentry() {
  const { subscribe, set, update } = writable({})

  let app
  let auth
  let homePage = '/'
  let startPage = '/home'
  let paused = false

  function init(config, routes) {
    reset()
    app = getApps().length == 0 ? initializeApp(config) : getApp()
    auth = getAuth(app)
    homePage = routes.home
    startPage = routes.start
  }

  function reset() {
    set({ user: {}, token: null })
  }

  function watch() {
    onAuthStateChanged(auth, async (user) => {
      if (!paused) onChange({ user })
    })
  }

  function getLoginHandler(provider, scopes = [], params = []) {
    const authProvider = authProviders[provider]()
    scopes.map((scope) => authProvider.addScope(scope))
    params.map((param) => authProvider.setCustomParameters(param))

    const login = async () => {
      paused = true
      const result = await signInWithPopup(auth, authProvider)
      if (result.user) {
        await onChange(result, true)
      }
    }

    return login
  }

  async function logout() {
    paused = true
    await signOut(auth)
    await onChange()
  }

  function redirect(path) {
    if (window.location.pathname != path) {
      invalidate(path)
      goto(path)
    }
  }

  async function onChange(result = {}, refresh = false) {
    let user = {}
    let token = null
    let register = null

    if (result.user) {
      user = {
        name: result.user.displayName,
        avatar: result.user.photoURL,
        email: result.user.email,
        emailVerified: result.user.emailVerified,
        id: result.user.uid,
      }
      token = result.user.accessToken

      if (refresh) register = { ...user }
    }

    set({ user, token, register })

    await setCookie(user)
    paused = false
    redirect(result.user ? homePage : startPage)
  }

  async function setCookie(user) {
    const loggedInAt = new Date()
    const lastLogin = Object.keys(user).includes('id')
      ? loggedInAt.toISOString()
      : ''
    localStorage.setItem('lastLogin', lastLogin)

    const result = await fetch('/api/setCookie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lastLogin }),
    })
    return result
  }

  return { subscribe, init, getLoginHandler, logout, watch }
}

export const sentry = createSentry()
