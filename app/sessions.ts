import { createCookieSessionStorage } from '@remix-run/node'
import { getSessionSecret } from './conf'

const {
  getSession,
  commitSession,
  destroySession,
} = createCookieSessionStorage({
  cookie: {
    name: '__session',
    secrets: [getSessionSecret()],
    maxAge: 3600000,
    secure: true,
    httpOnly: true,
  },
})

export { getSession, commitSession, destroySession }
