import functions from 'firebase-functions'
export interface SpotifyConfiguration {
  clientId: string | undefined
  clientSecret: string | undefined
  redirectUri: string | undefined
}

export function getSpotifyConfiguration(): SpotifyConfiguration {
  if (process.env.NODE_ENV !== 'production') {
    return {
      clientId: process.env.SPODCAST_AUTH_CLIENT_ID,
      clientSecret: process.env.SPODCAST_AUTH_CLIENT_SECRET,
      redirectUri: process.env.SPODCAST_AUTH_REDIRECT_URL,
    }
  }
  return {
    clientId: functions.config().spodcast.spotify.client,
    clientSecret: functions.config().spodcast.spotify.secret,
    redirectUri: functions.config().spodcast.spotify.redirect,
  }
}

export function getSessionSecret(): string {
  if (process.env.NODE_ENV !== 'production') {
    return process.env.SPODCAST_SESSION_SECRET || 'r3m1xr0ck5'
  }
  return functions.config().spodcast.session.secret
}
