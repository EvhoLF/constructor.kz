'use client';

import { enqueueSnackbar } from 'notistack';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import BaseModalConfirm from './BaseModalConfirm';
import { SuperDiagram } from '@/global';

interface ModalFormDiagramDeleteProps {
  api: string,
  id: number | string;
  title: string;
  setDiagrams: React.Dispatch<React.SetStateAction<(SuperDiagram & { isNew: boolean })[]>>;
}

const ModalFormDiagramDelete = ({api, id, title, setDiagrams }: ModalFormDiagramDeleteProps) => {
  const { data: session } = useSession({ required: true });

  return (
    <BaseModalConfirm
      title="Удаление схемы"
      message={<span>Вы точно хотите удалить схему: <strong>{title}</strong>?</span>}
      confirmText="Удалить"
      onConfirm={async () => {
        if (!session?.user.id) throw new Error('Нет ID пользователя');
        const res = await axios.delete(`${api}${id}`);
        if (!res?.data?.success) throw new Error('Удаление не удалось');
        return res?.data;
      }}
      onSuccess={() => {
        setDiagrams((prev) => prev.filter((diagram) => diagram.id !== id));
        enqueueSnackbar('Схема успешно удалена', { variant: 'success' });
      }}
    />
  );
};

export default ModalFormDiagramDelete;
