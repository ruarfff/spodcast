import { Request } from 'node-fetch'
import { redirect } from 'remix'
import {
  getSessionToken,
  getUser,
  verifySessionCookie
} from './firebase/firebase.server'
import { commitSession, getSession } from './sessions'
import { User } from './user'

export async function createUserSession(idToken: string): Promise<string> {
  const token = await getSessionToken(idToken)
  const session = await getSession()
  session.set('token', token)
  return commitSession(session, { maxAge: 604_800 })
}

export async function getUserSession(request: Request) {
  const cookieSession = await getSession(request.headers.get('Cookie'))
  const token = cookieSession.get('token')
  if (!token) return null
  try {
    const tokenUser = await verifySessionCookie(token)
    return tokenUser
  } catch (error) {
    return null
  }
}

export const requireUser = (request: Request) => {
  return async (loader: any) => {
    const sessionUser = await getUserSession(request)
    if (!sessionUser) return redirect('/login')

    const user: User = await getUser(sessionUser.uid)

    return loader(user)
  }
}
