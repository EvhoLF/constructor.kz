import WrapperHeader from "@/components/Header/WrapperHeader";
import { DiagramTypeWrapper } from "@/hooks/DiagramTypeContext";
import Head from "next/head";
import { PAGE_DATA } from '@/constants/pages';
import TemplateDiagrams from "@/components/Entity/Entitys/TemplateDiagrams";
export const metadata = {
  ...PAGE_DATA.templateDiagram
}
export default function Page() {

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <WrapperHeader pageTitle={PAGE_DATA.templateDiagram.title}>
        <DiagramTypeWrapper type='diagram' isTemplate>
          <TemplateDiagrams />
        </DiagramTypeWrapper>
      </WrapperHeader>
    </>
  );
}
