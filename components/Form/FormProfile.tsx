'use client'

import { useZodForm } from '@/hooks/useZodForm';
import profileSchema from '@/libs/validation/profileSchema';
import { Alert, Button, Stack, Typography } from '@mui/material'
import { signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react'
import InputText from '../UI/InputText';
import InputPassword from '../UI/InputPassword';
import axios from 'axios';
import Frame from '../UI/Frame';

const FormProfile = () => {
  const { data: session } = useSession({ required: true });

  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { data, formField, validate } = useZodForm(profileSchema, {
    name: session?.user.name || '',
    email: session?.user.email || '',
    currentPassword: '',
    password: '',
    confirmPassword: '',
  }, [session?.user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    const isValid = validate();
    if (!isValid) return;

    try {
      const res = await axios.patch('/api/profile', data, { withCredentials: true });
      if (res.status === 200) {
        setSuccessMessage('Профиль обновлён успешно');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setServerError(error?.response?.data?.error || 'Произошла ошибка');
    }
  };

  return (
    <Stack maxWidth={450} width='100%' justifyContent='center' alignItems='center'>
      <Frame sx={{ padding: '1rem' }}>
        <Typography variant="h4" mb={3} textAlign='center'>Профиль</Typography>
        <form style={{ width: '100%' }} onSubmit={handleSubmit} noValidate>
          <Stack direction='column' gap={2}>
            <InputText size='mediumSmall' startIcon='user' fullWidth label='Имя' {...formField('name')} />
            <InputText size='mediumSmall' startIcon='email' fullWidth label='Email' type='email' {...formField('email')} />
            <InputPassword size='mediumSmall' label="Текущий пароль" fullWidth {...formField('currentPassword')} />
            <Stack direction='row' gap={2}>
              <InputPassword size='mediumSmall' label="Новый пароль" fullWidth {...formField('password')} />
              <InputPassword size='mediumSmall' label="Повторите пароль" fullWidth {...formField('confirmPassword')} />
            </Stack>
            {serverError && <Alert severity="error">{serverError}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            <Button fullWidth variant="contained" type="submit">Сохранить</Button>
            <Button fullWidth color="error" variant="outlined" onClick={() => signOut({ callbackUrl: '/auth/signin' })} >
              Выйти из аккаунта
            </Button>
          </Stack>
        </form >
      </Frame>
    </Stack >
  );
};

export default FormProfile;
