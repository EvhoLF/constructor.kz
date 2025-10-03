import { checkAccessFetch } from '@/libs/checkAccessFetch';
import { ErrorWithStatus } from '@/libs/ErrorWithStatus';
import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';


export async function GET(_: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const requestedUserId = Number(userId);
  // console.log({ requestedUserId, userId });

  try {
    const res = await checkAccessFetch(requestedUserId);
    // console.log({ res });
    const diagrams = await prisma.diagram.findMany({
      where: { userId: requestedUserId }
    });
    return NextResponse.json(diagrams);
  }
  catch (err) {
    if (err instanceof ErrorWithStatus) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
