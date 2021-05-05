import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { useRouteData } from "remix";

export const meta: MetaFunction = () => {
  return {
    title: 'Spodcast',
    description: 'Manage your Spotify podcasts',
  }
}

export const loader: LoaderFunction = async () => {
  return { message: 'this is awesome 😎' }
}

export default function Index(): JSX.Element {
  const data = useRouteData()

  return (
    <div style={{ textAlign: 'center', padding: 20 }} className="bg-green-500">
      <h2>Welcome to Remix!</h2>
      <p>
        <a href="https://remix.run/dashboard/docs">Check out the docs</a> to get
        started.
      </p>
      <p>Message from the loader: {data.message}</p>
    </div>
  )
}
