import { z } from 'zod';

export const UpdateCardReorder = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
      title: z.string(),
      listId: z.string(),
    })
  ),
});
