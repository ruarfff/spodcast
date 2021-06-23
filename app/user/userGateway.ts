import prisma from '../db'
import type { User } from './types'

export async function createUser(user: User): Promise<User> {
    return await prisma.user.create({
        data: user,
        include: {
            Auth: true
        }
    })
}

export async function getUser(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    })

    if (!user) {
        throw new Error('User not found')
    }

    return user
}
