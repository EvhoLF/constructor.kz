'use client'
import { AppBar, Box, Button, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React from 'react'
import Icon from '../UI/Icon'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Frame from '../UI/Frame'
import StackRow from '../UI/StackRow'
import Konstruktor from '@/Icons/Konstruktor'

const HeaderBar = ({ spacing = false }: { spacing?: boolean }) => {
  const { data: session } = useSession();

  //sx={{ bgcolor: '#0d1117', color: '#fff', boxShadow: 'none' }}
  return (
    <>
      <AppBar position='relative' color="default" sx={{ '&': { background: 'none !important', boxShadow: 'none' } }}>
        <StackRow width='100%' gap={1} overflow='none'>
          <Frame sx={{ width: '100%', padding: '0rem .25rem' }}>
            <Toolbar sx={{ minHeight: '50px !important', height: '100%', padding: '0 1rem !important', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography fontFamily='RighteousRegular' variant='h6' textTransform='uppercase' fontWeight='700'>konstruktor</Typography>
              </Box>
              {
                session?.user
                  ? <Tooltip title='Профиль'>
                    <Link href='/profile'>
                      <Box display="flex" alignItems="center" gap={1.2}>
                        <IconButton sx={{ background: '#cccccc0f' }} color="inherit"><Icon icon="user" /></IconButton>
                        {session?.user?.name && <Typography overflow='hidden' textOverflow='ellipsis' maxWidth='6rem'>{session?.user.name}</Typography>}
                      </Box>
                    </Link>
                  </Tooltip>
                  : <Tooltip title='Авторизация'>
                    <Link href='/auth/signin'><Button startIcon={<Icon icon='user' />} variant='contained'>Ввойти</Button></Link>
                  </Tooltip>
              }

            </Toolbar>
          </Frame>
        </StackRow>
      </AppBar>
      {spacing && <Box sx={{ height: '66px' }} />}
    </>
  );
};

export default HeaderBar;
