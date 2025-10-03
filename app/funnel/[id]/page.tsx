import Head from "next/head";
import Funnel from '@/components/Funnel/Funnel';
import WrapperHeader from '@/components/Header/WrapperHeader';
import { prisma } from '@/prisma/prisma';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const diagram = await prisma.funnel.findUnique({ where: { id: Number(id) } });
  return {
    title: diagram?.title || 'Воронки',
    description: 'Воронки и пользовательские пути',
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
          <Funnel id={id} />
        </WrapperHeader>
      </main>
    </>
  );
}
