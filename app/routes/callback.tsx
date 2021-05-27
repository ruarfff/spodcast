import React from 'react'
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useRouteData
} from 'remix'
import { getIdToken } from '../firebase/firebase.client'
import { getFirebaseTokenFromAuthCode } from '../firebase/firebase.server'
import { commitSession, getSession } from '../sessions'
import { createUserSession } from '../sessions.server'
import { login } from '../user'

export const loader: LoaderFunction = async ({ request }): Promise<unknown> => {
  const session = await getSession(request.headers.get('Cookie'))
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (session.has('state')) {
    session.unset('state')
  }

  try {
    if (code) {
      const firebaseToken = await getFirebaseTokenFromAuthCode(code)
      return json({ token: firebaseToken })
    }
    throw new Error('No code provided to callback')
  } catch (err) {
    const session = await getSession(request.headers.get('Cookie'))
    session.set('error', err.message)
    const cookie = await commitSession(session)

    return redirect(`/login`, { headers: { 'Set-Cookie': cookie } })
  }
}

export const action: ActionFunction = async ({ request, context }) => {
  const { body } = context.req

  try {
    const cookie = await createUserSession(body.idToken)
    return redirect('/dashboard', {
      headers: {
        'Set-Cookie': cookie,
      },
    })
  } catch (err) {
    const session = await getSession(request.headers.get('Cookie'))
    session.set('error', err.message)
    const cookie = await commitSession(session)

    return redirect(`/login`, { headers: { 'Set-Cookie': cookie } })
  }
}

export default function Callback(): JSX.Element {
  const data = useRouteData()

  React.useEffect(() => {
    const handleCallback = async () => {
      if (data.token) {
        const { user } = await login(data.token)
        const idToken = await getIdToken()

        console.log(idToken)

        const res = await fetch('/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: idToken?.toString() || '',
            uid: user?.uid,
          }),
        })
        if (res.redirected) {
          window.location.href = res.url
        }
      }
    }

    handleCallback()
  }, [data.token])

  return <h2>Logging in...</h2>
}
