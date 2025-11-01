// app/api/funnel/route.ts
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

    const [funnels, totalCount] = await Promise.all([
      prisma.funnel.findMany({
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
      prisma.funnel.count({ where })
    ]);

    const response = createApiResponse(funnels, totalCount, page, limit, sortOption);
    return NextResponse.json(response);
  } catch (err) {
    console.error('Ошибка при загрузке воронок:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', details: err instanceof Error ? err.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, blocks, layoutMode, styleMode, textAlign, toggles, blockWidth, blockHeight, userId } = body;

    if (!title || !userId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const newFunnel = await prisma.funnel.create({
      data: {
        userId,
        title,
        blocks: blocks || null,
        layoutMode: layoutMode || 'bottomBig',
        styleMode: styleMode || 'filled',
        textAlign: textAlign || 'left',
        toggles: toggles || null,
        blockWidth: blockWidth || 100,
        blockHeight: blockHeight || 70,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newFunnel, { status: 201 });
  } catch (err) {
    console.error('Ошибка при создании воронки:', err);
    return NextResponse.json(
      { error: 'Create failed', details: err instanceof Error ? err.message : 'Unknown error' }, 
      { status: 400 }
    );
  }
}