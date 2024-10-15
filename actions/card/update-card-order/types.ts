import { z } from 'zod';
import { Card } from '@prisma/client';

import { ActionState } from '@/lib/create-safe-action';
import { UpdateCardReorder } from './schema';

export type InputType = z.infer<typeof UpdateCardReorder>;
export type ReturnType = ActionState<InputType, Card[]>;
