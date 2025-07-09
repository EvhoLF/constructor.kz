import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const scheme = await prisma.scheme.findUnique({ where: { id: Number(id) } });
  if (!scheme) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(scheme);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json();
    const { title, nodes, edges, formula } = body;
    const updated = await prisma.scheme.update({
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
    await prisma.scheme.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  }
  catch (err) {
    return NextResponse.json({ error: 'Delete failed', details: err }, { status: 400 });
  }
}
