import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { LoaderFunction } from 'remix'
import { json, useRouteData } from 'remix'
import { getFirebaseTokenFromAuthCode } from '../firebase/firebaseLoader.server'
import { getSession } from '../sessions'
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
  } catch (err) {
    return json({ err })
  }
}

export default function Callback(): JSX.Element {
  const data = useRouteData()
  const navigate = useNavigate()

  React.useEffect(() => {
    const handleCallback = async () => {
      if (data.token) {
        await login(data.token)
        navigate('/')
      }
    }

    handleCallback()
  }, [data.token])

  if (data.err) {
    return (
      <div>
        <h2>Callback Err</h2>
        <p>{JSON.stringify(data.err)}</p>
      </div>
    )
  }

  return <h2>Logging in</h2>
}
