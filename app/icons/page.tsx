"use client"
import Icon from "@/components/UI/Icon";
import { IconsNames } from "@/Icons";
import { Stack, Typography } from "@mui/material";
import Head from "next/head";

export default function Page() {

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>{'ICONS'}</title>
      </Head>
      <div>
        <Stack direction='row' flexWrap='wrap' gap={1}>
          {
            IconsNames.map((e) => <Stack key={e} alignItems='center'><Icon icon={e} /> <Typography variant='caption'>{e}</Typography></Stack>)
          }
        </Stack>
      </div>
    </>
  );
}
