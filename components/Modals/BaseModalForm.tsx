/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useAsync } from '@/hooks/useAsync';
import { useModal } from '@/hooks/useModal';
import { useZodForm } from '@/hooks/useZodForm';
import StackRow from '../UI/StackRow';
import React from 'react';
import type { z } from 'zod';

interface BaseModalFormProps<T extends z.ZodTypeAny> {
  title?: string;
  schema: T;
  defaultValues: z.infer<T>;
  onSubmit: (data: z.infer<T>) => Promise<any>;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  submitText?: string;
  renderForm: (formField: ReturnType<typeof useZodForm<T>>['formField'], disabled: boolean) => React.ReactNode;
  closeModal?: () => void;
}

function BaseModalForm<T extends z.ZodTypeAny>({
  title = 'Форма',
  schema,
  defaultValues,
  onSubmit,
  onSuccess,
  onError,
  submitText = 'Сохранить',
  renderForm,
  closeModal = () => { },
}: BaseModalFormProps<T>) {
  const { asyncFn, loading, Loader } = useAsync();
  const { formField, data, validate } = useZodForm(schema, defaultValues);
  const { closeModal: closeModalHook } = useModal();

  const onClose = () => {
    closeModal();
    closeModalHook();
  };

  const handleSubmit = async () => {
    try {
      const isValid = validate();
      if (!isValid) return;
      const response = await asyncFn(() => onSubmit(data));
      onSuccess?.(response);
      onClose();
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      enqueueSnackbar('Ошибка при отправке формы', { variant: 'error' });
      onError?.(error);
    }
  };

  return (
    <Stack p={2} spacing={3}>
      <Typography variant="h5">{title}</Typography>
      {renderForm(formField, loading)}
      <Stack justifyContent="end" direction="row" spacing={2}>
        <Button onClick={onClose} disabled={loading} color="error">Отмена</Button>
        <Button onClick={handleSubmit} disabled={loading} color="primary" variant="contained">
          <StackRow>{submitText} <Loader /></StackRow>
        </Button>
      </Stack>
    </Stack>
  );
}

export default BaseModalForm;
