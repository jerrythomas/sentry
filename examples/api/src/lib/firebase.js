import { writable } from 'svelte/store'
// import { goto, invalidate } from '$app/navigation'
import { initializeApp, getApps, getApp } from 'firebase/app'

import { gravatar } from './auth/avatar'
import {
  signInWithPopup,
  signOut,
  getAuth,
  // onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from 'firebase/auth'

export const authProviders = {
  apple: () => new OAuthProvider('apple.com'),
  facebook: () => new FacebookAuthProvider(),
  github: () => new GithubAuthProvider(),
  google: () => new GoogleAuthProvider(),
  twitter: () => new TwitterAuthProvider(),
  microsoft: () => new OAuthProvider('microsoft.com'),
  yahoo: () => new OAuthProvider('yahoo'),
}

export async function authorize(config, provider, scopes = [], params = []) {
  const authProvider = authProviders[provider]()
  const app = getApps().length == 0 ? initializeApp(config) : getApp()
  const auth = getAuth(app)

  scopes.map((scope) => authProvider.addScope(scope))
  params.map((param) => authProvider.setCustomParameters(param))

  const result = await signInWithPopup(auth, authProvider)

  let user = {}
  let token = null

  if (result.user) {
    user = {
      name: result.user.displayName,
      avatar: result.user.photoURL,
      email: result.user.email,
      emailVerified: result.user.emailVerified,
      domain: result.user.email.split('@')[1],
      id: result.user.uid,
      gravatar: gravatar(result.user.email),
    }

    const credential = OAuthProvider.credentialFromResult(result)
    if (credential) {
      token = credential.accessToken
    }
  }
  return { user, token }
}

function createSentry() {
  const { subscribe, set } = writable({})

  let user
  let token
  let app
  let auth

  function init(config) {
    app = getApps().length == 0 ? initializeApp(config) : getApp()
    auth = getAuth(app)
  }

  async function watch() {
    onAuthStateChanged(auth, async (user) => {
      if (!paused) onChange({ user })
    })
  }
  async function authenticate(config, provider, scopes = [], params = []) {
    const result = await authorize(config, provider, scopes, params)
    user = result.user
    token = result.token
  }

  async function logout(config) {
    // const app = getApps().length == 0 ? initializeApp(config) : getApp()
    // const auth = getAuth(app)
    await signOut(auth)
  }

  async function onChange() {}
}
