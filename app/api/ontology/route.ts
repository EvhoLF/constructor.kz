// app/api/ontology/route.ts
import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';
import { buildPaginationParams, buildSearchCondition, createApiResponse } from '@/libs/api-utils';
import { getPrismaOrderBy } from '@/libs/sort-utils';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const { page, limit, skip, take, search, sortOption } = buildPaginationParams(searchParams);

    const where = buildSearchCondition(search);
    const orderBy = getPrismaOrderBy(sortOption);

    const [ontology, totalCount] = await Promise.all([
      prisma.ontology.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
        skip,
        take,
        orderBy,
      }),
      prisma.ontology.count({ where })
    ]);

    const response = createApiResponse(ontology, totalCount, page, limit, sortOption);
    return NextResponse.json(response);
  } catch (err) {
    console.error('Ошибка при загрузке онтологий:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
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
        formula: '',
        nodes,
        edges,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newOntology, { status: 201 });
  } catch (err) {
    console.error('Ошибка при создании онтологии:', err);
    return NextResponse.json(
      { error: 'Create failed', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 400 }
    );
  }
}