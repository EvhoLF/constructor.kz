/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Alert, Button, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import InputText from '../UI/InputText';
import InputPassword from '../UI/InputPassword';
import { useZodForm } from '@/hooks/useZodForm';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import signupSchema from '@/libs/validation/signupSchema';
import Frame from '../UI/Frame';
import InputLink from '../UI/InputLink';

const FormSignup = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const { data, formField, validate } = useZodForm(signupSchema, { name: '', email: '', password: '', confirmPassword: '', });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = validate();
    if (!valid) return;
    try {
      await axios.post('/api/signup', { name: data.name, email: data.email, password: data.password, });
      router.push('/auth/signin');
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Ошибка регистрации';
      setServerError(message);
    }
  };

  return (
    <Frame sx={{ padding: '1rem' }}>
      <Stack maxWidth={400} justifyContent='center' alignItems='center'>
        <Typography variant="h4" mb={3}>Регистрация</Typography>
        <form onSubmit={handleSubmit} noValidate>
          <Stack direction="column" gap={2}>
            <InputText size='mediumSmall' startIcon="user" fullWidth label="Имя" type="text" {...formField('name')} />
            <InputText size='mediumSmall' startIcon="email" fullWidth label="Email" type="email" {...formField('email')} />
            <InputPassword size='mediumSmall' startIcon="key" fullWidth label="Пароль" type="password" {...formField('password')} />
            <InputPassword size='mediumSmall' startIcon="key" fullWidth label="Повторите пароль" type="password" {...formField('confirmPassword')} />
            {serverError && <Alert severity="error">{serverError}</Alert>}
            <Button fullWidth variant="contained" type="submit">
              Зарегистрироваться
            </Button>
            <InputLink href='/auth/signin' textAlign='center' variant='body2'> Уже есть аккаунт? Войти</InputLink>
          </Stack>
        </form>
      </Stack>
    </Frame>
  );
};

export default FormSignup;
