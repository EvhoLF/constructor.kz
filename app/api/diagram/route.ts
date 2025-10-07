import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const diagram = await prisma.diagram.findMany({ include: { user: true } });
  return NextResponse.json(diagram);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, nodes = '', edges = '', userId } = body;
    if (!title || !userId) { return NextResponse.json({ error: 'Missing fields' }, { status: 400 }); }
    const newDiagram = await prisma.diagram.create({ data: { userId, title, ...(nodes && { nodes }), ...(edges && { edges }), } });
    return NextResponse.json(newDiagram, { status: 201 });
  }
  catch (err) {
    return NextResponse.json({ error: 'Create failed', details: err }, { status: 400 });
  }
}
