import { createCookieSessionStorage } from '@remix-run/node'

const {
  getSession,
  commitSession,
  destroySession,
} = createCookieSessionStorage({
  cookie: {
    name: '__session',
    secrets: ["r3m1xr0ck5"],
    maxAge: 3600000,
    secure: true,
    httpOnly: true,
  },
})

export { getSession, commitSession, destroySession }
