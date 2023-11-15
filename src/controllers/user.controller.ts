import { Request, Response } from 'express';
import userService from '../services/user.service';
import { UserInput, UserDocument } from '../models/user.model';
import bcrypt from 'bcrypt';

class UserController {
    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const userExists: UserDocument | null = await userService.findByEmail(req.body.email);
            if (userExists) {
                return res.status(400).json({ message: "User already exists" });
            }
            req.body.password = await bcrypt.hash(req.body.password, 10);
            const user: UserDocument = await userService.create(req.body as UserInput);

            return res.status(201).json(user);

        } catch (error) {
            return res.status(500).json(error);
        }
    }

    public async findById(req: Request, res: Response) {
        try {
            const user: UserDocument | null = await userService.findById(req.params.id);
            if (user === null) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const user: UserDocument | null = await userService.findById(req.params.id);
            if (user === null) {
                return res.status(404).json({ message: "User not found" });
            }
            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
            }
            const updateUser: UserDocument | null = await userService.update(user, req.body)

            return res.status(200).json(updateUser)

        } catch (error) {
            res.status(500).json(error);
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const user: UserDocument | null = await userService.findById(req.params.id);

            if (user === null) {
                return res.status(404).json({ message: "User not found" });
            }
            
            const deletedUser: UserDocument | null = await userService.delete(req.params.id);

            return res.status(200).json(deletedUser);

        } catch (error) {
            res.status(500).json(error);
        }

    }
/*
    public async login(req: Request, res: Response) {
        try {
            const user: UserDocument | null = await userService.findByEmail(req.body.email);
            if (!user) {
                return res.status(401).json({ message: "Not authorized" });
            }
            const isMatch = await bcrypt.compare(req.body.password, user.password);

            if (!isMatch) {
                return res.status(401).json({ message: "Not authorized" });
            }

            const token = await userService.generateToken(user);

            return res.status(200).send({ email: user.email, token })

        } catch (error) {
            res.status(500).json(error);
        }
    }
*/
}

export default new UserController();