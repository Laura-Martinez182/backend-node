import { z } from 'zod';

/* The code is defining a schema for a group object using the Zod library for input validation. */
export const groupSchema = z.object({
    name: z.string().min(5,"Group name must be at least 5 characters long").max(255,"Group name must be shorter than 255 characters"),
});
