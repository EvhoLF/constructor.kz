'use client';

import { Button, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import SchemeList from './SchemeList';
import SchemeFilterPanel, { SortOption } from './SchemeFilterPanel';
import { useModal } from '@/hooks/useModal';
import ModalFormSchemeCreate from '../Modals/ModalFormSchemeCreate';
import ModalFormSchemeEdit from '../Modals/ModalFormSchemeEdit';
import ModalFormSchemeDelete from '../Modals/ModalFormSchemeDelete';
import { Scheme } from '.prisma/client';
import Icon from '../UI/Icon';

const Schemes = () => {
  const { showModal } = useModal();
  const { data: session } = useSession({ required: true });
  const [schemes, setSchemes] = useState<(Scheme & { isNew: boolean })[]>([]);

  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('updatedAt_desc');

  useEffect(() => {
    if (!session?.user.id) return;
    axios
      .get(`/api/scheme/user/${session.user.id}`)
      .then((res) => {
        if (res.data) setSchemes(res.data);
      })
      .catch((err) => {
        console.error('Ошибка при загрузке карт:', err);
      });
  }, [session?.user.id]);

  const filteredAndSortedSchemes = useMemo(() => {
    const [field, order] = sortOption.split('_') as ['title' | 'createdAt' | 'updatedAt', 'asc' | 'desc'];

    const filtered = schemes.filter((scheme) =>
      scheme.title.toLowerCase().includes(search.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      if (field === 'createdAt' || field === 'updatedAt') {
        aValue = new Date(a[field]).getTime();
        bValue = new Date(b[field]).getTime();
      }
      else {
        aValue = a[field] as string;
        bValue = b[field] as string;
      }
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [schemes, search, sortOption]);


  const showModalFormSchemeCreate = () => { showModal({ content: <ModalFormSchemeCreate setSchemes={setSchemes} /> }); }
  const showModalFormSchemeEdit = (id: string | number, title: string) => () => { showModal({ content: <ModalFormSchemeEdit id={id} title={title} setSchemes={setSchemes} /> }); };
  const showModalFormSchemeDelete = (id: string | number, title: string) => () => { showModal({ content: <ModalFormSchemeDelete id={id} title={title} setSchemes={setSchemes} /> }); };


  // const showModalFormSchemeOptions = (idScheme: string) => {
  //   const mapData = maps.find(e => e.id == idScheme);
  //   if (mapData) showModal({ content: <ModalFormSchemeOptions idScheme={idScheme} data={mapData} setSchemes={setSchemes} closeModal={closeModal} /> });
  // };

  return (
    <Stack spacing={2} padding={1}>
      <Stack width='100%' direction='row' gap={1}>
        <SchemeFilterPanel search={search} onSearchChange={setSearch} sortOption={sortOption} onSortOptionChange={setSortOption} />
        <Button sx={{ width: '200px' }} startIcon={<Icon icon='add' />} variant='contained' onClick={showModalFormSchemeCreate}>Новая схема</Button>
      </Stack>

      {filteredAndSortedSchemes.length > 0 ? (
        <SchemeList schemes={filteredAndSortedSchemes} onEdit={showModalFormSchemeEdit} onDelete={showModalFormSchemeDelete} />
      ) : (
        <Typography variant="body2" color="text.secondary">
          Нет карт, соответствующих фильтру
        </Typography>
      )}
    </Stack>
  );
};

export default Schemes;
