import { z } from "zod";

const diagramFormTitleShema = z
  .object({
    title: z.string().min(1, 'Введите название'),
  });

export default diagramFormTitleShema;