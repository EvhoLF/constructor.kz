import WrapperHeader from "@/components/Header/WrapperHeader";
import NodeTemplates from "@/components/NodeTemplate/Templates";
import { DiagramTypeWrapper } from "@/hooks/DiagramTypeContext";
import Head from "next/head";
import { PAGE_DATA } from '@/constants/pages';
export const metadata = {
  ...PAGE_DATA.templateOntology
}
export default function Page() {

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <WrapperHeader pageTitle={PAGE_DATA.templateOntology.title}>
        <DiagramTypeWrapper type='ontology' isTemplate>
          <NodeTemplates />
        </DiagramTypeWrapper>
      </WrapperHeader>
    </>
  );
}
