import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userService from "../services/user.service";
import { UserDocument } from "../models/user.model";


/**
 * The `auth_superadmin` function is a middleware that checks if the user making the request is a
 * superadmin.
 * @param {Request} req - The `req` parameter represents the HTTP request object, which contains
 * information about the incoming request such as headers, query parameters, and request body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client.
 * @param {NextFunction} next - The `next` parameter is a function that is used to pass control to the
 * next middleware function in the request-response cycle. 
 */
const auth_superadmin = async (req: Request, res:Response, next:NextFunction) => {
    try{
        let token = req.headers.authorization

        if(!token){
            return res.status(401).json({message:"Not Authorized"})
        }

        token = token.replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.JWT_SECRET || "")
        req.body.loggeduser = decoded

        const user : UserDocument | null = await userService.findById(req.body.loggeduser.user_id)

        if (user == null){
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role != "superadmin"){
            return res.status(401).json({message:"Not Authorized"})
        }

        next()
    }
    catch(error){
        res.status(500).json(error)
    }
}

export default auth_superadmin