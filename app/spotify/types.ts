export type Image = {
  url: string
  height: number
  width: number
}

// https://developer.spotify.com/documentation/web-api/reference/#object-simplifiedshowobject
export type Show = {
  id: string
  name: string
  description: string
  publisher: string
  images: Image[]
  total_episodes: string
  uri: string
  media_type: string
}
