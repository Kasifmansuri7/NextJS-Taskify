import { z } from 'zod';

export const DeleteCard = z.object({
  id: z.string(),
  listId: z.string(),
  boardId: z.string(),
});
