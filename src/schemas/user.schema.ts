import { z } from 'zod';

export const userSchema = z.object({
    name: z.string().min(5).max(255),
    email: z.string().email({
        message: "Correo electronico invalido",
    }),
    password: z.string().min(6, "Contraseña débil")
});