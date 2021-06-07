import SpotifyWebApi from 'spotify-web-api-node'
import { getSpotifyConfiguration } from '../conf'
import { getAuth, setAuth } from '../db'
import { Auth } from './types'

const { clientId, clientSecret, redirectUri } = getSpotifyConfiguration()

export const getSpotifyClient = async (uid: string): Promise<SpotifyWebApi> => {
  const spotifyClient = new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri,
  })

  const auth = getAuth(uid)

  if (auth) {

    if (auth?.expiresAt < Date.now()) {
      const params = {
        grant_type: 'refresh_token',
        refresh_token: auth?.refreshToken,
      }

      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: new URLSearchParams(params),
        headers: {
          'Authorization': `Basic ${Buffer.from(
            clientId + ':' + clientSecret
          ).toString('base64')}`
        }
      })
      const updatedAuth = await res.json()
      const accessToken = updatedAuth['access_token']
      const expiresAt = Date.now() + updatedAuth['expires_in'] * 1000
      const expiresIn = updatedAuth['expires_in']

      setAuth(uid, { ...auth, accessToken, expiresAt, expiresIn })
      spotifyClient.setAccessToken(accessToken)
    } else {
      spotifyClient.setAccessToken(auth?.accessToken)
    }
  } else {
    console.log('Nooo')
  }

  return spotifyClient
}

export const loginSpotify = async (code: string): Promise<Auth> => {
  const spotifyClient = new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri,
  })

  const { body } = await spotifyClient.authorizationCodeGrant(code)
  const accessToken = body['access_token']
  const refreshToken = body['refresh_token']
  const expiresAt = Date.now() + body['expires_in'] * 1000
  const expiresIn = body['expires_in']

  spotifyClient.setAccessToken(accessToken)
  const meRes = await spotifyClient.getMe()

  return { accessToken, refreshToken, expiresAt, expiresIn, spotifyUser: meRes.body }
}

export const createAuthorizeURL = (scopes: string[], state: string): string => {
  if (!redirectUri) {
    throw new Error('Redirect URI required')
  }
  return `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}${scopes ? '&scope=' + encodeURIComponent(scopes.join(' ')) : ''}&redirect_uri=${encodeURIComponent(redirectUri || '')}&state=${state}`;
}

export const getShows = async (uid: string): Promise<any> => {
  const client = await getSpotifyClient(uid)

  const { body } = await client.getMySavedShows()

  return body
}
