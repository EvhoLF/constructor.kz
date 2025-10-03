'use client';

import { TextField, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent, Grid, } from '@mui/material';
import React from 'react';
import Icon from '../UI/Icon';
import StackRow from '../UI/StackRow';

export type SortOption =
  | 'title_asc'
  | 'title_desc'
  | 'createdAt_asc'
  | 'createdAt_desc'
  | 'updatedAt_asc'
  | 'updatedAt_desc';

interface FunnelFilterPanelProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortOption: SortOption;
  onSortOptionChange: (option: SortOption) => void;
}

const FunnelFilterPanel: React.FC<FunnelFilterPanelProps> = ({ search, onSearchChange, sortOption, onSortOptionChange, }) => {
  return (
    <Grid width='100%' container spacing={1}>
      <Grid size={8}>
        <TextField
          fullWidth
          label="Поиск по названию"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          variant="outlined"
          size="small"
        />
      </Grid>
      <Grid size={4}>
        <FormControl fullWidth size="small" sx={{ margin: '0px !IMPORTANT' }}>
          <InputLabel>Сортировка</InputLabel>
          <Select
            value={sortOption}
            label="Сортировка"
            onChange={(e: SelectChangeEvent) => onSortOptionChange(e.target.value as SortOption)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="title_asc"><StackRow><Icon icon='sortAlphabetAsc' />По названию (А–Я)</StackRow></MenuItem>
            <MenuItem value="title_desc"><StackRow><Icon icon='sortAlphabetDesc' />По названию (Я–А)</StackRow></MenuItem>
            <MenuItem value="createdAt_desc"><StackRow><Icon icon='sortAsc' />Сначала новые</StackRow></MenuItem>
            <MenuItem value="createdAt_asc"><StackRow><Icon icon='sortDesc' />Сначала старые</StackRow></MenuItem>
            <MenuItem value="updatedAt_desc"><StackRow><Icon icon='sortAsc' />Недавно обновлённые</StackRow></MenuItem>
            <MenuItem value="updatedAt_asc"><StackRow><Icon icon='sortDesc' />Давно обновлённые</StackRow></MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default FunnelFilterPanel;