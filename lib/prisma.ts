import { PrismaClient } from '@prisma/client'
import * as mockData from './mock-data'

// ─── MOCK PRISMA CLIENT ────────────────────────────────────────────────────────
// Used only as fallback when no DATABASE_URL is configured (pure demo mode).
const createMockModel = (mockArray: any[], singleMock: any) => ({
  findMany: async (args?: any) => {
    if (!mockArray) return []
    if (!args?.where) return mockArray
    return mockArray.filter((item: any) =>
      Object.entries(args.where).every(([k, v]) => item[k] === v)
    )
  },
  findFirst: async (args?: any) => {
    if (!mockArray) return singleMock || null
    if (!args?.where) return singleMock || mockArray[0] || null
    return mockArray.find((item: any) =>
      Object.entries(args.where).every(([k, v]) => item[k] === v)
    ) ?? null
  },
  findUnique: async (args?: any) => {
    if (!mockArray) return singleMock || null
    if (!args?.where) return singleMock || mockArray[0] || null
    return mockArray.find((item: any) =>
      Object.entries(args.where).every(([k, v]) => item[k] === v)
    ) ?? null
  },
  count: async (args?: any) => {
    if (!mockArray) return 0
    if (!args?.where) return mockArray.length
    return mockArray.filter((item: any) =>
      Object.entries(args.where).every(([k, v]) => {
        if (v && typeof v === 'object' && 'not' in v) return item[k] !== (v as any).not
        return item[k] === v
      })
    ).length
  },
  groupBy: async () => [],
  create: async (data: any) => ({ id: 'mock-id', ...data?.data }),
  update: async (data: any) => ({ id: 'mock-id', ...data?.data }),
  upsert: async (data: any) => ({ id: 'mock-id', ...data?.create }),
  delete: async () => ({ id: 'mock-id' }),
  deleteMany: async () => ({ count: 0 }),
})

const mockPrismaClient = {
  brokerProfile: createMockModel([mockData.mockBroker], mockData.mockBroker),
  property: createMockModel(mockData.mockProperties, mockData.mockProperties[0]),
  neighborhood: createMockModel(mockData.mockNeighborhoods, mockData.mockNeighborhoods[0]),
  testimonial: createMockModel(mockData.mockTestimonials, mockData.mockTestimonials[0]),
  insight: createMockModel(mockData.mockInsights, mockData.mockInsights[0]),
  mediaMention: createMockModel(mockData.mockMedia, mockData.mockMedia[0]),
  award: createMockModel([], null),
  lead: createMockModel([], null),
  newsletterSubscriber: createMockModel([], null),
  category: createMockModel([{ id: 'c1', name: 'Market Trends', slug: 'market-trends' }], { id: 'c1', name: 'Market Trends', slug: 'market-trends' }),
  propertyImage: createMockModel([], null),
  user: createMockModel([{
    id: 'admin-id',
    email: 'admin@alexandravoss.com',
    name: 'Alexandra Voss',
    role: 'SUPER_ADMIN',
    passwordHash: '$2b$12$XG1O/Zp/LwZTTU9CUckVV.AyLggHLypvYtE4pUKptK3KezCgx6gN6'
  }], {
    id: 'admin-id',
    email: 'admin@alexandravoss.com',
    name: 'Alexandra Voss',
    role: 'SUPER_ADMIN',
    passwordHash: '$2b$12$XG1O/Zp/LwZTTU9CUckVV.AyLggHLypvYtE4pUKptK3KezCgx6gN6'
  }),
  $connect: async () => {},
  $disconnect: async () => {},
  $transaction: async (queries: any[]) => Promise.all(queries.map(q => typeof q === 'function' ? q(mockPrismaClient) : q)),
}

// ─── REAL PRISMA CLIENT ────────────────────────────────────────────────────────
const dbUrl = process.env.DATABASE_URL

const isRealDatabase =
  !!dbUrl &&
  !dbUrl.includes('[PASSWORD]') &&
  !dbUrl.includes('[PROJECT-REF]')

// Singleton stored on globalThis to survive hot reloads in dev
const globalForPrisma = globalThis as unknown as { _prismaClient?: PrismaClient }

function getOrCreatePrismaClient(): PrismaClient {
  if (globalForPrisma._prismaClient) {
    return globalForPrisma._prismaClient
  }

  const client = new PrismaClient({
    datasources: { db: { url: dbUrl } },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

  // Pre-warm the connection so first page load doesn't cold-start timeout
  client.$connect().catch((err) => {
    console.warn('[Prisma] Initial connection warmup failed (will retry on first query):', err?.message)
  })

  globalForPrisma._prismaClient = client
  return client
}

export const prisma: PrismaClient = isRealDatabase
  ? getOrCreatePrismaClient()
  : (mockPrismaClient as unknown as PrismaClient)
