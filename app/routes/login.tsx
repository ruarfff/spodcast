import crypto from 'crypto'
import admin from 'firebase-admin'
import type { ActionFunction, LoaderFunction } from 'remix'
import { redirect } from 'remix'
import { commitSession, getSession } from '../sessions'
import { createAuthorizeURL } from '../spotify/spotifyClient.server'

export async function loadSessionCookie(
  expiresIn: number,
  idToken: string
): Promise<string> {
  const sessionCookie = await admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })

  return sessionCookie
}

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
  const authorizeURL = createAuthorizeURL(scopes, state.toString())

  return redirect(authorizeURL, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export const action: ActionFunction = async ({ request, context }) => {
  const session = await getSession(request.headers.get('Cookie'))
  const { body } = context.req
  const expiresIn = 60 * 60 * 24 * 5 * 1000

  const sessionCookie = await loadSessionCookie(expiresIn, body.idToken)
  session.set('fsession', sessionCookie)
  session.set('uid', body.uid)

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export default function Login(): JSX.Element {
  return <div></div>
}
