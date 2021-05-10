import admin from 'firebase-admin'
import { getAuth } from '../spotify/spotifyClient.server'
import FirebaseConfig from './FirebaseConfig'

interface Auth {
  spotifyUserID: string
  displayName: string
  photoURL: string
  email: string
  accessToken: string
  refreshToken: string
  expiresAt: number
  expiresIn: number
}

export function loadConfigFromEnv(): FirebaseConfig {
  return {
    apiKey: process.env.SPODCAST_FB_API_KEY || '',
    authDomain: process.env.SPODCAST_FB_AUTH_DOMAIN || '',
    projectId: process.env.SPODCAST_PROJECT_ID || '',
    storageBucket: process.env.SPODCAST_STORAGE_BUCKET || '',
    messagingSenderId: process.env.SPODCAST_MESSAGING_SENDER || '',
    appId: process.env.SPODCAST_APP_ID || '',
    measurementId: process.env.SPODCAST_MEASUREMENT_ID || '',
  }
}

export async function getFirebaseTokenFromAuthCode(
  code: string
): Promise<string> {
  const {
    accessToken,
    refreshToken,
    expiresAt,
    expiresIn,
    user,
  } = await getAuth(code)

  const spotifyUserID = user['id']
  const photoURL = user['images'] ? user['images'][0]['url'] : ''
  const displayName = user['display_name'] || ''
  const email = user['email']

  const auth = {
    spotifyUserID,
    displayName,
    photoURL,
    email,
    accessToken,
    refreshToken,
    expiresAt,
    expiresIn,
  }

  return await createFirebaseAccount(auth)
}

async function createFirebaseAccount(auth: Auth): Promise<string> {
  const uid = `spotify:${auth.spotifyUserID}`

  const db = admin.firestore()

  const docRef = db.collection('spotifyTokens').doc(uid)

  const tokenSaveTask = docRef.set({
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    expiresAt: auth.expiresAt,
    expiresIn: auth.expiresIn,
  })

  // Create or update the user account.
  const userCreationTask = admin
    .auth()
    .updateUser(uid, {
      displayName: auth.displayName,
      photoURL: auth.photoURL,
      email: auth.email,
      emailVerified: true,
    })
    .catch((error) => {
      // If user does not exist, create it.
      if (error.code === 'auth/user-not-found') {
        return admin.auth().createUser({
          uid: uid,
          displayName: auth.displayName,
          photoURL: auth.photoURL,
          email: auth.email,
          emailVerified: true,
        })
      }
      throw error
    })

  await Promise.all([userCreationTask, tokenSaveTask])
  return await admin.auth().createCustomToken(uid)
}
