import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const auth = async (req: Request, res:Response, next:NextFunction) => {
    try{
        let token = req.headers.authorization

        if(!token){
            return res.status(401).json({message:"Not Authorized"})
        }

        token = token.replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.JWT_SECRET || "")

        req.body.loggeduser = decoded

        next()
    }
    catch(error){
        res.status(500).json(error)
    }
}




export default auth