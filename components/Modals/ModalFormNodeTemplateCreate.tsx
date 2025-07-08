'use client';

import { useSession } from 'next-auth/react';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { z } from 'zod';
import InputText from '../UI/InputText';
import BaseModalForm from './BaseModalForm';
import { NodeTemplate } from '@/app/generated/prisma';

interface Props {
  setTemplates: React.Dispatch<React.SetStateAction<(NodeTemplate & { isNew: boolean })[]>>;
}

const schema = z.object({
  title: z.string().min(1, 'Введите название'),
  category: z.string().min(1, 'Введите категорию'),
});

const ModalFormNodeTemplateCreate = ({ setTemplates }: Props) => {
  const { data: session } = useSession({ required: true });

  return (
    <BaseModalForm
      title="Создание шаблона"
      schema={schema}
      defaultValues={{ title: '', category: '' }}
      submitText="Создать"
      onSubmit={async (data) => {
        if (!session?.user.id) throw new Error('Нет пользователя');
        const res = await axios.post('/api/schemetemplate', {
          ...data,
          userId: session.user.id,
        });
        return res.data;
      }}
      onSuccess={(created) => {
        setTemplates((prev) => [...prev, { ...created, isNew: true }]);
        enqueueSnackbar('Шаблон создан', { variant: 'success' });
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

export default ModalFormNodeTemplateCreate;
