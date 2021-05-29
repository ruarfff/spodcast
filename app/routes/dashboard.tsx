import { json, LoaderFunction, MetaFunction, useRouteData } from 'remix'
import ShowCard from '../components/ShowCard'
import { requireUser } from '../sessions.server'
import { Show } from '../spotify'
import { getShows } from '../spotify/spotifyClient.server'
import { User } from '../user'

export const meta: MetaFunction = () => {
  return {
    title: 'Spodcast',
    description: 'Manage your Spotify podcasts'
  }
}

export const loader: LoaderFunction = ({ request }) => {
  return requireUser(request)(async (user: User) => {
    let error = null
    try {
      const shows = await getShows(user.uid)
      return json({ user, shows })
    } catch (err) {
      error = err
      console.log(err)
    }
    return json({ user, error })
  })
}

export default function Dashboard(): JSX.Element {
  const data = useRouteData()

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hello {data.user.displayName}</p>

      {data.shows &&
        data.shows.items.map((item: { show: Show }) => (
          <ShowCard key={item.show.id} show={item.show}></ShowCard>
        ))}
    </div>
  )
}
