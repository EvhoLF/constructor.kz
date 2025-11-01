// app/api/kanban/route.ts
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

    const [kanbans, totalCount] = await Promise.all([
      prisma.kanban.findMany({
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
      prisma.kanban.count({ where })
    ]);

    const response = createApiResponse(kanbans, totalCount, page, limit, sortOption);
    return NextResponse.json(response);
  } catch (err) {
    console.error('Ошибка при загрузке канбан досок:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', details: err instanceof Error ? err.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, columns, blocks, style, userId } = body;

    if (!title || !userId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const newKanban = await prisma.kanban.create({
      data: {
        userId,
        title,
        columns: columns || null,
        blocks: blocks || null,
        style: style || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newKanban, { status: 201 });
  } catch (err) {
    console.error('Ошибка при создании канбан доски:', err);
    return NextResponse.json(
      { error: 'Create failed', details: err instanceof Error ? err.message : 'Unknown error' }, 
      { status: 400 }
    );
  }
}