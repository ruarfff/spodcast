import { json, LoaderFunction, MetaFunction, useRouteData } from 'remix'
import { getSession } from '../sessions'
import { getRecommendations } from '../spotify/spotifyClient.server'

export const meta: MetaFunction = () => {
  return {
    title: 'Spodcast',
    description: 'Manage your Spotify podcasts',
  }
}

export const loader: LoaderFunction = async ({ request }): Promise<unknown> => {
  const session = await getSession(request.headers.get('Cookie'))
  let uid = ''
  if (session.has('uid')) {
    uid = session.get('uid')
    const recs = await getRecommendations(uid)
    return json(recs)
  }
  return json([])
}

export default function Tracks(): JSX.Element {
  const data = useRouteData()

  return (
    <div>
      <h1>Hello</h1>
      <p>{JSON.stringify(data)}</p>
    </div>
  )
}
