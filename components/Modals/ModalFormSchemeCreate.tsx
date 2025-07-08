'use client';

import { enqueueSnackbar } from 'notistack';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import InputText from '../UI/InputText';
import { Scheme } from '@/app/generated/prisma';
import schemeFormTitleSchema from '@/libs/validation/schemeFormTitleShema';
import BaseModalForm from './BaseModalForm';

interface ModalFormSchemeCreateProps {
  setSchemes: React.Dispatch<React.SetStateAction<(Scheme & { isNew: boolean })[]>>;
}

const ModalFormSchemeCreate = ({ setSchemes }: ModalFormSchemeCreateProps) => {
  const { data: session } = useSession({ required: true });

  return (
    <BaseModalForm
      title="Создание схемы"
      schema={schemeFormTitleSchema}
      defaultValues={{ title: '' }}
      submitText="Создать"
      onSubmit={async (data) => {
        if (!session?.user.id) throw new Error('Нет ID пользователя');
        return axios.post('/api/scheme', { ...data, userId: session.user.id });
      }}
      onSuccess={(res) => {
        setSchemes(prev => [...prev, { ...res.data, isNew: true }]);
        enqueueSnackbar('Схема успешно создана', { variant: 'success' });
      }}
      renderForm={(formField, disabled) => (
        <InputText
          label="Название схемы"
          placeholder="Название"
          disabled={disabled}
          {...formField('title')}
        />
      )}
    />
  );
};

export default ModalFormSchemeCreate;
