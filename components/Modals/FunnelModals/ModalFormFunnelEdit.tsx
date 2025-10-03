'use client';

import { enqueueSnackbar } from 'notistack';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import InputText from '../../UI/InputText';
import schemeFormTitleSchema from '@/libs/validation/schemeFormTitleShema';
import BaseModalForm from '../BaseModalForm';
import { IFunnel } from '@/types/funnel';

interface ModalFormFunnelEditProps {
  api: string,
  id: string | number;
  title: string;
  setFunnels: React.Dispatch<React.SetStateAction<(IFunnel & { isNew: boolean })[]>>;
}

const ModalFormFunnelEdit = ({ api, id, title, setFunnels }: ModalFormFunnelEditProps) => {
  const { data: session } = useSession({ required: true });

  return (
    <BaseModalForm
      title="Редактирование воронки"
      schema={schemeFormTitleSchema}
      defaultValues={{ title }}
      submitText="Обновить"
      onSubmit={async (data) => {
        if (!session?.user.id) throw new Error('Нет ID пользователя');
        const res = await axios.put(`${api}/${id}`, { title: data.title });
        return res.data;
      }}
      onSuccess={(updated) => {
        setFunnels((funnels) =>
          funnels.map((funnel) => funnel.id == id ? { ...funnel, ...updated } : funnel)
        );
        enqueueSnackbar('Воронка обновлена успешно', { variant: 'success' });
      }}
      renderForm={(formField, disabled) => (
        <>
          <InputText
            disabled={disabled}
            label="Название воронки"
            placeholder="Название"
            {...formField('title')}
          />
        </>
      )}
    />
  );
};

export default ModalFormFunnelEdit;