import { z } from 'zod';

export const CreateBoard = z.object({
  title: z
    .string({
      required_error: 'title is required',
      invalid_type_error: 'title is required',
    })
    .min(3, {
      message: 'title is too short',
    }),
});
