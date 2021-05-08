import type { LinksFunction, LoaderFunction } from '@remix-run/react'
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  useRouteData
} from '@remix-run/react'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { loadFirebase } from './firebase/firebaseLoader.client'
import { loadConfigFromEnv } from './firebase/firebaseLoader.server'
import tailwind from './styles/tailwind.css'
import { logout, User, watchUserAuth } from './user'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: tailwind }]
}

export const loader: LoaderFunction = async () => {
  let config = null
  if (process.env.NODE_ENV !== 'production') {
    config = loadConfigFromEnv()
  }

  return { config, date: new Date() }
}

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

export default function App(): JSX.Element {
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
    <Document>
      <div className="container mx-auto dark:bg-black">
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
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
  return (
    <Document>
      <div>
        <h1>App Error</h1>
        <pre>{error.message}</pre>
        <p>Sorry! Something bad happened.</p>
        <a href="/">Go back</a>
      </div>
    </Document>
  )
}
