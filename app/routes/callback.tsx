import React from 'react'
import { Loader, json } from '@remix-run/data'
import { useRouteData } from '@remix-run/react'
import admin from 'firebase-admin'
import firebase from 'firebase/app'
import 'firebase/auth'
import spotifyClient from '../spotify/spotifyClient'
import { getSession } from '../sessions'

interface Auth {
  spotifyUserID: string
  displayName: string
  photoURL: string
  email: string
  accessToken: string
  refreshToken: string
}

async function createFirebaseAccount(auth: Auth) {
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
  const token = await admin.auth().createCustomToken(uid)
  console.log('Created Custom token for UID "', uid, '" Token:', token)
  return token
}

export const loader: Loader = async ({ request }): Promise<unknown> => {
  const session = await getSession(request.headers.get('Cookie'))
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  let state = ''
  if (session.has('state')) {
    state = session.get('state')
  }

  try {
    if (code) {
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

      const firebaseToken = await createFirebaseAccount(auth)

      return json({ state, token: firebaseToken })
    }
  } catch (err) {
    return json({ err })
  }
}

export default function Callback(): JSX.Element {
  const data = useRouteData()

  React.useEffect(() => {
    firebase.auth().signInWithCustomToken(data.token)
  }, [data.token])

  if (data.err) {
    return (
      <div>
        <h2>Callback Err</h2>
        <p>{JSON.stringify(data.err)}</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Callback</h2>
      <p>{data.state}</p>
    </div>
  )
}
