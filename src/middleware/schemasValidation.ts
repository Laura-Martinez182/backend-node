import { Request, Response, NextFunction } from 'express';
import {ZodError} from 'zod';

export const schemaValidation = (schema: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400)
                    .json(error.issues.map((issue) => ({ message: issue.message })));
            }
        }
    };
};