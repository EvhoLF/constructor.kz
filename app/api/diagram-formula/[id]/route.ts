import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const formulaDiagram = await prisma.diagramFormula.findUnique({ where: { id: Number(id) } });
  if (!formulaDiagram) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(formulaDiagram);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json();
    const { title, nodes, edges, formula } = body;
    const updated = await prisma.diagramFormula.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }), ...(formula && { formula }),
        ...(nodes && { nodes }), ...(edges && { edges }),
      }
    });
    return NextResponse.json(updated);
  }
  catch (err) {
    return NextResponse.json({ error: 'Update failed', details: err }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.diagramFormula.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  }
  catch (err) {
    return NextResponse.json({ error: 'Delete failed', details: err }, { status: 400 });
  }
}
