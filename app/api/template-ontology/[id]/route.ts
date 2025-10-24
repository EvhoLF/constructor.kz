import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: id_string } = await params;
  const id = parseInt(id_string);
  const item = await prisma.templateOntology.findUnique({ where: { id } });

  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: id_string } = await params;
  const id = parseInt(id_string);
  const body = await req.json();
  const { title, category, nodes, edges } = body;

  const updated = await prisma.templateOntology.update({
    where: { id },
    data: {
      ...(title && { title }), ...(category && { category }),
      ...(nodes && { nodes }), ...(edges && { edges }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: id_string } = await params;
  const id = parseInt(id_string);
  await prisma.templateOntology.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
