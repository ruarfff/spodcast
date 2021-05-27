import { json, LoaderFunction, MetaFunction, useRouteData } from 'remix'
import { requireUser } from '../sessions.server'
import { User } from '../user'

export const meta: MetaFunction = () => {
  return {
    title: 'Spodcast',
    description: 'Manage your Spotify podcasts',
  }
}

export const loader: LoaderFunction = ({ request }) => {
  return requireUser(request)((userSession: { user: User }) => {
    return json(userSession)
  })
}

export default function Dashboard(): JSX.Element {
  const data = useRouteData()

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hello {data.user.displayName}</p>
    </div>
  )
}
