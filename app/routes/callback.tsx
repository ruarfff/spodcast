import React from 'react'
import { LoaderFunction, json } from '@remix-run/node'
import { useRouteData } from '@remix-run/react'
import { useNavigate } from 'react-router-dom'
import { getSession } from '../sessions'
import { login } from '../user'
import { getToken } from '../firebase/firebaseLoader.server'

export const loader: LoaderFunction = async ({ request }): Promise<unknown> => {
  const session = await getSession(request.headers.get('Cookie'))
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  let state = ''
  if (session.has('state')) {
    state = session.get('state')
  }

  try {
    if (code) {
      const firebaseToken = await getToken(code)

      return json({ state, token: firebaseToken })
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
