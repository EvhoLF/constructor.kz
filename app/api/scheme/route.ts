import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const schemes = await prisma.scheme.findMany({ include: { user: true } });
  return NextResponse.json(schemes);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, nodes = '', edges = '', userId } = body;
    if (!title || !userId) { return NextResponse.json({ error: 'Missing fields' }, { status: 400 }); }
    const newScheme = await prisma.scheme.create({ data: { userId, title, ...(nodes && { nodes }), ...(edges && { edges }), } });
    return NextResponse.json(newScheme, { status: 201 });
  }
  catch (err) {
    console.log(err);
    
    return NextResponse.json({ error: 'Create failed', details: err }, { status: 400 });
  }
}
