import { z } from 'zod';

export const UpdateCard = z.object({
  id: z.string(),
  title: z.optional(
    z
      .string({
        required_error: 'Title is required.',
        invalid_type_error: 'Title is required.',
      })
      .min(1, { message: 'Title cannot be empty.' })
  ),
  description: z.optional(
    z
      .string({
        invalid_type_error: 'Description is required.',
      })
      .min(3, { message: 'Description is too short.' })
  ),
  listId: z.string(),
  boardId: z.string(),
});
