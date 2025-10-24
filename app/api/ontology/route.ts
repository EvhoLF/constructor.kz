import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const ontology = await prisma.ontology.findMany({ include: { user: true } });
  return NextResponse.json(ontology);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, nodes = '', edges = '', userId } = body;
    
    if (!title || !userId) { 
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 }); 
    }
    
    const newOntology = await prisma.ontology.create({ 
      data: { 
        userId, 
        title, 
        formula: "",
        nodes: nodes || '',
        edges: edges || '',
        createdAt: new Date(),  // Add if required
        updatedAt: new Date(),  // Add this since it's mentioned in the error
      } 
    });
    
    return NextResponse.json(newOntology, { status: 201 });
  }
  catch (err) {
    return NextResponse.json({ error: 'Create failed', details: err }, { status: 400 });
  }
}