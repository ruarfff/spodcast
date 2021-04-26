import React from 'react'
import type { LinksFunction, LoaderFunction } from '@remix-run/react'
import {
  Meta,
  Links,
  Scripts,
  useRouteData,
  useLiveReload,
} from '@remix-run/react'
import { Outlet } from 'react-router-dom'
import { loadConfigFromEnv } from './firebase/firebaseLoader.server'
import { loadFirebase } from './firebase/firebaseLoader.client'
import { User, watchUserAuth, logout } from './user'

import tailwind from './styles/tailwind.css'
import styles from './styles/global.css'

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: tailwind },
    { rel: 'stylesheet', href: styles },
  ]
}

export const loader: LoaderFunction = async () => {
  let config = null
  if (process.env.NODE_ENV !== 'production') {
    config = loadConfigFromEnv()
  }

  return { config, date: new Date() }
}

export default function App(): JSX.Element {
  useLiveReload()

  const [user, setUser] = React.useState<User>()
  const [loaded, setLoaded] = React.useState<boolean>(false)
  const data = useRouteData()

  React.useEffect(() => {
    const loadApp = async () => {
      const app = await loadFirebase(data.config)
      watchUserAuth(app, setUser)
      setLoaded(true)
    }

    loadApp()
  }, [])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="container mx-auto">
          {user ? (
            <div>
              <div>
                <button
                  onClick={() => {
                    logout()
                  }}
                >
                  Logout
                </button>
              </div>
              <p>Hello {user.displayName}</p>
            </div>
          ) : (
            <div>
              <a href="/login">Login</a>
            </div>
          )}

          {loaded ? <Outlet /> : <h2>Loading...</h2>}
        </div>

        <footer>
          <p>This page was rendered at {data.date.toLocaleString()}</p>
        </footer>
        <Scripts />
      </body>
    </html>
  )
}

export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <title>Oops!</title>
      </head>
      <body>
        <div>
          <h1>App Error</h1>
          <pre>{error.message}</pre>
          <p>Sorry! Something bad happened.</p>
          <a href="/">Go back</a>
        </div>

        <Scripts />
      </body>
    </html>
  )
}
