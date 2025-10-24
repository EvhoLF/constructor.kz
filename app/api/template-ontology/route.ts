import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET: Получение списка
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const where = category ? { category } : {};
  const skip = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;
  const take = page && limit ? parseInt(limit) : undefined;

  const templates = await prisma.templateOntology.findMany({
    where,
    skip,
    take,
    orderBy: { id: 'desc' },
  });

  return NextResponse.json(templates);
}

// POST: Создание
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, category, nodes, edges } = body;

  if (!title || !category)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const created = await prisma.templateOntology.create({
    data: { title, category, nodes, edges },
  });

  return NextResponse.json(created);
}
