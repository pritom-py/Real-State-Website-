import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional().default(''),
  interest: z.enum(['BUYING', 'SELLING', 'VALUATION', 'GENERAL', 'CONSULTATION']),
  propertyId: z.string().optional(),
  propertyAddress: z.string().optional().default(''),
  message: z.string().optional().default(''),
  preferredContact: z.string().optional().default('email'),
  source: z.string().optional().default('website'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Sanitize inputs to prevent XSS
    const sanitize = (str: string) => str.replace(/<[^>]*>/g, '').trim()
    const sanitized = {
      ...body,
      name: sanitize(body.name ?? ''),
      message: sanitize(body.message ?? ''),
      propertyAddress: sanitize(body.propertyAddress ?? ''),
    }

    const parsed = leadSchema.safeParse(sanitized)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
    }

    const lead = await prisma.lead.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        interest: parsed.data.interest,
        propertyId: parsed.data.propertyId,
        propertyAddress: parsed.data.propertyAddress,
        message: parsed.data.message,
        preferredContact: parsed.data.preferredContact,
        source: parsed.data.source,
        status: 'NEW',
      },
    })

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 })
  } catch (error) {
    console.error('Lead creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Only accessible via admin routes — this API should be protected
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
