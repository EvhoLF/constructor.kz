import { z } from "zod";

const createUserSchema = z
  .object({
    name: z.string().min(1, 'Введите имя'),
    email: z.string().min(1, 'Введите email').email('Неверный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string().min(1, 'Повторите пароль'),
    role: z.enum(['user', 'admin']).default('user'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export default createUserSchema;