// components/Entity/EntityFilterPanel.tsx
'use client';
import { TextField, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent, Grid } from '@mui/material';
import React, { useCallback, useState, useRef, useEffect } from 'react';
import Icon from '../UI/Icon';
import StackRow from '../UI/StackRow';
import { useEntityTemplate } from '@/configs/entityConfig';
import { SortOption, SORT_OPTIONS } from '@/libs/sort-utils';

interface EntityFilterPanelProps {
    search: string;
    onSearchChange: (value: string) => void;
    sortOption: SortOption;
    onSortOptionChange: (option: SortOption) => void;
    entityType: string;
}

const EntityFilterPanel: React.FC<EntityFilterPanelProps> = ({
    search,
    onSearchChange,
    sortOption,
    onSortOptionChange,
    entityType
}) => {
    const template = useEntityTemplate(entityType);
    const [localSearch, setLocalSearch] = useState(search);
    const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onSearchChange(e.target.value);
    }, [onSearchChange]);

    // Синхронизация с внешним состоянием
    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    return (
        <Grid width='100%' container spacing={1} direction={{ xs: "column", sm: "row" }}>
            <Grid size={{ sm: 'grow', md: 8 }}>
                <TextField
                    fullWidth
                    label={template.options?.searchPlaceholder || `Поиск по названию ${template.namePlural.toLowerCase()}`}
                    value={localSearch}
                    onChange={(e) => handleSearchChange(e)}
                    variant="outlined"
                    size="small"
                    placeholder="Введите для поиска..."
                />
            </Grid>
            <Grid size={{ sm: 'grow', md: 4 }}>
                <FormControl fullWidth size="small" sx={{ margin: '0px !important' }}>
                    <InputLabel>Сортировка</InputLabel>
                    <Select
                        value={sortOption}
                        label="Сортировка"
                        onChange={(e: SelectChangeEvent) => onSortOptionChange(e.target.value as SortOption)}
                        sx={{ minWidth: 220 }}
                    >
                        {SORT_OPTIONS.COMMON.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                <StackRow>
                                    <Icon icon={
                                        option.value.includes('title')
                                            ? (option.order === 'asc' ? 'sortAlphabetAsc' : 'sortAlphabetDesc')
                                            : (option.order === 'asc' ? 'sortAsc' : 'sortDesc')
                                    } />
                                    {option.label}
                                </StackRow>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default EntityFilterPanel;