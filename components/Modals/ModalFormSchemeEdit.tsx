'use client';

import { enqueueSnackbar } from 'notistack';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import InputText from '../UI/InputText';
import { Scheme } from '@/app/generated/prisma';
import schemeFormTitleSchema from '@/libs/validation/schemeFormTitleShema';
import BaseModalForm from './BaseModalForm';

interface ModalFormSchemeEditProps {
  id: string | number;
  title: string;
  setSchemes: React.Dispatch<React.SetStateAction<(Scheme & { isNew: boolean })[]>>;
}

const ModalFormSchemeEdit = ({ id, title, setSchemes }: ModalFormSchemeEditProps) => {
  const { data: session } = useSession({ required: true });

  return (
    <BaseModalForm
      title="Редактирование схемы"
      schema={schemeFormTitleSchema}
      defaultValues={{ title }}
      submitText="Обновить"
      onSubmit={async (data) => {
        if (!session?.user.id) throw new Error('Нет ID пользователя');
        const res = await axios.put(`/api/scheme/${id}`, { title: data.title });
        return res.data;
      }}
      onSuccess={(updated) => {
        setSchemes((schemes) =>
          schemes.map((scheme) => scheme.id == id ? { ...scheme, ...updated } : scheme)
        );
        enqueueSnackbar('Схема обновлена успешно', { variant: 'success' });
      }}
      renderForm={(formField, disabled) => (
        <>
          <InputText
            disabled={disabled}
            label="Название схемы"
            placeholder="Название"
            {...formField('title')}
          />
        </>
      )}
    />
  );
};

export default ModalFormSchemeEdit;
