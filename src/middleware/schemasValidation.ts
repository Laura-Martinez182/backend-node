import { Request, Response, NextFunction } from 'express';
import {ZodError} from 'zod';

/**
 * Is a middleware function that validates the request body against a
 * given schema and returns a 400 response with error messages if the validation fails.
 * @param {any} schema - The `schema` parameter is an object that represents the validation rules for
 * the request body. It is created using the library Zod, which provides a way to define
 * and validate schemas.
 * @returns The function `schemaValidation` returns an asynchronous middleware function that takes in a
 * request (`req`), response (`res`), and next function (`next`).
 */
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