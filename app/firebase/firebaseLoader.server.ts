import admin from 'firebase-admin'
import FirebaseConfig from './FirebaseConfig'
import spotifyClient from '../spotify/spotifyClient'

interface Auth {
  spotifyUserID: string
  displayName: string
  photoURL: string
  email: string
  accessToken: string
  refreshToken: string
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

export async function getToken(code: string): Promise<string> {
  const auth: Auth = await new Promise((resolve, reject) => {
    spotifyClient.authorizationCodeGrant(code, (error, data) => {
      if (error) {
        throw reject(error)
      }
      console.log('Received Access Token:', data.body['access_token'])
      spotifyClient.setAccessToken(data.body['access_token'])
      const refreshToken = data.body['refresh_token']

      spotifyClient.getMe(
        async (error, userResults): Promise<void> => {
          if (error) {
            reject(error)
          }
          console.log('Auth code exchange result received:', userResults)

          const accessToken = data.body['access_token']
          const spotifyUserID = userResults.body['id']
          const photoURL = userResults.body['images']
            ? userResults.body['images'][0]['url']
            : ''
          const displayName = userResults.body['display_name'] || ''
          const email = userResults.body['email']

          resolve({
            accessToken,
            refreshToken,
            spotifyUserID,
            displayName,
            photoURL,
            email,
          })
        }
      )
    })
  })

  return await createFirebaseAccount(auth)
}

async function createFirebaseAccount(auth: Auth): Promise<string> {
  // The UID we'll assign to the user.
  const uid = `spotify:${auth.spotifyUserID}`

  const db = admin.firestore()

  const docRef = db.collection('spotifyTokens').doc(uid)

  const tokenSaveTask = docRef.set({
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
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
      // If user does not exists we create it.
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

  // Wait for all async tasks to complete, then generate and return a custom auth token.
  await Promise.all([userCreationTask, tokenSaveTask])
  // Create a Firebase custom auth token.
  return await admin.auth().createCustomToken(uid)
}
