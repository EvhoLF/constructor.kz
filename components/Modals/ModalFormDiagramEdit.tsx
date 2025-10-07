'use client';

import { enqueueSnackbar } from 'notistack';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import InputText from '../UI/InputText';
import schemeFormTitleSchema from '@/libs/validation/schemeFormTitleShema';
import BaseModalForm from './BaseModalForm';
import { SuperDiagram } from '@/global';

interface ModalFormDiagramEditProps {
  api: string,
  id: string | number;
  title: string;
  setDiagrams: React.Dispatch<React.SetStateAction<(SuperDiagram & { isNew: boolean })[]>>;
}

const ModalFormDiagramEdit = ({ api, id, title, setDiagrams }: ModalFormDiagramEditProps) => {
  const { data: session } = useSession({ required: true });

  return (
    <BaseModalForm
      title="Редактирование схемы"
      schema={schemeFormTitleSchema}
      defaultValues={{ title }}
      submitText="Обновить"
      onSubmit={async (data) => {
        if (!session?.user.id) throw new Error('Нет ID пользователя');
        const res = await axios.put(`${api}${id}`, { title: data.title });
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

export default ModalFormDiagramEdit;
