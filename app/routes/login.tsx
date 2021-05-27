
export default function Login(): JSX.Element {
  return (
    <div>
      <a href="/login-spotify">
        <button className="inline-flex items-center h-10 px-5 transition-colors duration-150 border border-green-500 rounded-lg focus:shadow-outline hover:bg-green-500 hover:text-gray-500">
          <span>Login With Spotify</span>
          <img className="w-4 h-4 ml-4" src="https://res.cloudinary.com/ruarfff/image/upload/c_scale,w_64/v1622048514/Spotify_Icon_RGB_Green_o6ocru.png"></img>
        </button>
      </a>
    </div>
  )
}
