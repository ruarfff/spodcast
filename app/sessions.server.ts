import type { Request } from 'node-fetch'
import { redirect } from 'remix'
import { commitSession, getSession } from './sessions'
import { getUser } from './user'

export async function createUserSession(uid: string): Promise<string> {
  const session = await getSession()
  session.set('uid', uid)
  return commitSession(session, { maxAge: 604_800 })
}

export async function getUserSession(request: Request) {
  const cookieSession = await getSession(request.headers.get('Cookie'))
  const uid = cookieSession.get('uid')
  if (!uid) return null
  return { uid }
}

export const requireUser = (request: Request) => {
  return async (loader: any) => {
    const sessionUser = await getUserSession(request)
    if (!sessionUser) return redirect('/login')

    const user = getUser(sessionUser.uid)

    return loader(user)
  }
}
