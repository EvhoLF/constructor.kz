'use client';
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import InputText from '../../UI/InputText';
import schemeFormTitleSchema from '@/libs/validation/schemeFormTitleShema';
import BaseModalForm from '../BaseModalForm';
import { IKanbanFunnel } from '@/types/kanban';

interface ModalFormKanbanEditProps {
  api: string;
  id: string | number;
  title: string;
  setKanbans: React.Dispatch<React.SetStateAction<(IKanbanFunnel & { isNew: boolean })[]>>;
}

const ModalFormKanbanEdit = ({ api, id, title, setKanbans }: ModalFormKanbanEditProps) => {
  const { data: session } = useSession({ required: true });

  return (
    <BaseModalForm
      title="Редактирование канбан доски"
      schema={schemeFormTitleSchema}
      defaultValues={{ title }}
      submitText="Обновить"
      onSubmit={async (data) => {
        if (!session?.user.id) throw new Error('Нет ID пользователя');
        const res = await axios.put(`${api}/${id}`, { title: data.title });
        return res.data;
      }}
      onSuccess={(updated) => {
        setKanbans((kanbans) =>
          kanbans.map((kanban) => kanban.id == id ? { ...kanban, ...updated } : kanban)
        );
        enqueueSnackbar('Канбан доска обновлена успешно', { variant: 'success' });
      }}
      renderForm={(formField, disabled) => (
        <InputText
          disabled={disabled}
          label="Название канбан доски"
          placeholder="Название"
          {...formField('title')}
        />
      )}
    />
  );
};

export default ModalFormKanbanEdit;