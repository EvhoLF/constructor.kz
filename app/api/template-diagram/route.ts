// app/api/template-diagram/route.ts
import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { buildPaginationParams, buildSearchCondition, createApiResponse } from '@/libs/api-utils';
import { getPrismaOrderBy } from '@/libs/sort-utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const { page, limit, skip, take, search, sortOption } = buildPaginationParams(searchParams);

    const where = {
      ...(category ? { category } : {}),
      ...buildSearchCondition(search)
    };

    const orderBy = getPrismaOrderBy(sortOption);

    const [templates, totalCount] = await Promise.all([
      prisma.templateDiagram.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      prisma.templateDiagram.count({ where })
    ]);

    const response = createApiResponse(templates, totalCount, page, limit, sortOption);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching template diagrams:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, nodes, edges } = body;

    if (!title || !category) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const created = await prisma.templateDiagram.create({
      data: { title, category, nodes, edges },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error('Error creating template diagram:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}