'use client'
import { Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import React from 'react'
import Icon from '../UI/Icon'
import Link from 'next/link'
import { NodeTemplate } from '.prisma/client'

interface NodeTemplateItemProps extends Pick<NodeTemplate, 'id' | 'title' | 'category'> {
  onEdit: (tpl: NodeTemplate) => void;
  onDelete: (tpl: NodeTemplate) => void;
}

const NodeTemplateItem = ({
  id,
  title,
  category = '',
  onEdit = () => { },
  onDelete = () => { },
}: NodeTemplateItemProps) => {
  const tpl = { id, title, category } as NodeTemplate;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        padding: '.25rem 1rem',
        borderRadius: '2rem',
        transition: 'all 0.2s ease-in-out',
        '&:hover .actions': { opacity: 1 },
        '&:hover': { backgroundColor: 'transparent.primaryMain' },
      }}
    >
      <Grid width="100%" container>
        <Grid size={6}>
          <Typography variant="h6" overflow="hidden" textOverflow="ellipsis">
            <Link href={`/admin/schemetemplate/${id}`} passHref>
              {title}
            </Link>
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="h6" overflow="hidden" textOverflow="ellipsis">
            <Link href={`/admin/schemetemplate/${id}`} passHref>
              {category}
            </Link>
          </Typography>
        </Grid>
      </Grid>

      <Stack className="actions" gap={1} sx={{ opacity: 0, transition: 'opacity 0.2s ease-in-out' }} direction="row">
        <Tooltip title="Открыть шаблон">
          <Link href={`/admin/schemetemplate/${id}`} passHref>
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
  );
};

export default NodeTemplateItem;