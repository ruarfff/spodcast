import crypto from 'crypto'
import type { LoaderFunction } from 'remix'
import { redirect } from 'remix'
import { commitSession, getSession } from '../sessions'
import { createAuthorizeURL } from '../spotify/spotifyClient.server'

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))
  let state = ''
  if (session.has('state')) {
    state = session.get('state')
  } else {
    state = crypto.randomBytes(20).toString('hex')
    session.set('state', state)
  }

  const scopes = ['user-read-private', 'user-read-email', 'user-library-read']
  const authorizeURL = createAuthorizeURL(scopes, state.toString())

  return redirect(authorizeURL, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export default function LoginSpotify(): unknown {
  return null
}
