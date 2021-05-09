import SpotifyWebApi from 'spotify-web-api-node'
import { getSpotifyConfiguration } from '../conf'

const { clientId, clientSecret, redirectUri } = getSpotifyConfiguration()

const spotifyClient = new SpotifyWebApi({
  clientId,
  clientSecret,
  redirectUri,
})

export const getToken = async (code: string): Promise<any> => {
  const { body } = await spotifyClient.authorizationCodeGrant(code)
  const accessToken = body['access_token']
  const refreshToken = body['refresh_token']
  const expiresAt = Date.now() + body['expires_in'] * 1000
  const expiresIn = body['expires_in']

  return { accessToken, refreshToken, expiresAt, expiresIn }
}

export const createAuthorizeURL = (scopes: string[], state: string): string => {
  return spotifyClient.createAuthorizeURL(scopes, state)
}

export const getCurrentUser = async (token: string): Promise<any> => {
  spotifyClient.setAccessToken(token)
  const meRes = await spotifyClient.getMe()

  return meRes.body
}
