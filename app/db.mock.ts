import type { PrismaClient } from '@prisma/client'
import { mockDeep, MockProxy, mockReset } from 'jest-mock-extended'
import prisma from './db'

jest.mock('./db', () => ({

    __esModule: true,

    default: mockDeep<PrismaClient>(),

}))

beforeEach(() => {

    mockReset(prismaMock)

})

export const prismaMock = (prisma as unknown) as MockProxy<PrismaClient>
