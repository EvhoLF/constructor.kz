import { ReactFlowProvider } from "@xyflow/react";
import Head from "next/head";
import { DnDProvider } from "@/hooks/DnDProvider";
import { Box } from "@mui/material";
import MapNodeTemplate from "@/components/MapComponents/MapTemplates";
import { DiagramTypeProvider } from "@/hooks/DiagramTypeContext";

// export async function generateMetadata({ params }) {
//   const { id } = await params
//   if (!id) return { title: 'EDONs' }
//   const map = await MapGetById(id);
//   return !map ? { title: 'EDONs' } : { title: `${map?.label} - EDONs` };
// }
import { PAGE_DATA } from '@/constants/pages';
export const metadata = {
  ...PAGE_DATA.templateFormula
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
                <MapNodeTemplate id={id} />
              </Box>
            </DnDProvider>
          </DiagramTypeProvider>
        </ReactFlowProvider>
      </main>
    </>
  );
}
