const admin = require('firebase-admin')
const functions = require('firebase-functions')
const appServer = require('../server')

if (process.env.NODE_ENV !== 'production') {
  const serviceAccount = require('../.creds/serviceAccountKey.json')
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
} else {
  // Double parse because we store a JSON string which again gets wrapped in quotes
  const serviceAccount = JSON.parse(JSON.parse(functions.config().spodcast.sa))
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

const app = functions.https.onRequest(appServer)

exports.app = app
