const express = require('express')
const compression = require('compression')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const { createRequestHandler } = require('@remix-run/express')

let app = express()

app.use(compression())
app.use(express.static('public'))
app.use(cookieParser())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.all(
  "*",
  createRequestHandler({
    build: require("./build"),
    getLoadContext() {
      // Whatever you return here will be passed as `context` to your loaders
      // and actions.
    }
  })
);

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express server started on http://localhost:${port}`);
});

module.exports = app
