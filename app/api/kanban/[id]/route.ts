import { prisma } from '@/prisma/prisma'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const kanban = await prisma.kanban.findUnique({
      where: { id: Number(id) }
    })

    if (!kanban) {
      return NextResponse.json({ error: 'Kanban not found' }, { status: 404 })
    }

    return NextResponse.json(kanban)
  } catch (err) {
    return NextResponse.json({ error: 'Fetch failed', details: err }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json();
    const { title, columns, blocks, style } = body

    const updateData: any = {}
    if (title) updateData.title = title
    if (columns) updateData.columns = JSON.stringify(columns)
    if (blocks) updateData.blocks = JSON.stringify(blocks)
    if (style) updateData.style = JSON.stringify(style)

    const updatedKanban = await prisma.kanban.update({
      where: { id: Number(id) },
      data: updateData
    })

    return NextResponse.json(updatedKanban)
  } catch (err) {
    return NextResponse.json({ error: 'Update failed', details: err }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.kanban.delete({
      where: { id: Number(id) }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Delete failed', details: err }, { status: 400 })
  }
}