'use client'
import { IconButton, Tooltip } from '@mui/material'
import React from 'react'
import Icon from '../UI/Icon'
import { useHeader } from '@/hooks/HeaderContext'
import Frame from '../UI/Frame'

const HeaderButton = () => {
  const { openHeader } = useHeader();

  return (
    <Frame sx={{ padding: '5px', width: 'fit-content' }}>
      <Tooltip title='Меню'>
        <IconButton
          size='medium'
          color="inherit"
          onClick={openHeader}
        >
          <Icon fontSize='medium' icon="menu" />
        </IconButton>
      </Tooltip>
    </Frame>
  );
};

export default HeaderButton;
