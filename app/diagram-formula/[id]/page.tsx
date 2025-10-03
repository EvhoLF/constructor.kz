import { ReactFlowProvider } from "@xyflow/react";
import Head from "next/head";
import { DnDProvider } from "@/hooks/DnDProvider";
import Map from "@/components/MapComponents/Map";
import { Box } from "@mui/material";
import { DiagramTypeProvider } from "@/hooks/DiagramTypeContext";
import { prisma } from '@/prisma/prisma';
import { Params } from 'next/dist/server/request/params';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const diagram = await prisma.diagramFormula.findUnique({ where: { id: Number(id) } });
  return {
    title: diagram?.title || 'Диаграмма формула',
    description: 'Создание и редактирование диаграмм на основе формул',
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
        <ReactFlowProvider>
          <DiagramTypeProvider type='formula'>
            <DnDProvider>
              <Box width='100vw' height='100vh'>
                <Map id={id} />
              </Box>
            </DnDProvider>
          </DiagramTypeProvider>
        </ReactFlowProvider>
      </main>
    </>
  );
}
