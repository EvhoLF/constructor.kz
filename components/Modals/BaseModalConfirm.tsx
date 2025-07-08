/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useAsync } from '@/hooks/useAsync';
import { useModal } from '@/hooks/useModal';
import StackRow from '../UI/StackRow';
import React from 'react';

interface BaseModalConfirmProps {
  title?: string;
  message?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<any>;
  onSuccess?: (res: any) => void;
  onError?: (error: any) => void;
  closeModal?: () => void;
}

const BaseModalConfirm: React.FC<BaseModalConfirmProps> = ({
  title = 'Подтверждение',
  message = 'Вы уверены, что хотите продолжить?',
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  onConfirm,
  onSuccess,
  onError,
  closeModal = () => { },
}) => {
  const { asyncFn, loading, Loader } = useAsync();
  const { closeModal: closeModalHook } = useModal();

  const handleClose = () => {
    closeModal();
    closeModalHook();
  };

  const handleConfirm = async () => {
    try {
      const res = await asyncFn(onConfirm);
      onSuccess?.(res);
      handleClose();
    } catch (err) {
      console.error('Ошибка подтверждения:', err);
      enqueueSnackbar('Произошла ошибка', { variant: 'error' });
      onError?.(err);
    }
  };

  return (
    <Stack p={2} spacing={3}>
      <Typography variant="h5">{title}</Typography>
      <Typography>{message}</Typography>
      <Stack justifyContent="end" direction="row" spacing={2}>
        <Button onClick={handleClose} disabled={loading} color="error">
          {cancelText}
        </Button>
        <Button onClick={handleConfirm} disabled={loading} color="primary" variant="contained">
          <StackRow>{confirmText} <Loader /></StackRow>
        </Button>
      </Stack>
    </Stack>
  );
};

export default BaseModalConfirm;
