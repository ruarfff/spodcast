import React from 'react'
import { Outlet } from 'react-router-dom'
import type { LinksFunction, LoaderFunction } from 'remix'
import { Links, LiveReload, Meta, Scripts, useRouteData } from 'remix'
import { loadConfigFromEnv } from './firebase/firebase.server'
import { loadFirebase } from './firebase/firebase.client'
import styles from './styles/app.css'
import tailwind from './styles/tailwind.css'

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

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-black text-gray-300 min-h-screen p-10">
        {children}
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

export default function App(): JSX.Element {
  const [loaded, setLoaded] = React.useState<boolean>(false)
  const data = useRouteData()

  React.useEffect(() => {
    const loadApp = async () => {
      await loadFirebase(data.config)
      setLoaded(true)
    }

    loadApp()
  }, [])

  return (
    <Document>
      <div className="container mx-auto dark:bg-black">
        {loaded ? <Outlet /> : <h2>Loading...</h2>}
      </div>
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
