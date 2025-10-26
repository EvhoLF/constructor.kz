import { ReactFlowProvider } from "@xyflow/react";
import Head from "next/head";
import { DnDProvider } from "@/hooks/DnDProvider";
import { Box } from "@mui/material";
import { DiagramTypeProvider } from "@/hooks/DiagramTypeContext";
import MapTemplatesDiagram from "@/components/MapComponents/MapTemplatesDiagram";

import { PAGE_DATA } from '@/constants/pages';
export const metadata = {
  ...PAGE_DATA.templateDiagram
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
          <DiagramTypeProvider type='diagram' isTemplate>
            <DnDProvider>
              <Box width='100vw' height='100vh'>
                <MapTemplatesDiagram id={id} />
              </Box>
            </DnDProvider>
          </DiagramTypeProvider>
        </ReactFlowProvider>
      </main>
    </>
  );
}
