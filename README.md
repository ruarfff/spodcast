# Spodcast

Spotify podcast manager because the Spotify desktop podcast management experience is not amazing.

## Development

Because I like to spend money I am using [remix](https://remix.run). This unfortunately means you need to have a remix license to build this and you need to set your remix registry token in an environment variable called `REMIX_REGISTRY_TOKEN`.

Then, install all dependencies using `npm`:

```sh
$ npm install
```

Your `@remix-run/*` dependencies will come from the Remix package registry.

Once everything is installed, start the app in development mode with the following command:

```sh
$ npm start
```

This project uses [firebase](https://firebase.google.com/) fairly heavily and when you run it locally you will end up starting a bunch of firebase emulators.

> As I am writing this I am thinking about the fact that I have not set this up very well. It's very clunky. I will hopefully improve this and document it all better.

Locally I put it in `.creds/` which is gitignored.

## Configuration

### Service Account

- Get a service account in firebase: <https://firebase.google.com/docs/admin/setup#add_firebase_to_your_app>
- Store it in a file in the repo called `.creds/serviceAccountKey.json`

That file is ignored by git. Locally this can be used  to do asmin stuff in firebase.

In prod we load it from a config.



### Spotify

You need to setup a Spotify app at <https://developer.spotify.com/>.

In the [applications dashboard](https://developer.spotify.com/dashboard/applications) you can find the client id, the client secret and you can configured allowed redirect URLs. You will need one redirect for local development i.e. <http://localhost:5000/callback>. You will need another for your production url. Set those values and environment variables:

```bash
export SPODCAST_AUTH_CLIENT_ID="your-client-id"
export SPODCAST_AUTH_CLIENT_SECRET="your-client-secret"
export SPODCAST_AUTH_REDIRECT_URL="http://localhost:3000/callback"
```

Need these configured in firebase to work there:

```bash
firebase functions:config:set spodcast.spotify.client="${SPODCAST_AUTH_CLIENT_ID}"
 spodcast.spotify.secret="${SPODCAST_AUTH_CLIENT_SECRET}" spodcast.spotify.redirect="https://your-firebase-url/callback"
```

### Cookies

```bash
export SPODCAST_SESSION_SECRET="your-secret"
```

```bash
firebase functions:config:set spodcast.session.secret="${SPODCAST_SESSION_SECRET}"
```

### Firebase locally

This project will automatically load the firebase config when deployed. To control the firebase config locally you need to add the firebase configuration values to these environment variables.

```bash
export SPODCAST_FB_API_KEY=""
export SPODCAST_FB_AUTH_DOMAIN=""
export SPODCAST_PROJECT_ID=""
export SPODCAST_STORAGE_BUCKET=""
export SPODCAST_MESSAGING_SENDER=""
export SPODCAST_APP_ID=""
export SPODCAST_MEASUREMENT_ID=""
```

## Documentation

Detailed documentation for Remix [is available at remix.run](https://remix.run/dashboard/docs).
