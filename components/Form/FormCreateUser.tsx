/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Alert, Button, Stack, Switch, Typography } from '@mui/material';
import React, { useState } from 'react';
import InputText from '../UI/InputText';
import InputPassword from '../UI/InputPassword';
import { useZodForm } from '@/hooks/useZodForm';
import { useRouter } from 'next/navigation';

import createUserSchema from '@/libs/validation/createUserSchema';
import Frame from '../UI/Frame';
import InputLink from '../UI/InputLink';
import axiosClient from '@/libs/axiosClient';
import { enqueueSnackbar } from 'notistack';


const initialUserForm = {
  name: '', email: '', password: '', confirmPassword: '', role: 'user' as 'user' | 'admin'
};

const FormCreateUser = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const { data, setData, formField, validate } = useZodForm(createUserSchema, initialUserForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = validate();
    if (!valid) return;
    try {
      await axiosClient.post('/signup', { name: data.name, email: data.email, password: data.password, role: data.role });
      // router.push('/auth/signin');
      setData(initialUserForm);
      enqueueSnackbar('Пользователь создан', { variant: 'success' });
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Ошибка регистрации';
      setServerError(message);
      enqueueSnackbar('Ошибка. Пользователь не создан', { variant: 'error' });

    }
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRole = event.target.checked ? 'admin' : 'user';
    setData({ ...data, role: newRole });
  };

  return (
    <Frame sx={{ padding: '1rem' }}>
      <Stack maxWidth={400} justifyContent='center' alignItems='center'>
        <Typography variant="h4" mb={3}>Создать пользователя</Typography>
        <form onSubmit={handleSubmit} noValidate>
          <Stack direction="column" gap={2}>
            <InputText size='mediumSmall' startIcon="user" fullWidth label="Имя" placeholder='Имя' type="text" {...formField('name')} />
            <InputText size='mediumSmall' startIcon="email" fullWidth label="Email" placeholder='Email' type="email" {...formField('email')} />
            <InputPassword size='mediumSmall' startIcon="key" fullWidth label="Пароль" placeholder='Пароль' type="password" {...formField('password')} />
            <InputPassword size='mediumSmall' startIcon="key" fullWidth label="Повторите пароль" placeholder='Пароль' type="password" {...formField('confirmPassword')} />
            <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
              <label htmlFor="switch-userRole" style={{ cursor: 'pointer' }}>
                <Typography sx={{ userSelect: 'none' }}>
                  {data.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </Typography>
              </label>
              <Switch
                id='switch-userRole'
                checked={data.role === 'admin'}
                onChange={handleRoleChange}
              />
            </Stack>
            {serverError && <Alert severity="error">{serverError}</Alert>}
            <Button fullWidth variant="contained" type="submit">
              Создать пользователя
            </Button>
          </Stack>
        </form>
      </Stack>
    </Frame>
  );
};

export default FormCreateUser;
