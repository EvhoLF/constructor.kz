'use client';

import { enqueueSnackbar } from 'notistack';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import InputText from '../../UI/InputText';
import schemeFormTitleSchema from '@/libs/validation/schemeFormTitleShema';
import BaseModalForm from '../BaseModalForm';
import { IFunnel } from '@/types/funnel';
import { v4 as uuidv4 } from 'uuid';

interface ModalFormFunnelCreateProps {
  api: string,
  setFunnels: React.Dispatch<React.SetStateAction<(IFunnel & { isNew: boolean })[]>>;
}

const ModalFormFunnelCreate = ({ api, setFunnels }: ModalFormFunnelCreateProps) => {
  const { data: session } = useSession({ required: true });

  return (
    <BaseModalForm
      title="Создание воронки"
      schema={schemeFormTitleSchema}
      defaultValues={{ title: '' }}
      submitText="Создать"
      onSubmit={async (data) => {
        if (!session?.user.id) throw new Error('Нет ID пользователя');
        
        const defaultBlocks = [
          { id: uuidv4(), order: 1, title: 'Шаг 1', description: 'Описание', color: '#2196f3' },
          { id: uuidv4(), order: 2, title: 'Шаг 2', description: 'Описание', color: '#4caf50' },
        ];

        return axios.post(api, { 
          ...data, 
          userId: session.user.id,
          blocks: defaultBlocks 
        });
      }}
      onSuccess={(res) => {
        setFunnels(prev => [...prev, { ...res?.data, isNew: true }]);
        enqueueSnackbar('Воронка успешно создана', { variant: 'success' });
      }}
      renderForm={(formField, disabled) => (
        <InputText
          label="Название воронки"
          placeholder="Название"
          disabled={disabled}
          {...formField('title')}
        />
      )}
    />
  );
};

export default ModalFormFunnelCreate;