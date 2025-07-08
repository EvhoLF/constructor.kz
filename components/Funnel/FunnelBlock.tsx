'use client'

import { IFunnelBlock } from '@/types/global'
import { Card, CardContent, TextField, Typography, } from '@mui/material'
import React from 'react'

interface Props {
  block: IFunnelBlock
  onChangeTitle: (id: string, title: string) => void
  isDragging?: boolean
}

export default function FunnelBlock({ block, onChangeTitle, isDragging }: Props) {
  return (
    <Card
      elevation={isDragging ? 8 : 2}
      sx={{
        border: isDragging ? '2px dashed #1976d2' : '1px solid #ccc',
        cursor: 'default',
        position: 'relative',
        display: 'flex',
      }}
    >
      <CardContent sx={{ flexGrow: 1, width: '100%', padding: '.75rem 1rem !important' }}>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          #{block.order}
        </Typography>
        <TextField
          variant="standard"
          fullWidth
          value={block.title}
          onChange={(e) => onChangeTitle(block.id, e.target.value)}
          placeholder="Введите название шага"
          InputProps={{ disableUnderline: true }}
          sx={{
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        />
      </CardContent>
    </Card>
  )
}
