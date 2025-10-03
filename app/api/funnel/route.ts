import { prisma } from '@/prisma/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const funnels = await prisma.funnel.findMany({ 
      include: { user: true } 
    })
    return NextResponse.json(funnels)
  } catch (err) {
    return NextResponse.json({ error: 'Fetch failed', details: err }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, blocks, layoutMode, styleMode, textAlign, toggles, blockWidth, blockHeight, userId } = body
    
    if (!title || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newFunnel = await prisma.funnel.create({
      data: {
        title,
        userId,
        ...(blocks && { blocks: JSON.stringify(blocks) }),
        ...(layoutMode && { layoutMode }),
        ...(styleMode && { styleMode }),
        ...(textAlign && { textAlign }),
        ...(toggles && { toggles: JSON.stringify(toggles) }),
        ...(blockWidth && { blockWidth }),
        ...(blockHeight && { blockHeight }),
      }
    })

    return NextResponse.json(newFunnel, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Create failed', details: err }, { status: 400 })
  }
}