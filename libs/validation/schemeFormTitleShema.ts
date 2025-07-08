import { z } from "zod";

const schemeFormTitleShema = z
  .object({
    title: z.string().min(1, 'Введите название'),
  });

export default schemeFormTitleShema;