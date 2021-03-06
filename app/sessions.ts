import { createCookieSessionStorage } from '@remix-run/data'

const {
  getSession,
  commitSession,
  destroySession,
} = createCookieSessionStorage({
  cookie: {
    name: '__session',
    maxAge: 3600000,
    secure: true,
    httpOnly: true,
  },
})

export { getSession, commitSession, destroySession }
