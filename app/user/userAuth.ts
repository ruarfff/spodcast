import firebase from 'firebase/app'
import User from './User'

type AuthUser = User | undefined

export function watchUserAuth(
  authClient: firebase.app.App,
  callback: (user: AuthUser) => void
): void {
  const auth = authClient.auth()

  auth.onAuthStateChanged(async () => {
    if (auth.currentUser) {
      const { uid, displayName, photoURL, email } = auth.currentUser
      const idToken = await auth.currentUser.getIdToken()

      const user: User = {
        uid,
        displayName,
        photoURL,
        email,
        idToken,
      }
      callback(user)
    } else {
      callback(undefined)
    }
  })
}

export async function logout(): Promise<void> {
  await firebase.auth().signOut()
}

export async function login(
  token: string
): Promise<firebase.auth.UserCredential> {
  if (window.location.hostname == 'localhost')
    firebase.auth().useEmulator('http://localhost:9099/')
  return firebase.auth().signInWithCustomToken(token.trim())
}
