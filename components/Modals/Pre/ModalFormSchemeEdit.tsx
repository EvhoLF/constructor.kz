'use client'
import { Button, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

import { useModal } from '@/hooks/useModal';
import schemeFormTitleShema from '@/libs/validation/schemeFormTitleShema';
import { useZodForm } from '@/hooks/useZodForm';
import { useSession } from 'next-auth/react';
import { useAsync } from '@/hooks/useAsync';
import { Ontology } from '.prisma/client';
import InputText from '@/components/UI/InputText';
import StackRow from '@/components/UI/StackRow';
import axiosClient from '@/libs/axiosClient';

interface ModalFormSchemeEdit {
  id: string | number,
  title: string,
  setSchemes: React.Dispatch<React.SetStateAction<(Ontology & { isNew: boolean })[]>>,
  closeModal?: () => void;
}

const ModalFormSchemeEdit = ({ id, title, setSchemes, closeModal = () => { } }: ModalFormSchemeEdit) => {
  const { asyncFn, loading, Loader } = useAsync();
  const { data, formField, validate } = useZodForm(schemeFormTitleShema, { title: title || '', });
  const { closeModal: closeModalUse } = useModal();
  const { data: session } = useSession({ required: true });

  const onCloseModal = () => { closeModal(); closeModalUse(); }

  const handler = async () => {
    try {
      const isValid = validate();
      if (!isValid || !session?.user.id) return;
      const res = await asyncFn(() => axiosClient.put(`/api/ontology/${id}`, { title: data.title }));
      if (!res) return;
      if (res?.data) {
        setSchemes((ontologys) => ontologys.map(ontology => ontology.id == id ? { ...ontology, ...res?.data } : ontology));
        enqueueSnackbar('Cхема обновлена успешно', { variant: 'success' });
        onCloseModal();
      }
    }
    catch (err) {
      console.error('Ошибка при обновлении схемы:', err);
      enqueueSnackbar('Ошибка при обновлении схемы', { variant: 'error' });
    }
  };
  return (
    <Stack p={2} spacing={3}>
      <Typography variant='h5'>Редактирование схемы</Typography>
      <Typography>Cхема: {title}</Typography>
      <InputText disabled={loading} label='Название карты' placeholder='Название' {...formField('title')} />
      <Stack justifyContent='end' direction='row' spacing={2}>
        <Button disabled={loading} onClick={onCloseModal} color="error">Отмена</Button>
        <Button disabled={loading} onClick={handler} color="primary" variant="contained">
          <StackRow>Обновить <Loader /></StackRow>
        </Button>
      </Stack>
    </Stack>
  );
};

export default ModalFormSchemeEdit;