import firebase from 'firebase/app'
import User from './User'

type AuthUser = User | undefined

export function watchUserAuth(
  authClient: firebase.app.App,
  callback: (user: AuthUser) => void
): void {
  const auth = authClient.auth()

  auth.onAuthStateChanged(() => {
    console.log('Loading User')
    if (auth.currentUser) {
      console.log('Have User')
      const { uid, displayName, photoURL, email } = auth.currentUser
      const user: User = {
        uid,
        displayName,
        photoURL,
        email,
      }
      callback(user)
    } else {
      console.log('No User')
      callback(undefined)
    }
  })
}

export async function logout(): Promise<void> {
  await firebase.auth().signOut()
}

export async function login(token: string): Promise<void> {
  console.log(token)
  const d = new Date().valueOf()
  const epoch = d / 1000
  console.log(epoch)
  if (window.location.hostname == 'localhost')
    firebase.auth().useEmulator('http://localhost:9099/')
  await firebase.auth().signInWithCustomToken(token.trim())
}