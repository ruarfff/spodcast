import type { LoaderFunction, MetaFunction } from 'remix'
import { json, useRouteData } from 'remix'
import { getSession } from '../sessions'
import { getShows } from '../spotify/spotifyClient.server'

export const meta: MetaFunction = () => {
  return {
    title: 'Spodcast: Shows',
    description: 'Your Shows',
  }
}

export const loader: LoaderFunction = async ({ request }): Promise<unknown> => {
  const session = await getSession(request.headers.get('Cookie'))
  let uid = ''
  if (session.has('uid')) {
    uid = session.get('uid')
    const recs = await getShows(uid)
    return json(recs)
  }
  return json([])
}

type Image = {
  url: string
  height: number
  width: number
}

// https://developer.spotify.com/documentation/web-api/reference/#object-simplifiedshowobject
type Show = {
  id: string
  name: string
  description: string
  publisher: string
  images: Image[]
  total_episodes: string
  uri: string
  media_type: string
}

const CoverImage = ({ images, alt }: { images: Image[]; alt: string }) => {
  const n = images.length
  let small = ''
  let srcSet = ''
  for (let i = n - 1; i >= 0; i--) {
    const img = images[i]
    if (i == n - 1) {
      small = img.url
    }
    srcSet += `${img.url} ${img.width}w${i > 0 ? ', ' : ''}`
  }

  return (
    <img
      className="h-48 w-full object-cover md:w-48"
      src={small}
      srcSet={srcSet}
      alt={alt}
    />
  )
}

const Card = ({ show }: { show: Show }) => {
  return (
    <div
      key={show.id}
      className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl"
    >
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <CoverImage images={show.images} alt={show.name} />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {show.name}
          </div>
          <a
            href="#"
            className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
          >
            {show.publisher}
          </a>
          <p className="mt-2 text-gray-500">{show.description}</p>
        </div>
      </div>
    </div>
  )
}

export default function Tracks(): JSX.Element {
  const data = useRouteData()

  return (
    <div>
      <h1>Hello</h1>
      {data.items.map((item: { show: Show }) => (
        <Card show={item.show}></Card>
      ))}
    </div>
  )
}
