import SpotifyWebApi from 'spotify-web-api-node'

const spotifyClient = new SpotifyWebApi({
  clientId: process.env.SPODCAST_AUTH_CLIENT_ID,
  clientSecret: process.env.SPODCAST_AUTH_CLIENT_SECRET,
  redirectUri: process.env.SPODCAST_AUTH_REDIRECT_URL,
})

export default spotifyClient
