'use client';

import { Button, Stack, Typography, CircularProgress, Box } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useModal } from '@/hooks/useModal';
import Icon from '../UI/Icon';
import { IFunnel } from '@/types/funnel';
import ModalFormFunnelCreate from '../Modals/FunnelModals/ModalFormFunnelCreate';
import ModalFormFunnelEdit from '../Modals/FunnelModals/ModalFormFunnelEdit';
import ModalFormFunnelDelete from '../Modals/FunnelModals/ModalFormFunnelDelete';
import FunnelFilterPanel, { SortOption } from './FunnelFilterPanel';
import FunnelList from './FunnelList';

const Funnels = () => {
  const { showModal } = useModal();
  const { data: session } = useSession({ required: true });
  const [funnels, setFunnels] = useState<(IFunnel & { isNew: boolean })[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('updatedAt_desc');

  const API_BASE = '/api/funnel';

  useEffect(() => {
    if (!session?.user.id) return;

    setLoading(true);
    axios
      .get(`${API_BASE}/user/${session.user.id}`)
      .then((res) => {
        if (res.data) setFunnels(res.data);
      })
      .catch((err) => {
        console.error('Ошибка при загрузке воронок:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [session?.user.id]);

  const filteredAndSortedFunnels = useMemo(() => {
    const [field, order] = sortOption.split('_') as ['title' | 'createdAt' | 'updatedAt', 'asc' | 'desc'];

    const filtered = funnels.filter((funnel) =>
      funnel.title.toLowerCase().includes(search.toLowerCase())
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
  }, [funnels, search, sortOption]);

  const showModalFormFunnelCreate = () => {
    showModal({ content: <ModalFormFunnelCreate api={API_BASE} setFunnels={setFunnels} /> });
  };

  const showModalFormFunnelEdit = (id: string | number, title: string) => () => {
    showModal({ content: <ModalFormFunnelEdit api={API_BASE} id={id} title={title} setFunnels={setFunnels} /> });
  };

  const showModalFormFunnelDelete = (id: string | number, title: string) => () => {
    showModal({ content: <ModalFormFunnelDelete api={API_BASE} id={id} title={title} setFunnels={setFunnels} /> });
  };

  return (
    <Stack spacing={2} padding={1}>
      <Stack width="100%" direction="row" gap={1}>
        <FunnelFilterPanel
          search={search}
          onSearchChange={setSearch}
          sortOption={sortOption}
          onSortOptionChange={setSortOption}
        />
        <Button
          sx={{ width: '200px' }}
          startIcon={<Icon icon="add" />}
          variant="contained"
          onClick={showModalFormFunnelCreate}
        ></Button>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1} minHeight="200px">
          <CircularProgress />
        </Box>
      ) : filteredAndSortedFunnels.length > 0 ? (
        <FunnelList
          funnels={filteredAndSortedFunnels}
          onEdit={showModalFormFunnelEdit}
          onDelete={showModalFormFunnelDelete}
        />
      ) : (
        <Typography variant="body2" color="text.secondary">
          Нет воронок, соответствующих фильтру
        </Typography>
      )}
    </Stack>
  );
};

export default Funnels;
