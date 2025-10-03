'use client';

import { Button, Stack, Typography, CircularProgress, Box } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import SchemeFilterPanel, { SortOption } from './DiagramFilterPanel';
import { useModal } from '@/hooks/useModal';
import ModalFormDiagramCreate from '../Modals/ModalFormDiagramCreate';
import ModalFormDiagramEdit from '../Modals/ModalFormDiagramEdit';
import ModalFormDiagramDelete from '../Modals/ModalFormDiagramDelete';
import Icon from '../UI/Icon';
import DiagramList from './DiagramList';
import { SuperDiagram } from '@/global';
import { useDiagramType } from '@/hooks/DiagramTypeContext';

const Diagrams = () => {
  const { showModal } = useModal();
  const { data: session } = useSession({ required: true });
  const [diagrams, setDiagrams] = useState<(SuperDiagram & { isNew: boolean })[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('updatedAt_desc');

  const { api } = useDiagramType();

  useEffect(() => {
    if (!session?.user.id) return;

    setLoading(true);
    axios
      .get(`${api}/user/${session.user.id}`)
      .then((res) => {
        if (res.data) setDiagrams(res.data);
      })
      .catch((err) => {
        console.error('Ошибка при загрузке карт:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [session?.user.id]);

  const filteredAndSortedDiagrams = useMemo(() => {
    const [field, order] = sortOption.split('_') as ['title' | 'createdAt' | 'updatedAt', 'asc' | 'desc'];

    const filtered = diagrams.filter((diagram) => diagram.title.toLowerCase().includes(search.toLowerCase()));

    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      if (field === 'createdAt' || field === 'updatedAt') {
        aValue = new Date(a[field]).getTime();
        bValue = new Date(b[field]).getTime();
      } else {
        aValue = a[field] as string;
        bValue = b[field] as string;
      }
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [diagrams, search, sortOption]);

  const showModalFormDiagramCreate = () => {
    showModal({ content: <ModalFormDiagramCreate api={api} setDiagrams={setDiagrams} /> });
  };
  const showModalFormDiagramEdit = (id: string | number, title: string) => () => {
    showModal({ content: <ModalFormDiagramEdit api={api} id={id} title={title} setDiagrams={setDiagrams} /> });
  };
  const showModalFormDiagramDelete = (id: string | number, title: string) => () => {
    showModal({ content: <ModalFormDiagramDelete api={api} id={id} title={title} setDiagrams={setDiagrams} /> });
  };

  return (
    <Stack spacing={2} padding={1}>
      <Stack width="100%" direction="row" gap={1}>
        <SchemeFilterPanel
          search={search}
          onSearchChange={setSearch}
          sortOption={sortOption}
          onSortOptionChange={setSortOption}
        />
        <Button
          sx={{ width: '200px' }}
          startIcon={<Icon icon="add" />}
          variant="contained"
          onClick={showModalFormDiagramCreate}
        ></Button>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1} minHeight="200px">
          <CircularProgress />
        </Box>
      ) : filteredAndSortedDiagrams.length > 0 ? (
        <DiagramList diagrams={filteredAndSortedDiagrams} onEdit={showModalFormDiagramEdit} onDelete={showModalFormDiagramDelete} />
      ) : (
        <Typography variant="body2" color="text.secondary">
          Нет карт, соответствующих фильтру
        </Typography>
      )}
    </Stack>
  );
};

export default Diagrams;
