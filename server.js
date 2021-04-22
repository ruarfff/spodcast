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
    getLoadContext(req) {
      // Whatever you return here will be passed as `context` to your loaders
      // and actions.
      return { req }
    }
  })
);

module.exports = app
