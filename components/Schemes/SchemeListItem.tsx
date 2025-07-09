'use client'
import { Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import React from 'react'
import Icon from '../UI/Icon'
import Link from 'next/link'
import { Scheme } from '.prisma/client'

interface SchemeListItem extends Pick<Scheme, 'id' | 'title'> {
  onEdit: (id: string | number, title: string) => () => void;
  onDelete: (id: string | number, title: string) => () => void;
  formula?: string,
}

const SchemeListItem = ({ id, title, formula = '', onEdit = () => () => { }, onDelete = () => () => { } }: SchemeListItem) => {
  return (
    <Stack direction='row' justifyContent='space-between' sx={{
      padding: '.25rem 1rem',
      height: 'fit-content',
      borderRadius: '2rem',
      transition: 'all 0.2s ease-in-out',
      '&:hover .actions': { opacity: 1, },
      '&:hover': {
        backgroundColor: 'transparent.primaryMain',
      },
    }}>
      <Grid width='100%' container>
        <Grid size={6}>
          <Typography variant="h6" overflow='hidden' textOverflow='ellipsis'><Link href={`/scheme/${id}`} passHref>{title}</Link></Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="h6" overflow='hidden' textOverflow='ellipsis'><Link href={`/scheme/${id}`} passHref>{formula}</Link></Typography>
        </Grid>
      </Grid>
      <Stack className='actions' gap={1} sx={{ opacity: 0, transition: 'opacity 0.2s ease-in-out' }} direction='row'>
        <Tooltip title='Открыть схему'><Link href={`/scheme/${id}`} passHref><IconButton size='small'><Icon icon='shareBox' /></IconButton></Link></Tooltip>
        <Tooltip title='Редактировать схему'><IconButton onClick={onEdit(id, title)} size='small'><Icon icon='edit' /></IconButton></Tooltip>
        <Tooltip title='Удалить схему'><IconButton onClick={onDelete(id, title)} size='small' color='error'><Icon icon='delete' /></IconButton></Tooltip>
      </Stack >
    </Stack >
  )
}

export default SchemeListItem