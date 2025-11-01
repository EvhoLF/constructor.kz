// app/api/diagram/user/[userId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { buildPaginationParams, buildSearchCondition, createApiResponse } from '@/libs/api-utils';
import { getPrismaOrderBy } from '@/libs/sort-utils';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const requestedUserId = Number(userId);

    if (isNaN(requestedUserId)) {
      return NextResponse.json(
        { error: 'Некорректный userId' }, 
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const { page, limit, skip, take, search, sortOption } = buildPaginationParams(searchParams);
    const excludeId = searchParams.get('excludeId');

    const where: any = {
      userId: requestedUserId,
      ...buildSearchCondition(search),
      ...(excludeId ? { id: { not: Number(excludeId) } } : {}),
    };

    // Получаем orderBy для Prisma
    const orderBy = getPrismaOrderBy(sortOption);

    const [diagrams, totalCount] = await Promise.all([
      prisma.diagram.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
      }),
      prisma.diagram.count({ where })
    ]);

    const response = createApiResponse(diagrams, totalCount, page, limit, sortOption);
    return NextResponse.json(response);
  } catch (err) {
    console.error('Ошибка при загрузке диаграмм пользователя:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', details: err instanceof Error ? err.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}