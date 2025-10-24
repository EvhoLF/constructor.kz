import WrapperHeader from "@/components/Header/WrapperHeader";
import NodeTemplates from "@/components/NodeTemplate/Templates";
import Icon from '@/components/UI/Icon';
import { DiagramTypeWrapper } from "@/hooks/DiagramTypeContext";
import { IconName, Icons } from '@/Icons';
import { Box } from '@mui/material';
import Head from "next/head";

export default function Page() {

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>{'NewMap'}</title>
      </Head>
      <WrapperHeader>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '1rem'}}>
          {
            Object.keys(Icons).map((el) => (
              <Box key={el} sx={{ width: 'min-content', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <Icon icon={el as IconName} />
                <p>{el}</p>
              </Box>
            ))
          }
        </Box>
      </WrapperHeader>
    </>
  );
}
