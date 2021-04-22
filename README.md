# Spodcast

Spotify podcast manager because the Spotify desktop podcast management experience is not amazing.

## Development

Because I like to blow money I am using [remix](https://remix.run). This unfortunately means you need to have a remix license to build this and you need to set your remix registry token in an environment variable called `REMIX_REGISTRY_TOKEN`.

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

## Documentation

Detailed documentation for Remix [is available at remix.run](https://remix.run/dashboard/docs).
