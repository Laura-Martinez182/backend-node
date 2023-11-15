import { Request, Response } from 'express';
import userService from '../services/user.service';
import { UserInput, UserDocument } from '../models/user.model';
import bcrypt from 'bcrypt';
import groupService from '../services/group.service';
import { GroupDocument, GroupInput } from '../models/group.model';

class UserController {
    public async create(req: Request, res: Response): Promise<Response> {
        try {

            const loggeduser = req.body.loggeduser
            const loggeduserDoc : UserDocument | null = await userService.findById(loggeduser.user_id)

            if(loggeduserDoc && loggeduserDoc.role != "superadmin"){
                return res.status(401).json({ message: "Not authorized" });
            }      

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

    public async associateToGroup(req: Request, res: Response): Promise<Response>{
        try{
            const group : GroupDocument | null = await groupService.findById(req.body.groupId)
            const user : UserDocument | null = await userService.findById(req.body.userId)

            if(!group){
                return res.status(404).json({message:"Group with given id not found"})
            }

            if(!user){
                return res.status(404).json({message:"User with given id not found"})
            }

            const groupInUser : number = group.users.indexOf(user.id)
            const userInGroup : number = user.groups.indexOf(group.id)

            if(groupInUser != -1 && userInGroup != - 1){
                return res.status(400).json({message:"User is already associated to given group"})
            }

            if(groupInUser != -1 || userInGroup != -1){
                return res.status(409).json({message:"Inconsistent data, fix it first"})
            }
            
            const groupPre : GroupDocument= group.$clone()
            const userPre : UserDocument = user.$clone()

            try{
                userService.associateToGroup(user, group)           
                return res.status(200).json({user:user,group:group})
            }
            catch(error){
                userService.update(userPre,userPre)//reverts user and group in case group update fails
                groupService.update(groupPre,groupPre)
                throw error
            }
        }
        catch(error){
            return res.status(500).json(error);
        }
        
    }

    public async removeFromGroup(req: Request, res: Response): Promise<Response>{
        try{
            const group : GroupDocument | null = await groupService.findById(req.body.groupId)
            const user : UserDocument | null = await userService.findById(req.body.userId)

            if(!group){
                return res.status(404).json({message:"Group with given id not found"})
            }

            if(!user){
                return res.status(404).json({message:"User with given id not found"})
            }

            const groupInUser : number = group.users.indexOf(user.id)
            const userInGroup : number = user.groups.indexOf(group.id)

            if(groupInUser == -1 && userInGroup == -1){
                return res.status(400).json({message:"User is not associated to given group"})
            }

            if(groupInUser == -1 || userInGroup == -1){
                return res.status(409).json({message:"Inconsistent data, fix it first"})
            }

            const groupPre : GroupDocument= group.$clone()
            const userPre : UserDocument = user.$clone()        

            try{
                userService.removeFromGroup(user,group)       
                return res.status(200).json({user:user,group:group})
            }
            catch(error){
                userService.update(userPre,userPre)//reverts user and group in case update fails
                groupService.update(groupPre,groupPre)
                throw error
            }
        }
        catch(error){
            return res.status(500).json(error);
        }
        
    }

    public async getUserGroups(req: Request, res: Response): Promise<Response>{
        try{
            const user : UserDocument | null = await userService.findById(req.params.id)

            if(!user){
                return res.status(404).json({message:"User with given id not found"})
            }

            const groups = await groupService.findManyByIds(user.groups)

            return res.status(200).json(groups)
        }
        catch(error){
            return res.status(500).json(error);
        }
    }

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
}

export default new UserController();