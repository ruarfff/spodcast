import SpotifyWebApi from 'spotify-web-api-node'
import { getSpotifyConfiguration } from '../conf'

const { clientId, clientSecret, redirectUri } = getSpotifyConfiguration()

const spotifyClient = new SpotifyWebApi({
  clientId,
  clientSecret,
  redirectUri,
})

export default spotifyClient
