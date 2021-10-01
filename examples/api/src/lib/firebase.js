// import { writable } from 'svelte/store'
// import { goto, invalidate } from '$app/navigation'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getPhotoUrl } from './auth/microsoft'

// import { setCookie } from './utils'
// import * as pkg from 'firebase/auth'
import {
  signInWithPopup,
  // signOut,
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
    }

    const credential = OAuthProvider.credentialFromResult(result)
    if (credential) {
      token = credential.accessToken
      if (provider == 'microsoft') {
        user.avatar = await getPhotoUrl(token)
      }
    }
  }
  return { user, token }
}

// function createSentry() {
//   const { subscribe, set } = writable({})

//   let paused = false
//   let app = {
//     firebaseApp: null,
//     auth: null,
//     routes: {},
//   }
//   let auth

//   function init(config, routes) {
//     reset()
//     app.firebaseApp = getApps().length == 0 ? initializeApp(config) : getApp()
//     app.auth = getAuth(app.firebaseApp)
//     app.routes = routes
//   }

//   function reset() {
//     set({ user: {}, token: null })
//   }

//   async function watch() {
//     onAuthStateChanged(app.auth, async (user) => {
//       // if (!paused) onChange({ user })
//     })
//   }

//   async function logout() {
//     paused = true
//     await signOut(auth)
//     await onChange()
//   }

//   async function onChange(result, refresh = false) {
//     let user = {}
//     let token = null
//     let register = null
//     let loggedIn = false

//     if (result?.user) {
//       user = {
//         name: result.user.displayName,
//         avatar: result.user.photoURL,
//         email: result.user.email,
//         emailVerified: result.user.emailVerified,
//         domain: result.user.email.split('@')[1],
//         id: result.user.uid,
//       }
//       const credential = OAuthProvider.credentialFromResult(result)
//       if (credential) token = credential.accessToken
//       loggedIn = true

//       if (refresh) register = { ...user }
//     }

//     // await setCookie(user)
//     // set({ user, loggedIn, token, register })
//     paused = false
//     // redirect(user.id ? homePage : startPage)
//   }

//   function redirect(path) {
//     if (window.location.pathname != path) {
//       invalidate(path)
//       goto(path)
//     }
//   }

//   return { subscribe, init, getLoginHandler, logout, watch }
// }

// export const sentry = createSentry()
