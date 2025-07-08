'use client'
import { useAsync } from '@/hooks/useAsync';
import { useModal } from '@/hooks/useModal';
import { Button, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { enqueueSnackbar } from 'notistack';
import StackRow from '../UI/StackRow';
import { Scheme } from '@/app/generated/prisma';

interface ModalFormSchemeDelete {
  id: string | number,
  title: string,
  setSchemes: React.Dispatch<React.SetStateAction<(Scheme & { isNew: boolean })[]>>,
  closeModal?: () => void;
}

const ModalFormSchemeDelete = ({ id, title, setSchemes, closeModal = () => { } }: ModalFormSchemeDelete) => {
  const { asyncFn, loading, Loader } = useAsync();
  const { closeModal: closeModalUse } = useModal();
  const { data: session } = useSession({ required: true });

  const onCloseModal = () => { closeModal(); closeModalUse(); }

  const handler = async () => {
    try {
      if (!session?.user.id) return;
      const res = await asyncFn(() => axios.delete(`/api/scheme/${id}`));
      if (!res || !res?.data.success) return
      setSchemes(prev => prev.filter(scheme => scheme.id !== id));
      onCloseModal();
      enqueueSnackbar('Cхема удалена успешно', { variant: 'success' });
    }
    catch (err) {
      console.error('Ошибка при удалении схемы:', err);
      enqueueSnackbar('Ошибка при удалении схемы', { variant: 'error' });
    }
  };
  return (
    <Stack p={2} spacing={3}>
      <Typography variant='h5'>Удаление схемы</Typography>
      <Typography>Cхема: {title}</Typography>
      <Stack justifyContent='end' direction='row' spacing={2}>
        <Button disabled={loading} onClick={onCloseModal} color="error">Отмена</Button>
        <Button disabled={loading} onClick={handler} color="primary" variant="contained">
          <StackRow>Удалить <Loader /></StackRow>
        </Button>
      </Stack>
    </Stack>
  );
};

export default ModalFormSchemeDelete;