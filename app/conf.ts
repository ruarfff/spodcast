export interface SpotifyConfiguration {
  clientId: string | undefined
  clientSecret: string | undefined
  redirectUri: string | undefined
}

export function getSpotifyConfiguration(): SpotifyConfiguration {
  return {
    clientId: process.env.SPODCAST_AUTH_CLIENT_ID,
    clientSecret: process.env.SPODCAST_AUTH_CLIENT_SECRET,
    redirectUri: process.env.SPODCAST_AUTH_REDIRECT_URL,
  }
}

export function getSessionSecret(): string {
  return process.env.SPODCAST_SESSION_SECRET || 'r3m1xr0ck5'
}
