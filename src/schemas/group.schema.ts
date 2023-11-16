import { z } from 'zod';

export const groupSchema = z.object({
    name: z.string().min(5).max(255),
});
