'use client';

import { enqueueSnackbar } from 'notistack';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Scheme } from '.prisma/client';
import BaseModalConfirm from './BaseModalConfirm';

interface ModalFormSchemeDeleteProps {
  id: number | string;
  title: string;
  setSchemes: React.Dispatch<React.SetStateAction<(Scheme & { isNew: boolean })[]>>;
}

const ModalFormSchemeDelete = ({ id, title, setSchemes }: ModalFormSchemeDeleteProps) => {
  const { data: session } = useSession({ required: true });

  return (
    <BaseModalConfirm
      title="Удаление схемы"
      message={<span>Вы точно хотите удалить схему: <strong>{title}</strong>?</span>}
      confirmText="Удалить"
      onConfirm={async () => {
        if (!session?.user.id) throw new Error('Нет ID пользователя');
        const res = await axios.delete(`/api/scheme/${id}`);
        if (!res.data.success) throw new Error('Удаление не удалось');
        return res.data;
      }}
      onSuccess={() => {
        setSchemes((prev) => prev.filter((scheme) => scheme.id !== id));
        enqueueSnackbar('Схема успешно удалена', { variant: 'success' });
      }}
    />
  );
};

export default ModalFormSchemeDelete;
