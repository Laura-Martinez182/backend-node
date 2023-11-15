import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userService from "../services/user.service";
import { UserDocument } from "../models/user.model";
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