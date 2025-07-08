import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const item = await prisma.nodeTemplate.findUnique({ where: { id } });

  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await req.json();
  const { title, category, nodes, edges } = body;

  const updated = await prisma.nodeTemplate.update({
    where: { id },
    data: {
      ...(title && { title }), ...(category && { category }),
      ...(nodes && { nodes }), ...(edges && { edges }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  await prisma.nodeTemplate.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
