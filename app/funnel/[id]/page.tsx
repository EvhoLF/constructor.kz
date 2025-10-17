import Head from "next/head";
import Funnel from '@/components/Funnel/Funnel';
import WrapperHeader from '@/components/Header/WrapperHeader';
import { prisma } from '@/prisma/prisma';
import { PAGE_DATA } from "@/constants/pages";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const diagram = await prisma.funnel.findUnique({ where: { id: Number(id) } });
  return {
    title: diagram?.title || PAGE_DATA.funnel.title,
    description: PAGE_DATA.funnel.description,
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <main>
        <WrapperHeader pageTitle={PAGE_DATA.funnel.title}>
          <Funnel id={id} />
        </WrapperHeader>
      </main>
    </>
  );
}
