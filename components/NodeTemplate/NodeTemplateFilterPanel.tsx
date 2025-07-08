'use client';

import React from 'react';
import {
  Grid,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import StackRow from '../UI/StackRow';
import Icon from '../UI/Icon';

export type NodeTemplateSortOption =
  | 'title_asc'
  | 'title_desc'
  | 'category_asc'
  | 'category_desc';

interface NodeTemplateFilterPanelProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sortOption: NodeTemplateSortOption;
  onSortOptionChange: (option: NodeTemplateSortOption) => void;
  categories: string[]; // список доступных категорий
}

const NodeTemplateFilterPanel: React.FC<NodeTemplateFilterPanelProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sortOption,
  onSortOptionChange,
  categories,
}) => {
  return (
    <Grid container spacing={1} width="100%">
      <Grid size={6}>
        <TextField
          fullWidth
          label="Поиск по названию"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          variant="outlined"
          size="small"
        />
      </Grid>
      <Grid size={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Категория</InputLabel>
          <Select
            value={category}
            label="Категория"
            onChange={(e: SelectChangeEvent) => onCategoryChange(e.target.value)}
          >
            <MenuItem value="">Все категории</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Сортировка</InputLabel>
          <Select
            value={sortOption}
            label="Сортировка"
            onChange={(e: SelectChangeEvent) => onSortOptionChange(e.target.value as NodeTemplateSortOption)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="title_asc">
              <StackRow><Icon icon="sortAlphabetAsc" />По названию (А–Я)</StackRow>
            </MenuItem>
            <MenuItem value="title_desc">
              <StackRow><Icon icon="sortAlphabetDesc" />По названию (Я–А)</StackRow>
            </MenuItem>
            <MenuItem value="category_asc">
              <StackRow><Icon icon="sortAsc" />По категории (А–Я)</StackRow>
            </MenuItem>
            <MenuItem value="category_desc">
              <StackRow><Icon icon="sortDesc" />По категории (Я–А)</StackRow>
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default NodeTemplateFilterPanel;
