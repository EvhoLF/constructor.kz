'use client';

import { useSession } from 'next-auth/react';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import BaseModalConfirm from './BaseModalConfirm';
import { NodeTemplate } from '.prisma/client';

interface Props {
  id: number;
  title: string;
  setTemplates: React.Dispatch<React.SetStateAction<(NodeTemplate & { isNew: boolean })[]>>;
}

const ModalFormNodeTemplateDelete = ({ id, title, setTemplates }: Props) => {
  const { data: session } = useSession({ required: true });

  return (
    <BaseModalConfirm
      title="Удаление шаблона"
      message={<>Вы уверены, что хотите удалить шаблон <strong>{title}</strong>?</>}
      confirmText="Удалить"
      onConfirm={async () => {
        if (!session?.user.id) throw new Error('Нет пользователя');
        const res = await axios.delete(`/api/node-template/${id}`);
        if (!res.data.success) throw new Error('Удаление не удалось');
        return res.data;
      }}
      onSuccess={() => {
        setTemplates((prev) => prev.filter((tpl) => tpl.id !== id));
        enqueueSnackbar('Шаблон удалён', { variant: 'success' });
      }}
    />
  );
};

export default ModalFormNodeTemplateDelete;
