'use client';

import { Button, Stack, Typography, CircularProgress, Box } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import NodeTemplateFilterPanel, { NodeTemplateSortOption } from './NodeTemplateFilterPanel';
import NodeTemplatesList from './NodeTemplatesList';
import Icon from '../UI/Icon';
import { useModal } from '@/hooks/useModal';
import ModalFormNodeTemplateDelete from '../Modals/ModalFormNodeTemplateDelete';
import ModalFormNodeTemplateEdit from '../Modals/ModalFormNodeTemplateEdit';
import ModalFormNodeTemplateCreate from '../Modals/ModalFormNodeTemplateCreate';
import { useDiagramType } from '@/hooks/DiagramTypeContext';
import { SuperTemplate } from '@/global';

const NodeTemplates = () => {
  const { templateApi } = useDiagramType();
  const { showModal } = useModal();
  const { data: session } = useSession({ required: true });

  const [nodeTemplates, setNodeTemplates] = useState<(SuperTemplate & { isNew: boolean })[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortOption, setSortOption] = useState<NodeTemplateSortOption>('title_asc');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(() => {
    return Array.from(new Set(nodeTemplates.map(t => t.category))).sort();
  }, [nodeTemplates]);

  useEffect(() => {
    if (!session?.user.id) return;
    setLoading(true);
    setError(null);
    axios
      .get(templateApi)
      .then((res) => setNodeTemplates(res.data || []))
      .catch((err) => {
        console.error('Ошибка при загрузке:', err);
        setError('Не удалось загрузить шаблоны');
      })
      .finally(() => setLoading(false));
  }, [session?.user.id, templateApi]);

  const filteredAndSortedTemplates = useMemo(() => {
    const [field, order] = sortOption.split('_') as ['title' | 'category', 'asc' | 'desc'];

    return [...nodeTemplates]
      .filter((nt) =>
        nt.title.toLowerCase().includes(search.toLowerCase()) &&
        (category === '' || nt.category === category)
      )
      .sort((a, b) => {
        const aValue = a[field].toLowerCase();
        const bValue = b[field].toLowerCase();
        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
      });
  }, [nodeTemplates, search, category, sortOption]);

  // --- Callbacks ---
  const showModalFormCreate = useCallback(() => {
    showModal({ content: <ModalFormNodeTemplateCreate api={templateApi} setTemplates={setNodeTemplates} /> });
  }, [showModal, templateApi]);

  const showModalFormEdit = useCallback((id: number, title: string, category: string) => {
    showModal({
      content: (
        <ModalFormNodeTemplateEdit
          api={templateApi}
          id={id}
          title={title}
          category={category}
          setTemplates={setNodeTemplates}
        />
      ),
    });
  }, [showModal, templateApi]);

  const showModalFormDelete = useCallback((id: number, title: string) => {
    showModal({
      content: (
        <ModalFormNodeTemplateDelete
          api={templateApi}
          id={id}
          title={title}
          setTemplates={setNodeTemplates}
        />
      ),
    });
  }, [showModal, templateApi]);

  return (
    <Stack spacing={2} padding={1}>
      <Stack width="100%" direction="row" gap={1}>
        <NodeTemplateFilterPanel
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          sortOption={sortOption}
          onSortOptionChange={setSortOption}
          categories={categories}
        />
        <Button
          sx={{ width: 200, textWrap: 'nowrap' }}
          startIcon={<Icon icon="add" />}
          variant="contained"
          onClick={showModalFormCreate}
        >
          Новый шаблон
        </Button>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1} minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      ) : filteredAndSortedTemplates.length > 0 ? (
        <NodeTemplatesList
          nodeTemplates={filteredAndSortedTemplates}
          onEdit={(tpl) => showModalFormEdit(tpl.id, tpl.title, tpl.category)}
          onDelete={(tpl) => showModalFormDelete(tpl.id, tpl.title)}
        />
      ) : (
        <Stack alignItems="center" spacing={1} padding={2}>
          <Typography variant="body2" color="text.secondary">
            Нет шаблонов, соответствующих фильтру
          </Typography>
          <Button variant="outlined" onClick={showModalFormCreate}>
            Создать первый шаблон
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default NodeTemplates;
