import {Request, Response} from 'express';
import userService from '../services/user.service';
import {UserInput, UserDocument} from '../models/user.model';
import bcrypt from 'bcrypt';

class UserController {
    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const userExists: UserDocument | null = await userService.findByEmail(req.body.email);
            if(userExists){
                return res.status(400).json({message: "User already exists"});
            }
            req.body.password = await bcrypt.hash(req.body.password, 10);
            const user: UserDocument = await userService.create(req.body as UserInput);

            return res.status(201).json(user);

        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

export default new UserController();