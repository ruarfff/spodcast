module.exports = {
  apps: [
    {
      name: 'Firebase',
      script: 'firebase emulators:start',
      watch: ["src/functions.js"],
      watch_options: {
        followSymlinks: false,
      },
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'Remix',
      script: 'remix run3',
      ignore_watch: ['.'],
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
}
