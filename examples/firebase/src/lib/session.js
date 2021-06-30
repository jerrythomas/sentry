import {writable} from 'svelte/store'

function createSession(){
  const {subscribe, set, update} = writable({})

  return {
    subscribe,
    reset: () => set({
      user: null, 
      accessToken: null,
      start: null, 
      expires: 60*60*24
    }),
    signIn: (user, accessToken) => set({
      user,
      accessToken,
      start: new Date(),
      expires: 60*60*24
    })
  }
}

export const session = createSession()