/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { z, ZodSchema } from 'zod';

// Типы для формы
export interface FormFieldProps {
  name: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  helperText: string | undefined;
}

export function useZodForm<T extends ZodSchema<any>>(
  schema: T,
  initialData: z.infer<T>,
  deps: any[] = []
) {
  type FormData = z.infer<T>;
  type FieldName = keyof FormData & string; // Гарантируем, что это строка

  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

  useEffect(() => {
    setData(initialData);
  }, deps);

  const validate = (): FormData | null => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Partial<Record<FieldName, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as FieldName;
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

  const formField = (name: FieldName): FormFieldProps => ({
    name: name as string,
    value: data[name],
    onChange: handleChange,
    error: !!errors[name],
    helperText: errors[name],
  });

  return { data, errors, handleChange, validate, formField, setData };
}