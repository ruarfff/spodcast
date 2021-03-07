import React from 'react'
import type { LinksFunction, LoaderFunction } from '@remix-run/react'
import { Meta, Links, Scripts, useRouteData } from '@remix-run/react'
import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import firebase from 'firebase/app'
import 'firebase/auth'

import tailwind from 'css:./styles/tailwind.css'
import styles from 'css:./styles/global.css'

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: tailwind },
    { rel: 'stylesheet', href: styles },
  ]
}

export const loader: LoaderFunction = async () => {
  if (process.env.NODE_ENV !== 'production') {
    const config = {
      apiKey: process.env.SPODCAST_FB_API_KEY,
      authDomain: process.env.SPODCAST_FB_AUTH_DOMAIN,
      projectId: process.env.SPODCAST_PROJECT_ID,
      storageBucket: process.env.SPODCAST_STORAGE_BUCKET,
      messagingSenderId: process.env.SPODCAST_MESSAGING_SENDER,
      appId: process.env.SPODCAST_APP_ID,
      measurementId: process.env.SPODCAST_MEASUREMENT_ID,
    }

    return { config, date: new Date() }
  }

  return { date: new Date() }
}

export default function App(): JSX.Element {
  const [fireApp, setFireApp] = React.useState<firebase.app.App>()
  const [user, setUser] = React.useState<firebase.User>()

  const data = useRouteData()

  React.useEffect(() => {
    if (data.config) {
      setFireApp(firebase.initializeApp(data.config))
    } else {
      fetch(`/__/firebase/init.json`).then((result): void => {
        setFireApp(firebase.initializeApp(result.json()))
      })
    }
  }, [])

  React.useEffect(() => {
    if (fireApp) {
      try {
        const auth = firebase.auth()

        auth.onAuthStateChanged(() => {
          if (auth.currentUser) {
            setUser(auth.currentUser)
          } else {
            setUser(undefined)
          }
        })
      } catch (err) {
        console.error(err)
      }
    }
  }, [fireApp])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="container mx-auto">
          {fireApp ? <p>Initialised</p> : <p>Not initialised</p>}
          {user ? <p>{JSON.stringify(user)}</p> : <p>Not logged in</p>}
          {fireApp ? <Outlet /> : <p>loading</p>}
        </div>

        <footer>
          <div>
            <a href="/login">Login</a>
          </div>
          <div>
            <Link to="/gists">Gists</Link>
          </div>
          <div>
            <Link to="/team">Team</Link>
          </div>
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
        <title>Oops!</title>
      </head>
      <body>
        <div>
          <h1>App Error</h1>
          <pre>{error.message}</pre>
          <p>
            Replace this UI with what you want users to see when your app throws
            uncaught errors. The file is at <code>app/App.tsx</code>.
          </p>
        </div>

        <Scripts />
      </body>
    </html>
  )
}
