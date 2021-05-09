import { json, LoaderFunction, MetaFunction, useRouteData } from 'remix'
import { getSession } from '../sessions'

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
    return json(uid)
  }
  return json([])
}

export default function Index(): JSX.Element {
  const data = useRouteData()

  return (
    <div>
      <h1>Hello</h1>
      <p>{JSON.stringify(data)}</p>
    </div>
  )
}
