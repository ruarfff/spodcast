import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/analytics'
import FirebaseConfig from './FirebaseConfig'

export async function loadFirebase(
  config: FirebaseConfig | null
): Promise<firebase.app.App> {
  let app = null
  if (config) {
    app = firebase.initializeApp(config)
  } else {
    const result = await fetch(`/__/firebase/init.json`)

    app = firebase.initializeApp(result.json())
  }
  firebase.analytics()

  return app
}
