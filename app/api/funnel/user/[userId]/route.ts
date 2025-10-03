import { checkAccessFetch } from '@/libs/checkAccessFetch'
import { ErrorWithStatus } from '@/libs/ErrorWithStatus'
import { prisma } from '@/prisma/prisma'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params
    const requestedUserId = Number(userId)

    const res = await checkAccessFetch(requestedUserId)
    
    const funnels = await prisma.funnel.findMany({
      where: { userId: requestedUserId }
    })

    return NextResponse.json(funnels)
  } catch (err) {
    if (err instanceof ErrorWithStatus) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}