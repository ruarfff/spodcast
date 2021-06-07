import type { Auth } from './spotify'
import { User } from './user'

const authData = new Map<string, Auth>()
const userData = new Map<string, User>()


export function getAuth(uid: string): Auth | undefined {
    return authData.get(uid)
}


export function setAuth(uid: string, auth: Auth): void {
    authData.set(uid, auth)
}

export function getUser(uid: string): User | undefined {
    return userData.get(uid)
}

export function setUser(user: User): void {
    userData.set(user.uid, user)
}
