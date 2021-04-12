const admin = require('firebase-admin')
const functions = require('firebase-functions')
const appServer = require('../server')

if (process.env.NODE_ENV !== 'production') {
  const serviceAccount = require('../.creds/serviceAccountKey.json')
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
} else {
  admin.initializeApp()
}

const app = functions.https.onRequest(appServer)

exports.app = app
