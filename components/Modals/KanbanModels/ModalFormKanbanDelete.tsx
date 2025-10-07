'use client';
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import BaseModalConfirm from '../BaseModalConfirm';
import { IKanbanFunnel } from '@/types/kanban';

interface ModalFormKanbanDeleteProps {
  api: string;
  id: number | string;
  title: string;
  setKanbans: React.Dispatch<React.SetStateAction<(IKanbanFunnel & { isNew: boolean })[]>>;
}

const ModalFormKanbanDelete = ({ api, id, title, setKanbans }: ModalFormKanbanDeleteProps) => {
  const { data: session } = useSession({ required: true });

  return (
    <BaseModalConfirm
      title="Удаление канбан доска"
      message={<span>Вы точно хотите удалить канбан доску: <strong>{title}</strong>?</span>}
      confirmText="Удалить"
      onConfirm={async () => {
        if (!session?.user.id) throw new Error('Нет ID пользователя');
        const res = await axios.delete(`${api}/${id}`);
        if (!res?.data?.success) throw new Error('Удаление не удалось');
        return res?.data;
      }}
      onSuccess={() => {
        setKanbans((prev) => prev.filter((kanban) => kanban.id !== id));
        enqueueSnackbar('Канбан доска успешно удалена', { variant: 'success' });
      }}
    />
  );
};

export default ModalFormKanbanDelete;