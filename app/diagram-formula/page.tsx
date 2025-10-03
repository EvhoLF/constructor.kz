import Diagrams from "@/components/Diagram/Diagrams";
import WrapperHeader from "@/components/Header/WrapperHeader";
import { DiagramTypeProvider } from "@/hooks/DiagramTypeContext";
import Head from "next/head";
import { PAGE_DATA } from '@/constants/pages';


export const metadata = {
  ...PAGE_DATA.diagramFormula
}
export default async function Page() {

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>{'Diagrams'}</title>
      </Head>
      <WrapperHeader>
        <DiagramTypeProvider type='formula'>
          <Diagrams />
        </DiagramTypeProvider>
      </WrapperHeader>
    </>
  );
}
