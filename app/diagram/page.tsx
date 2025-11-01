import WrapperHeader from "@/components/Header/WrapperHeader";
import { DiagramTypeProvider } from "@/hooks/DiagramTypeContext";
import Head from "next/head";
import { PAGE_DATA } from '@/constants/pages';
import { ImageUploadType } from "@/constants/upload";
import Diagrams from "@/components/Entity/Entitys/Diagrams";


export const metadata = {
  ...PAGE_DATA.diagram
}
export default async function Page() {

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <WrapperHeader pageTitle={PAGE_DATA.diagram.title}>
        <DiagramTypeProvider type={ImageUploadType.DIAGRAM}>
          <Diagrams />
        </DiagramTypeProvider>
      </WrapperHeader>
    </>
  );
}
