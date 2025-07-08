/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { z, ZodSchema } from 'zod';

export function useZodForm<T extends ZodSchema<any>>(
  schema: T,
  initialData: z.infer<T>,
  deps: any[] = [] // 👈 Добавили
) {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof data, string>>>({});

  useEffect(() => {
    setData(initialData); // 👈 теперь будет обновляться, если deps изменятся
  }, deps);

  const validate = () => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof data;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return null;
    }
    setErrors({});
    return result.data;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const formField = (name: keyof typeof data) => ({
    name,
    value: data[name],
    onChange: handleChange,
    error: !!errors[name],
    helperText: errors[name],
  });

  return { data, errors, handleChange, validate, formField, setData };
}
