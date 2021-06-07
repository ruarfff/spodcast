import { LoaderFunction, redirect } from 'remix'
import { setAuth, setUser } from '../db'
import { commitSession, getSession } from '../sessions'
import { createUserSession } from '../sessions.server'
import { loginSpotify } from '../spotify/spotifyClient.server'
import { User } from '../user'

export const loader: LoaderFunction = async ({ request }): Promise<unknown> => {
  const session = await getSession(request.headers.get('Cookie'))
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (session.has('state')) {
    session.unset('state')
  }

  try {
    if (code) {
      const auth = await loginSpotify(code)
      const spotifyUser = auth.spotifyUser
      const uid = spotifyUser['id']
      const photoURL = spotifyUser['images']
        ? spotifyUser['images'][0]['url']
        : ''
      const displayName = spotifyUser['display_name'] || ''
      const email = spotifyUser['email']

      const user: User = {
        uid,
        displayName,
        photoURL,
        email
      }

      setAuth(uid, auth)
      setUser(user)

      const cookie = await createUserSession(uid)
      return redirect('/dashboard', {
        headers: {
          'Set-Cookie': cookie
        }
      })
    }
    throw new Error('No code provided to callback')
  } catch (err) {
    const session = await getSession(request.headers.get('Cookie'))
    session.set('error', err.message)
    const cookie = await commitSession(session)

    return redirect(`/login`, { headers: { 'Set-Cookie': cookie } })
  }
}

export default function Callback() {
  return null
}
