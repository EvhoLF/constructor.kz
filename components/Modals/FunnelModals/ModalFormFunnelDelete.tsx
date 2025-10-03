'use client';

import { enqueueSnackbar } from 'notistack';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import BaseModalConfirm from '../BaseModalConfirm';
import { IFunnel } from '@/types/funnel';

interface ModalFormFunnelDeleteProps {
  api: string,
  id: number | string;
  title: string;
  setFunnels: React.Dispatch<React.SetStateAction<(IFunnel & { isNew: boolean })[]>>;
}

const ModalFormFunnelDelete = ({api, id, title, setFunnels }: ModalFormFunnelDeleteProps) => {
  const { data: session } = useSession({ required: true });

  return (
    <BaseModalConfirm
      title="Удаление воронки"
      message={<span>Вы точно хотите удалить воронку: <strong>{title}</strong>?</span>}
      confirmText="Удалить"
      onConfirm={async () => {
        if (!session?.user.id) throw new Error('Нет ID пользователя');
        const res = await axios.delete(`${api}/${id}`);
        if (!res.data.success) throw new Error('Удаление не удалось');
        return res.data;
      }}
      onSuccess={() => {
        setFunnels((prev) => prev.filter((funnel) => funnel.id !== id));
        enqueueSnackbar('Воронка успешно удалена', { variant: 'success' });
      }}
    />
  );
};

export default ModalFormFunnelDelete;