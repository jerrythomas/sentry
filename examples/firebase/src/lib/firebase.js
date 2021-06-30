// Firebase App (the core Firebase SDK) is always required and must be listed first
// import { initializeApp, getApps, getApp } from 'firebase/app'
// import {
//   GoogleAuthProvider,
//   signInWithPopup,
//   signOut,
//   onAuthStateChanged,
// } from 'firebase/auth'
//
// // Add the Firebase products that you want to use
// import { getAuth } from 'firebase/auth'
// import { getFirestore } from 'firebase/firestore'
// import { initializeApp } from "firebase/app"

// TODO: Replace the following with your app's Firebase project configuration
export const firebaseConfig = {
  apiKey: 'AIzaSyCUE47gWLJ1_YUlphq2Fjh3GGRA5lPqxEE',
  authDomain: 'missions-403bf.firebaseapp.com',
  databaseURL: 'https://missions-403bf.firebaseio.com',
  projectId: 'missions-403bf',
  storageBucket: 'missions-403bf.appspot.com',
  messagingSenderId: '105144395429',
  appId: '1:105144395429:web:0d0cced33124c5a0b10f4c',
  measurementId: 'G-CPXQV4HQLX',
}
// const projectId = VITE_FIREBASE_PROJECT_ID
// export const config = {
//   apiKey: VITE_FIREBASE_API_KEY,
//   authDomain: `${projectId}.firebaseapp.com`,
//   databaseURL: 'https://VITE_FIREBASE_PROJECT_ID.firebaseio.com',
//   projectId: VITE_FIREBASE_PROJECT_ID,
//   storageBucket: `${projectId}.appspot.com`,
//   messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: VITE_FIREBASE_APP_ID,
//   measurementId: VITE_FIREBASE_MEASUREMENT_ID,
// }
// console.log(firebaseConfig, config)

// {
//   apiKey: 'AIzaSyBzbLDdqWRL-zvw3UiTvvQufiEjLNNqUUc',
//   authDomain: 'captaincodeman-experiment.firebaseapp.com',
//   databaseURL: 'https://captaincodeman-experiment.firebaseio.com',
//   projectId: 'captaincodeman-experiment',
//   storageBucket: 'captaincodeman-experiment.appspot.com',
//   messagingSenderId: '341877389348',
//   appId: '1:341877389348:web:7c926f1f20ca49476b00b1',
// }

// const firebaseApp =
//   getApps().length == 0 ? initializeApp(firebaseConfig) : getApp()

// export const auth = getAuth(firebaseApp)
// export const db = getFirestore(firebaseApp)

// export function listen() {
//   onAuthStateChanged(auth, (user) => {
//     // Check for user status
//     console.log('Listening to changes', user)
//     return { user: getInfo(user), accessToken: user.accessToken }
//   })
// }

// export function getInfo(user) {
//   return {
//     name: user.displayName,
//     avatar: user.photoUrl,
//     id: user.uid,
//   }
// }

// todo: handle auth/popup-blocked
// export async function signInHandler() {
//   const provider = new GoogleAuthProvider()
//
//   const result = await signInWithPopup(auth, provider)
//   // The signed-in user info.
//   const user = getInfo(result.user)
//   // This gives you a Google Access Token.
//   console.log('access token before', result.accessToken)
//   GoogleAuthProvider.credentialFromResult(auth, result)
//   const accessToken = result.accessToken
//   console.log('access token after', result.accessToken)
//   // console.log('Sign in result', user, accessToken)
//   const api_result = await fetch('/api/session', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(user),
//   })
//   console.log('sign in => session api', user, api_result)
//
//   return { user, accessToken }
// }
//
// export async function signOutHandler() {
//   const api_result = await fetch('/api/session', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({}),
//   })
//   console.log('Sign out => api result', api_result)
//   const result = await signOut(auth)
//   console.log('Sign out => result', result)
//
//   return result
// }
