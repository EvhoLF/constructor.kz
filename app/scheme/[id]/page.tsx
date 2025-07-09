import { ReactFlowProvider } from "@xyflow/react";
import Head from "next/head";
import { DnDProvider } from "@/hooks/DnDProvider";
import Map from "@/components/MapComponents/Map";
import { Box } from "@mui/material";

// export async function generateMetadata({ params }) {
//   const { id } = await params
//   if (!id) return { title: 'EDONs' }
//   const map = await MapGetById(id);
//   return !map ? { title: 'EDONs' } : { title: `${map?.label} - EDONs` };
// }

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
          <DnDProvider>
            <Box width='100vw' height='100vh'>
              <Map id={id} />
            </Box>
          </DnDProvider>
        </ReactFlowProvider>
      </main>
    </>
  );
}
