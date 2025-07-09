'use client';

import { Button, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { NodeTemplate } from '.prisma/client';
import NodeTemplateFilterPanel, { NodeTemplateSortOption } from './NodeTemplateFilterPanel';
import NodeTemplatesList from './NodeTemplatesList';
import Icon from '../UI/Icon';
import { useModal } from '@/hooks/useModal';
import ModalFormNodeTemplateDelete from '../Modals/ModalFormNodeTemplateDelete';
import ModalFormNodeTemplateEdit from '../Modals/ModalFormNodeTemplateEdit';
import ModalFormNodeTemplateCreate from '../Modals/ModalFormNodeTemplateCreate';

const NodeTemplates = () => {
  const { showModal } = useModal();
  const { data: session } = useSession({ required: true });
  const [nodeTemplates, setNodeTemplates] = useState<(NodeTemplate & { isNew: boolean })[]>([]);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortOption, setSortOption] = useState<NodeTemplateSortOption>('title_asc');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(nodeTemplates.map(t => t.category)));
    return unique.sort();
  }, [nodeTemplates]);

  useEffect(() => {
    if (!session?.user.id) return;
    axios
      .get(`/api/schemetemplate/`)
      .then((res) => {
        if (res.data) setNodeTemplates(res.data)
      })
      .catch((err) => {
        console.error('Ошибка при загрузке карт:', err);
      });
  }, [session?.user.id]);

  const filteredAndSortedTemplates = useMemo(() => {
    const [field, order] = sortOption.split('_') as ['title' | 'category', 'asc' | 'desc'];

    const filtered = nodeTemplates.filter((nt) =>
      nt.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === '' || nt.category === category)
    );
    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[field].toLowerCase();
      const bValue = b[field].toLowerCase();
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [nodeTemplates, search, category, sortOption]);


  const showModalFormCreate = () => {
    showModal({ content: <ModalFormNodeTemplateCreate setTemplates={setNodeTemplates} /> });
  };

  const showModalFormEdit = (id: number, title: string, category: string) => () => {
    showModal({
      content: (
        <ModalFormNodeTemplateEdit id={id} title={title} category={category} setTemplates={setNodeTemplates} />
      ),
    });
  };

  const showModalFormDelete = (id: number, title: string) => () => {
    showModal({
      content: (
        <ModalFormNodeTemplateDelete id={id} title={title} setTemplates={setNodeTemplates} />
      ),
    });
  };

  return (
    <Stack spacing={2} padding={1}>
      <Stack width='100%' direction='row' gap={1}>
        <NodeTemplateFilterPanel search={search} onSearchChange={setSearch} category={category} onCategoryChange={setCategory} sortOption={sortOption} onSortOptionChange={setSortOption} categories={categories} />
        <Button sx={{ width: '200px', textWrap: 'nowrap' }} startIcon={<Icon icon='add' />} variant='contained' onClick={showModalFormCreate}>Новый шаблон</Button>
      </Stack>

      {filteredAndSortedTemplates.length > 0 ? (
        <NodeTemplatesList
          nodeTemplates={filteredAndSortedTemplates}
          onEdit={(tpl) => showModalFormEdit(tpl.id, tpl.title, tpl.category)}
          onDelete={(tpl) => showModalFormDelete(tpl.id, tpl.title)}
        />
      ) : (
        <Typography variant="body2" color="text.secondary">
          Нет шаблонов, соответствующих фильтру
        </Typography>
      )}
    </Stack>
  );
};

export default NodeTemplates;
