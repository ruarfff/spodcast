import React from 'react'
import type { Loader } from '@remix-run/data'
import { json } from '@remix-run/data'
import { useRouteData } from '@remix-run/react'

interface Gist {
  id: string
  html_url: string
  files: {
    [fileName: string]: {
      filename: string
      type: string
      language: string
      raw_url: string
      size: number
    }
  }
}

// Load data for this route and define some caching headers so that when the
// user navigates here multiple times it won't make the request more than once
// per 300 seconds
export const loader: Loader = async () => {
  const res = await fetch('https://api.github.com/gists')
  return json(await res.json(), {
    headers: {
      'Cache-Control': 'max-age=300',
    },
  })
}

// The title and meta tags for the document's <head>
export function meta({
  data,
}: {
  data: Gist[]
}): { title: string; description: string } {
  return {
    title: 'Public Gists',
    description: `View the latest ${data.length} gists from the public`,
  }
}

// The HTTP headers for the server rendered request, just use the cache control
// from the loader.
export function headers({
  loaderHeaders,
}: {
  loaderHeaders: Headers
}): { 'Cache-Control': string | null } {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control'),
  }
}

export default function Gists(): JSX.Element {
  // useRouteData supports TypeScript generics so you can say what this hook
  // returns
  const data = useRouteData<Gist[]>()
  return (
    <div className="prose prose-indigo" role="list">
      <div>
        <a href="/gists/new">New Gist</a>
      </div>
      <h2>Public Gists</h2>
      <ul className="list-disc list-inside">
        {data.map((gist) => (
          <li key={gist.id}>
            <a href={gist.html_url}>{Object.keys(gist.files)[0]}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
