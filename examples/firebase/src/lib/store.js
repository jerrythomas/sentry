import { writable } from 'svelte/store'
import { goto, invalidate } from '$app/navigation'
import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth'

import { getFirestore } from 'firebase/firestore'

const authProviders = {
  google: () => new GoogleAuthProvider(),
}

function createSentry() {
  const { subscribe, set, update } = writable({})

  let app
  let auth

  const init = (config) => {
    reset()
    app = getApps().length == 0 ? initializeApp(config) : getApp()
    auth = getAuth(app)
    console.log('sentry => init')
  }

  const reset = () => {
    set({ user: {}, token: null, hash: null })
  }

  const watch = async () => {
    console.log('sentry => watching')
    onAuthStateChanged(auth, async (user) => {
      let loggedInUser = {}

      if (user) {
        console.log('sentry => watched user', user, user.accessToken)
        loggedInUser = profile(user)
        set({ user: loggedInUser, token: user.accessToken })
        // } else {
        //   reset()
      }
      await storeUserCookie(loggedInUser)
      redirect()
    })
  }

  const getLoginHandler = (provider, scopes = [], params = []) => {
    console.log('sentry => get the login handler')
    // const provider = new GoogleAuthProvider()
    const authProvider = authProviders[provider]()
    scopes.map((scope) => authProvider.addScope(scope))
    params.map((param) => authProvider.setCustomParameters(param))

    const login = async () => {
      const result = await signInWithPopup(auth, authProvider)
      if (result.user) {
        const user = profile(result.user)
        console.log(
          'sentry => logged user',
          result.user,
          result.user.accessToken
        )
        set({ user, token: result.user.accessToken })
        register(user)
        redirect()
      }
    }

    return login
    // store user info
    // set cookie hash
  }

  const logout = async () => {
    console.log('sentry => logout')
    await storeUserCookie({})
    const result = await signOut(auth)
    console.log('Sign out => result', result)
    reset()
    redirect()
    // clear user info
    // clear cookie hash
  }

  const register = async () => {
    console.log('sentry => register')
    // store user info into firestore
  }
  const remove = async () => {
    console.log('sentry => delete')
    // delete user info from firestore
  }

  const redirect = () => {
    invalidate('/')
    goto('/')
  }

  const profile = (user) => {
    return {
      name: user.displayName,
      avatar: user.photoURL,
      email: user.email,
      emailVerified: user.emailVerified,
      id: user.uid,
    }
  }

  const storeUserCookie = async (user) => {
    const api_result = await fetch('/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    console.log('Sign out => api result', api_result)
  }

  return { subscribe, init, getLoginHandler, logout, watch, register, remove }
}

export const sentry = createSentry()
