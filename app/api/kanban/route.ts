import { prisma } from '@/prisma/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const kanbans = await prisma.kanban.findMany({ 
      include: { user: true } 
    })
    return NextResponse.json(kanbans)
  } catch (err) {
    return NextResponse.json({ error: 'Fetch failed', details: err }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, columns, blocks, style, userId } = body
    
    if (!title || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newKanban = await prisma.kanban.create({
      data: {
        title,
        userId,
        ...(columns && { columns: JSON.stringify(columns) }),
        ...(blocks && { blocks: JSON.stringify(blocks) }),
        ...(style && { style: JSON.stringify(style) }),
      }
    })

    return NextResponse.json(newKanban, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Create failed', details: err }, { status: 400 })
  }
}