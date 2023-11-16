import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * The auth function is a middleware that checks if a user is authorized by verifying their token and
 * adding the decoded user information to the request body.
 * @param {Request} req - The `req` parameter represents the HTTP request object, which contains
 * information about the incoming request such as headers, query parameters, and request body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to manipulate the response,
 * such as setting the status code, sending JSON data, or redirecting the client to another URL.
 * @param {NextFunction} next - The `next` parameter is a function that is used to pass control to the
 * next middleware function in the request-response cycle. It is typically called at the end of the
 * current middleware function to indicate that it has completed its processing and the next middleware
 * function should be called.
 */
const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: "Not Authorized" })
        }

        token = token.replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "")

        req.body.loggeduser = decoded

        next()
    }
    catch (error) {
        res.status(500).json(error)
    }
}

export default auth