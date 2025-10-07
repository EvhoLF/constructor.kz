import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const formulaDiagram = await prisma.diagramFormula.findMany({ include: { user: true } });
  return NextResponse.json(formulaDiagram);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, nodes = '', edges = '', userId } = body;
    if (!title || !userId) { return NextResponse.json({ error: 'Missing fields' }, { status: 400 }); }
    const newFormulaDiagram = await prisma.diagramFormula.create({ data: { userId, title, ...(nodes && { nodes }), ...(edges && { edges }), } });
    return NextResponse.json(newFormulaDiagram, { status: 201 });
  }
  catch (err) {
    return NextResponse.json({ error: 'Create failed', details: err }, { status: 400 });
  }
}
