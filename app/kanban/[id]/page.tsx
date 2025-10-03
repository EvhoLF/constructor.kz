import Head from "next/head";
import WrapperHeader from '@/components/Header/WrapperHeader';
import KanbanFunnel from '@/components/KanbanFunnel/KanbanFunnel';
import { prisma } from '@/prisma/prisma';
import { Params } from 'next/dist/server/request/params';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const diagram = await prisma.funnel.findUnique({ where: { id: Number(id) } });
  return {
    title: diagram?.title || 'Доска',
    description: 'Управление задачами и проектами с помощью канбан-досок',
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>{'NewMap'}</title>
      </Head>
      <main>
        <WrapperHeader>
          <KanbanFunnel id={id} />
        </WrapperHeader>
      </main>
    </>
  );
}
