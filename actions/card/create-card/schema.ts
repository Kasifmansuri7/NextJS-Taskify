import { z } from 'zod';

export const CreateCard = z.object({
  title: z
    .string({
      required_error: 'Title is required.',
      invalid_type_error: 'Title is required.',
    })
    .min(1, { message: 'Title cannot be empty.' }),
  boardId: z.string(),
  listId: z.string(),
});
