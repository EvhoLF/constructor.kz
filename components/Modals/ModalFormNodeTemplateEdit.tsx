'use client';

import { useSession } from 'next-auth/react';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { z } from 'zod';
import BaseModalForm from './BaseModalForm';
import InputText from '../UI/InputText';
import { SuperDiagram } from '@/global';

interface Props {
  api: string,
  id: number;
  title: string;
  category: string;
  setTemplates: React.Dispatch<React.SetStateAction<(SuperDiagram & { isNew: boolean })[]>>;
}

const schema = z.object({
  title: z.string().min(1, 'Введите название'),
  category: z.string().min(1, 'Введите категорию'),
});

const ModalFormNodeTemplateEdit = ({api, id, title, category, setTemplates }: Props) => {
  const { data: session } = useSession({ required: true });

  return (
    <BaseModalForm
      title="Редактирование шаблона"
      schema={schema}
      defaultValues={{ title, category }}
      submitText="Обновить"
      onSubmit={async (data) => {
        if (!session?.user.id) throw new Error('Нет пользователя');
        const res = await axios.put(`${api}${id}`, data);
        return res?.data;
      }}
      onSuccess={(updated) => {
        setTemplates((prev) =>
          prev.map((tpl) => (tpl.id === id ? { ...tpl, ...updated } : tpl))
        );
        enqueueSnackbar('Шаблон обновлён', { variant: 'success' });
      }}
      renderForm={(formField, disabled) => (
        <>
          <InputText label="Название" disabled={disabled} {...formField('title')} />
          <InputText label="Категория" disabled={disabled} {...formField('category')} />
        </>
      )}
    />
  );
};

export default ModalFormNodeTemplateEdit;
