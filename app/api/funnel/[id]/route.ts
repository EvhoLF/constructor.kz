import { prisma } from '@/prisma/prisma'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const funnel = await prisma.funnel.findUnique({
      where: { id: Number(id) }
    })

    if (!funnel) {
      return NextResponse.json({ error: 'Funnel not found' }, { status: 404 })
    }

    return NextResponse.json(funnel)
  } catch (err) {
    return NextResponse.json({ error: 'Fetch failed', details: err }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json();
    const { title, blocks, layoutMode, styleMode, textAlign, toggles, blockWidth, blockHeight } = body

    const updateData: any = {}
    if (title) updateData.title = title
    if (blocks) updateData.blocks = JSON.stringify(blocks)
    if (layoutMode) updateData.layoutMode = layoutMode
    if (styleMode) updateData.styleMode = styleMode
    if (textAlign) updateData.textAlign = textAlign
    if (toggles) updateData.toggles = JSON.stringify(toggles)
    if (blockWidth) updateData.blockWidth = blockWidth
    if (blockHeight) updateData.blockHeight = blockHeight

    const updatedFunnel = await prisma.funnel.update({
      where: { id: Number(id) },
      data: updateData
    })

    return NextResponse.json(updatedFunnel)
  } catch (err) {
    return NextResponse.json({ error: 'Update failed', details: err }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.funnel.delete({
      where: { id: Number(id) }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Delete failed', details: err }, { status: 400 })
  }
}