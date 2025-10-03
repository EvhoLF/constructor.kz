'use client';
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import InputText from '../../UI/InputText';
import schemeFormTitleSchema from '@/libs/validation/schemeFormTitleShema';
import BaseModalForm from '../BaseModalForm';
import { IKanbanFunnel } from '@/types/kanban';
import { useKanbanFunnel } from '@/hooks/useKanbanFunnel';

interface ModalFormKanbanCreateProps {
  api: string;
  setKanbans: React.Dispatch<React.SetStateAction<(IKanbanFunnel & { isNew: boolean })[]>>;
}

const ModalFormKanbanCreate = ({ api, setKanbans }: ModalFormKanbanCreateProps) => {
  const { data: session } = useSession({ required: true });
  const { columns, blocks, funnelStyle } = useKanbanFunnel();

  return (
    <BaseModalForm
      title="Создание канбан доски"
      schema={schemeFormTitleSchema}
      defaultValues={{ title: '' }}
      submitText="Создать"
      onSubmit={async (data) => {
        if (!session?.user.id) throw new Error('Нет ID пользователя');
        
        return axios.post(api, { 
          ...data, 
          userId: session.user.id,
          columns,
          blocks,
          style: funnelStyle
        });
      }}
      onSuccess={(res) => {
        setKanbans(prev => [...prev, { ...res.data, isNew: true }]);
        enqueueSnackbar('Канбан доска успешно создана', { variant: 'success' });
      }}
      renderForm={(formField, disabled) => (
        <InputText
          label="Название канбан доски"
          placeholder="Название"
          disabled={disabled}
          {...formField('title')}
        />
      )}
    />
  );
};

export default ModalFormKanbanCreate;