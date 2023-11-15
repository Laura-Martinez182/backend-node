import { GroupDocument } from "../models/group.model";
import UserModel, { UserInput, UserDocument } from "../models/user.model";
import groupService from "./group.service";
//import jwt from "jsonwebtoken";

class UserService {

    public async create(userInput: UserInput): Promise<UserDocument> {
        try {
            const user = await UserModel.create(userInput);
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async findByEmail(email: string): Promise<UserDocument | null> {
        try {
            const userExists = await UserModel.findOne({ email });
            return userExists;
        } catch (error) {
            throw error
        }
    }

    public async findById(id: string): Promise<UserDocument | null> {
        try {
            const user = await UserModel.findById(id);
            return user;
        } catch (error) {
            throw error
        }
    }

    public async update(user: UserDocument, data: UserInput): Promise<UserDocument | null> {
        try {
            const userUpdate: UserDocument | null = await UserModel.findOneAndUpdate({ _id: user.id }, data, { new: true });

            return userUpdate;

        } catch (error) {
            throw error;
        }
    }

    public async delete(id: string): Promise<UserDocument | null> {
        try {
            const userDelete: UserDocument | null = await UserModel.findByIdAndDelete(id);
            return userDelete;
        } catch (error) {
            throw error;
        }
    }

    public async associateToGroup(user:UserDocument, group:GroupDocument):Promise<any>{
        try{
            user.groups.push(group.id)
            group.users.push(user.id)

            const updateUser:UserDocument = await user.save()       
            const updateGroup:GroupDocument = await group.save()               

            return {user:updateUser,group:updateGroup}
        }
        catch(error){
            throw error
        }
    }

    public async removeFromGroup(user:UserDocument, group:GroupDocument):Promise<any>{
        try{
            group.users.splice(group.users.indexOf(user.id),1)
            user.groups.splice(user.groups.indexOf(group.id),1)

            const updateUser:UserDocument = await user.save()       
            const updateGroup:GroupDocument = await group.save()               

            return {user:updateUser,group:updateGroup}
        }
        catch(error){
            throw error
        }
    }
    
    /*

    public async generateToken(user: UserDocument): Promise<String> {
        try {
            const token = await jwt.sign({ user_id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: "5m" });

            return token;
        } catch (error) {
            throw error;
        }
    }
*/
}

export default new UserService();