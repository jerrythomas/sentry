import { writable } from 'svelte/store'
import { goto, invalidate } from '$app/navigation'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { createEventDispatcher } from 'svelte'

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

const dispatch = createEventDispatcher()

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
  let home = '/'
  let login = '/home'
  let isLoggedIn = false

  function init(config, routes) {
    reset()
    app = getApps().length == 0 ? initializeApp(config) : getApp()
    auth = getAuth(app)
    home = routes.home
    login = routes.login
  }

  function reset() {
    set({ user: {}, token: null })
  }

  function watch() {
    onAuthStateChanged(auth, async user => {
      if (user) {
        set({ user: profile(user), token: user.accessToken })
      }
      await setCookie(user)
      redirect(user ? home : login)
    })
  }

  function getLoginHandler(provider, scopes = [], params = []) {
    const authProvider = authProviders[provider]()
    scopes.map(scope => authProvider.addScope(scope))
    params.map(param => authProvider.setCustomParameters(param))

    const login = async () => {
      const result = await signInWithPopup(auth, authProvider)
      if (result.user) {
        const user = profile(result.user)
        set({ user, token: result.user.accessToken })
        await setCookie(user)
        register(user)
        redirect(home)
      }
    }

    return login
  }

  async function logout() {
    console.log('sentry => logout')
    await setCookie()
    const result = await signOut(auth)
    reset()
    redirect(login)
  }

  function redirect(path) {
    invalidate(path)
    goto(path)
  }

  function profile(user) {
    return {
      name: user.displayName,
      avatar: user.photoURL,
      email: user.email,
      emailVerified: user.emailVerified,
      id: user.uid,
    }
  }

  async function onChange(result, signUp = false) {
    let user = {}
    let token = null

    if (result.user) {
      user = {
        name: user.displayName,
        avatar: user.photoURL,
        email: user.email,
        emailVerified: user.emailVerified,
        id: user.uid,
      }
      token = result.user.accessToken
    }

    set({ user, token })
    await setCookie(user)

    if (signUp) register(user)
  }

  function register(user) {
    console.log('sentry => register')
    if (user != {}) dispatch('register', { user })
  }

  async function setCookie(user) {
    const loggedInAt = new Date()
    const api_result = await fetch('/api/setCookie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lastLogin: user ? loggedInAt.toISOString() : '',
      }),
    })
  }

  return { subscribe, init, getLoginHandler, logout, watch, register, remove }
}

export const sentry = createSentry()
