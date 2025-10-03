'use client';

import { enqueueSnackbar } from 'notistack';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import InputText from '../UI/InputText';
import schemeFormTitleSchema from '@/libs/validation/schemeFormTitleShema';
import BaseModalForm from './BaseModalForm';
import { SuperDiagram } from '@/global';

interface ModalFormDiagramCreateProps {
  api: string,
  setDiagrams: React.Dispatch<React.SetStateAction<(SuperDiagram & { isNew: boolean })[]>>;
}

const ModalFormDiagramCreate = ({ api, setDiagrams }: ModalFormDiagramCreateProps) => {
  const { data: session } = useSession({ required: true });

  return (
    <BaseModalForm
      title="Создание схемы"
      schema={schemeFormTitleSchema}
      defaultValues={{ title: '' }}
      submitText="Создать"
      onSubmit={async (data) => {
        if (!session?.user.id) throw new Error('Нет ID пользователя');
        return axios.post(api, { ...data, userId: session.user.id });
      }}
      onSuccess={(res) => {
        setDiagrams(prev => [...prev, { ...res.data, isNew: true }]);
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

export default ModalFormDiagramCreate;
