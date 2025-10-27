'use client';

import { enqueueSnackbar } from 'notistack';

import { useSession } from 'next-auth/react';
import InputText from '../UI/InputText';
import schemeFormTitleSchema from '@/libs/validation/schemeFormTitleShema';
import BaseModalForm from './BaseModalForm';
import { SuperDiagram } from '@/types/diagrams';
import { useRef } from 'react';
import { useAutoFocus } from '@/hooks/useAutoFocus';
import axiosClient from '@/libs/axiosClient';


interface ModalDiagramCreateProps {
  api: string,
  setDiagrams: React.Dispatch<React.SetStateAction<(SuperDiagram & { isNew: boolean })[]>>;
}

const ModalDiagramCreate = ({ api, setDiagrams }: ModalDiagramCreateProps) => {
  const { data: session } = useSession({ required: true });

  const autoFocusRef = useAutoFocus();

  return (
    <BaseModalForm
      title="Создание схемы"
      schema={schemeFormTitleSchema}
      defaultValues={{ title: '' }}
      submitText="Создать"
      onSubmit={async (data) => {
        if (!session?.user.id) throw new Error('Нет ID пользователя');
        return axiosClient.post(api, { ...data, userId: session.user.id });
      }}
      onSuccess={(res) => {
        setDiagrams(prev => [...prev, { ...res?.data, isNew: true }]);
        enqueueSnackbar('Схема успешно создана', { variant: 'success' });
      }}
      renderForm={(formField, disabled) => (
        <InputText
          inputRef={autoFocusRef}
          label="Название схемы"
          placeholder="Название"
          disabled={disabled}
          {...formField('title')}
        />
      )}
    />
  );
};

export default ModalDiagramCreate;
