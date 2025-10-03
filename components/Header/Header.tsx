// components/Layout.tsx
'use client';

import { Box, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import Icon from '../UI/Icon';
import { useHeader } from '@/hooks/HeaderContext';
import { useSession } from 'next-auth/react';
import LinkButton from '../UI/LinkButton';
import StackRow from '../UI/StackRow';
import Frame from '../UI/Frame';
import { HeaderMenu, HeaderMenuAdmin, HeaderMenuItem } from '@/constants/pages';

export default function Header({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { isOpen, closeHeader } = useHeader();

  const isAdmin = session?.user?.role !== undefined && (session?.user?.role as string) === 'admin';

  const getItems = (items: HeaderMenuItem[]) => items.map(({ id, label, ...props }) => <LinkButton key={id} label={label} {...props} />)

  return (
    <>
      <Drawer anchor="left" open={isOpen} onClose={closeHeader} sx={{
        '&>.MuiPaper-elevation': {
          background: 'none !important',
          padding: '.5rem',
          boxShadow: 'none'
        }
      }}>
        <Frame
          sx={{ height: '100%', width: 250, padding: 1 }}
          role="presentation"
          onClick={closeHeader}
          onKeyDown={closeHeader}
        >
          <Box height={'100%'} sx={{ overflow: 'auto' }}>
            <Stack gap={2} height='100%'>
              <StackRow justifyContent='space-between' px={1}>
                <StackRow>
                  {/* <Icon icon='konstruktor' /> */}
                  <Typography fontFamily='RighteousRegular' variant='h6' textTransform='uppercase' fontWeight='700'>konstruktor</Typography>
                </StackRow>
                <IconButton size='medium' color="inherit" edge="start" onClick={closeHeader}>
                  <Icon fontSize='medium' icon='close' />
                </IconButton>
              </StackRow>
              <Stack>
                {getItems(HeaderMenu)}
                {isAdmin && <Divider sx={{ py: 1, fontSize: '.75rem', color: '#999' }}>Admin</Divider>}
                {isAdmin && getItems(HeaderMenuAdmin)}
              </Stack>
              <Stack mt='auto' alignItems='center'>
                <Link href='https://github.com/EvhoLF'>
                  <Typography color='textDisabled' variant='caption'>Created by Сhistoedov M.</Typography>
                </Link>
              </Stack>
            </Stack>
          </Box>
        </Frame>
      </Drawer>
      <Box component="main">
        {children}
      </Box>
    </>
  );
}
