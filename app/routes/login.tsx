import type { LoaderFunction } from "remix";
import { redirect} from "remix";
import crypto from 'crypto'
import spotifyClient from '../spotify/spotifyClient'
import { getSession, commitSession } from '../sessions'

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))
  let state = ''
  if (session.has('state')) {
    state = session.get('state')
  } else {
    state = crypto.randomBytes(20).toString('hex')
    session.set('state', state)
  }

  const scopes = ['user-read-private', 'user-read-email']
  const authorizeURL = spotifyClient.createAuthorizeURL(
    scopes,
    state.toString()
  )

  return redirect(authorizeURL, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export default function Login(): JSX.Element {
  return <div></div>
}
