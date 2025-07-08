import { z } from "zod";

const signupSchema = z
  .object({
    name: z.string().min(1, 'Введите имя'),
    email: z.string().min(1, 'Введите email').email('Неверный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string().min(1, 'Повторите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export default signupSchema;