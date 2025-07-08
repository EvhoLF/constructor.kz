import { z } from "zod";

const signinSchema = z.object({
  email: z.string().min(1, 'Введите email').email('Неверный email'),
  password: z.string().min(1, 'Введите пароль'),
});

export default signinSchema