'use client'
import { Alert, Button, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import InputText from '../UI/InputText'
import { useZodForm } from '@/hooks/useZodForm';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import InputPassword from '../UI/InputPassword';
import signinSchema from '@/libs/validation/signinSchema';
import Frame from '../UI/Frame';
import InputLink from '../UI/InputLink';

const FormSignin = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const { data, formField, validate } = useZodForm(signinSchema, { email: '', password: '', });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = validate();
    if (!valid) return;
    const res = await signIn('credentials', { ...data, redirect: false, });
    if (res?.error) setServerError('Неверный email или пароль');
    else router.push('/profile');
  };

  return (
    <Frame sx={{ padding: '1rem' }}>
      <Stack maxWidth={400} justifyContent='center' alignItems='center'>
        <Typography variant="h4" mb={3}>Вход</Typography>
        <form onSubmit={handleSubmit} noValidate>
          <Stack direction='column' gap={2}>
            <InputText size='mediumSmall' startIcon='email' fullWidth label='Email' type='email' {...formField('email')} />
            <InputPassword size='mediumSmall' startIcon='key' fullWidth label='Пароль' type='password' {...formField('password')} />
            {serverError && <Alert severity="error">{serverError}</Alert>}
            <Button fullWidth variant="contained" type="submit">Войти</Button>
            <InputLink href='/auth/signup' textAlign='center' variant='body2'>Нет аккаунта? Зарегистрируйтесь</InputLink>
          </Stack>
        </form>
      </Stack>
    </Frame>
  )
}

export default FormSignin