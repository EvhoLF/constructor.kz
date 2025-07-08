import { z } from "zod";

const profileSchema = z
  .object({
    name: z.string().min(1, 'Введите имя'),
    email: z.string().email('Неверный email'),
    currentPassword: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => !data.password || data.password.length >= 6, {
    message: 'Минимум 6 символов',
    path: ['password'],
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })
  .refine((data) => !data.password || data.currentPassword?.length, {
    message: 'Введите текущий пароль',
    path: ['currentPassword'],
  });

export default profileSchema;