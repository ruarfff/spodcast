import type { LoaderFunction, MetaFunction } from 'remix'
import { json, useRouteData } from 'remix'
import ShowCard from '../components/ShowCard'
import { getSession } from '../sessions'
import type { Show } from '../spotify'
import { getShows } from '../spotify/spotifyClient.server'

export const meta: MetaFunction = () => {
  return {
    title: 'Spodcast: Shows',
    description: 'Your Shows'
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

export default function Tracks(): JSX.Element {
  const data = useRouteData()

  return (
    <div>
      <h1>Hello</h1>
      {data.items.map((item: { show: Show }) => (
        <ShowCard show={item.show}></ShowCard>
      ))}
    </div>
  )
}
