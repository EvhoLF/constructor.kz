'use client';

import { enqueueSnackbar } from 'notistack';

import { useSession } from 'next-auth/react';
import InputText from '../UI/InputText';
import schemeFormTitleSchema from '@/libs/validation/schemeFormTitleShema';
import BaseModalForm from './BaseModalForm';
import { SuperDiagram } from '@/types/diagrams';
import { useAutoFocus } from '@/hooks/useAutoFocus';
import axiosClient from '@/libs/axiosClient';

interface ModalDiagramEditProps {
  api: string,
  id: string | number;
  title: string;
  setDiagrams: React.Dispatch<React.SetStateAction<(SuperDiagram & { isNew: boolean })[]>>;
}

const ModalDiagramEdit = ({ api, id, title, setDiagrams }: ModalDiagramEditProps) => {
  const { data: session } = useSession({ required: true });

  const autoFocusRef = useAutoFocus();

  return (
    <BaseModalForm
      title="Редактирование схемы"
      schema={schemeFormTitleSchema}
      defaultValues={{ title }}
      submitText="Обновить"
      onSubmit={async (data) => {
        if (!session?.user.id) throw new Error('Нет ID пользователя');
        const res = await axiosClient.put(`${api}${id}`, { title: data.title });
        return res?.data;
      }}
      onSuccess={(updated) => {
        setDiagrams((diagrams) =>
          diagrams.map((diagram) => diagram.id == id ? { ...diagram, ...updated } : diagram)
        );
        enqueueSnackbar('Схема обновлена успешно', { variant: 'success' });
      }}
      renderForm={(formField, disabled) => (
        <>
          <InputText
            inputRef={autoFocusRef}
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

export default ModalDiagramEdit;
