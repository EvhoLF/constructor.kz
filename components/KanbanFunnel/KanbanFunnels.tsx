'use client';
import { Button, Stack, Typography, CircularProgress, Box } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useModal } from '@/hooks/useModal';
import Icon from '../UI/Icon';
import { IKanbanFunnel } from '@/types/kanban';
import KanbanFilterPanel, { SortOption } from './KanbanFilterPanel';
import KanbanList from './KanbanList';
import ModalFormKanbanCreate from '../Modals/KanbanModels/ModalFormKanbanCreate';
import ModalFormKanbanEdit from '../Modals/KanbanModels/ModalFormKanbanEdit';
import ModalFormKanbanDelete from '../Modals/KanbanModels/ModalFormKanbanDelete';

const KanbanFunnels = () => {
  const { showModal } = useModal();
  const { data: session } = useSession({ required: true });
  const [kanbans, setKanbans] = useState<(IKanbanFunnel & { isNew: boolean })[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('updatedAt_desc');

  const API_BASE = '/api/kanban';

  useEffect(() => {
    if (!session?.user.id) return;

    setLoading(true);
    axios
      .get(`${API_BASE}/user/${session.user.id}`)
      .then((res) => {
        if (res.data) {
          const kanbansWithParsedData = res.data.map((kanban: any) => ({
            ...kanban,
            columns: kanban.columns ? JSON.parse(kanban.columns) : [],
            blocks: kanban.blocks ? JSON.parse(kanban.blocks) : [],
            style: kanban.style ? JSON.parse(kanban.style) : {},
          }));
          setKanbans(kanbansWithParsedData);
        }
      })
      .catch((err) => {
        console.error('Ошибка при загрузке канбан воронок:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [session?.user.id]);

  const filteredAndSortedKanbans = useMemo(() => {
    const [field, order] = sortOption.split('_') as ['title' | 'createdAt' | 'updatedAt', 'asc' | 'desc'];

    const filtered = kanbans.filter((kanban) =>
      kanban.title.toLowerCase().includes(search.toLowerCase())
    );

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
  }, [kanbans, search, sortOption]);

  const showModalFormKanbanCreate = () => {
    showModal({ content: <ModalFormKanbanCreate api={API_BASE} setKanbans={setKanbans} /> });
  };

  const showModalFormKanbanEdit = (id: string | number, title: string) => () => {
    showModal({ content: <ModalFormKanbanEdit api={API_BASE} id={id} title={title} setKanbans={setKanbans} /> });
  };

  const showModalFormKanbanDelete = (id: string | number, title: string) => () => {
    showModal({ content: <ModalFormKanbanDelete api={API_BASE} id={id} title={title} setKanbans={setKanbans} /> });
  };

  return (
    <Stack spacing={2} padding={1}>
      <Stack width="100%" direction="row" gap={1} alignItems="center">
        <KanbanFilterPanel
          search={search}
          onSearchChange={setSearch}
          sortOption={sortOption}
          onSortOptionChange={setSortOption}
        />
        <Button
          size="large"
          sx={{ width: '200px' }}
          startIcon={<Icon icon="add" />}
          variant="contained"
          onClick={showModalFormKanbanCreate}
        />
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1} minHeight="200px">
          <CircularProgress />
        </Box>
      ) : filteredAndSortedKanbans.length > 0 ? (
        <KanbanList
          kanbans={filteredAndSortedKanbans}
          onEdit={showModalFormKanbanEdit}
          onDelete={showModalFormKanbanDelete}
        />
      ) : (
        <Typography variant="body2" color="text.secondary">
          Нет канбан воронок, соответствующих фильтру
        </Typography>
      )}
    </Stack>
  );
};

export default KanbanFunnels;
