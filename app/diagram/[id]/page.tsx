import { ReactFlowProvider } from "@xyflow/react";
import Head from "next/head";
import { DnDProvider } from "@/hooks/DnDProvider";
import { Box } from "@mui/material";
import MapDiagram from "@/components/MapComponents/MapDiagram";
import { DiagramTypeProvider } from "@/hooks/DiagramTypeContext";
import { prisma } from '@/prisma/prisma';
import { Params } from 'next/dist/server/request/params';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const diagram = await prisma.diagram.findUnique({ where: { id: Number(id) } });
  return {
    title: diagram?.title || 'Диаграмма',
    description: 'Визуализация данных с помощью различных типов графиков и диаграмм для анализа информации',
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
        <ReactFlowProvider>
          <DiagramTypeProvider type='diagram'>
            <DnDProvider>
              <Box width='100vw' height='100vh'>
                <MapDiagram id={id} />
              </Box>
            </DnDProvider>
          </DiagramTypeProvider>
        </ReactFlowProvider>
      </main>
    </>
  );
}
