import WrapperHeader from "@/components/Header/WrapperHeader";
import Schemes from "@/components/Schemes/Schemes";
import Head from "next/head";

export default async function Page() {

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>{'NewMap'}</title>
      </Head>
      <WrapperHeader>
        <Schemes />
      </WrapperHeader>
    </>
  );
}
