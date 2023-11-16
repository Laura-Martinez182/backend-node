import { z } from 'zod';

const roles = ["superadmin", "user"]

export const userSchema = z.object({
    name: z.string().min(5,"Name must be at least 5 characters long").max(255,"Name must be shorter than 255 characters"),
    email: z.string().email({
        message: "Invalid email",
    }),
    password: z.string().min(6, "Weak password"),
    role: z.string().refine((role) => roles.includes(role),{
        message:'Role must be one the following: ' + roles.join(', '),
    })
});