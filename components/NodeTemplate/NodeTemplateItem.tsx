'use client'
import { Grid, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material'
import React from 'react'
import Icon from '../UI/Icon'
import Link from 'next/link'
import { SuperTemplate } from '@/global'
import { useDiagramType } from '@/hooks/DiagramTypeContext'

interface NodeTemplateItemProps extends Pick<SuperTemplate, 'id' | 'title' | 'category'> {
  onEdit: (tpl: SuperTemplate) => void;
  onDelete: (tpl: SuperTemplate) => void;
}

const NodeTemplateItem = ({ id, title, category = '', onEdit = () => { }, onDelete = () => { } }: NodeTemplateItemProps) => {
  const tpl = { id, title, category } as SuperTemplate;
  const { templateUrl } = useDiagramType(id);

  return (
    <Paper
      variant="outlined"
      elevation={3}
      sx={{
        padding: '.25rem 1rem',
        borderRadius: '2rem',
        transition: 'all 0.2s ease-in-out',
        '&:hover .actions': { opacity: 1 },
        '&:hover': { backgroundColor: '#f0f0f0' },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ height: 'fit-content' }}
      >
        <Grid width="100%" container>
          <Grid size={6}>
            <Typography variant="h6" overflow="hidden" textOverflow="ellipsis">
              <Link href={templateUrl} passHref>
                {title}
              </Link>
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="h6" overflow="hidden" textOverflow="ellipsis">
              <Link href={templateUrl} passHref>
                {category}
              </Link>
            </Typography>
          </Grid>
        </Grid>

        <Stack
          className="actions"
          gap={1}
          sx={{ opacity: 0, transition: 'opacity 0.2s ease-in-out' }}
          direction="row"
        >
          <Tooltip title="Открыть шаблон">
            <Link href={templateUrl} passHref>
              <IconButton size="small">
                <Icon icon="shareBox" />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Редактировать шаблон">
            <IconButton onClick={() => onEdit(tpl)} size="small">
              <Icon icon="edit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Удалить шаблон">
            <IconButton onClick={() => onDelete(tpl)} size="small" color="error">
              <Icon icon="delete" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default NodeTemplateItem;
