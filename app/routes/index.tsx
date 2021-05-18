import { MetaFunction } from 'remix'

export const meta: MetaFunction = () => {
  return {
    title: 'Spodcast',
    description: 'Manage your Spotify podcasts',
  }
}

export default function Index(): JSX.Element {
  return (
    <div>
      <h1>Hello</h1>
      <a href="/shows">Shows</a>
    </div>
  )
}
