'use client'
import { Box, Grid, IconButton, Paper, Stack, Tooltip, Typography, Chip } from '@mui/material'
import React from 'react'
import Icon from '../UI/Icon'
import Link from 'next/link'
import { IFunnel } from '@/types/funnel'

interface FunnelListItemProps extends Pick<IFunnel, 'id' | 'title'> {
  onEdit: (id: string | number, title: string) => () => void;
  onDelete: (id: string | number, title: string) => () => void;
  blocksCount?: number;
  layoutMode?: string;
  isNew?: boolean;
}

const FunnelListItem = ({
  id,
  title,
  blocksCount = 0,
  layoutMode = 'bottomBig',
  isNew = false,
  onEdit = () => () => { },
  onDelete = () => () => { }
}: FunnelListItemProps) => {
  const url = `/funnel/${id}`;

  return (
    <Paper variant='outlined' elevation={3} sx={{
      padding: '.25rem 1rem',
      borderRadius: '2rem',
      transition: 'all 0.2s ease-in-out',
      '&:hover .actions': { opacity: 1, },
      '&:hover': {
        backgroundColor: '#f0f0f0',
      },
    }}>
      <Stack direction='row' justifyContent='space-between' alignItems="center" sx={{
        height: 'fit-content',
      }}>
        <Grid width='100%' container alignItems="center">
          <Grid size={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" overflow='hidden' textOverflow='ellipsis'>
                <Link href={url} passHref>{title}</Link>
              </Typography>
              {isNew && (
                <div style={{ pointerEvents: 'none' }}>
                  <Chip label="Новый" color="primary" size="small" />
                </div>
              )}
            </Stack>
          </Grid>
          <Grid size={6}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Блоков: {blocksCount}
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Stack className='actions' gap={1} sx={{ opacity: 0, transition: 'opacity 0.2s ease-in-out' }} direction='row'>
          <Tooltip title='Открыть воронку'>
            <Link href={url} passHref>
              <IconButton size='small'>
                <Icon icon='shareBox' />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title='Редактировать воронку'>
            <IconButton onClick={onEdit(id, title)} size='small'>
              <Icon icon='edit' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Удалить воронку'>
            <IconButton onClick={onDelete(id, title)} size='small' color='error'>
              <Icon icon='delete' />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default FunnelListItem