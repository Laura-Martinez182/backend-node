import GroupModel, { GroupInput, GroupDocument } from "../models/group.model";
//import jwt from "jsonwebtoken";

class GroupService {
    public async create(groupInput: GroupInput): Promise<GroupDocument> {
        try {
            const user = await GroupModel.create(groupInput);
            return user;
        } catch (error) {
            throw error;
        }
    }


    public async findAll(): Promise<GroupDocument[]> {
        try {
            const groups = await GroupModel.find();
            return groups;
        } catch (error) {
            throw error;
        }
    }

    public async findByName(name: String): Promise<GroupDocument | null> {
        try {
            const group = await GroupModel.findOne({name});
            return group;
        } catch (error) {
            throw error;
        }
    }

    public async findById(id: string): Promise<GroupDocument | null> {
        try {
            const user = await GroupModel.findById(id);
            return user;
        } catch (error) {
            throw error
        }
    }

    public async update(group: GroupDocument, data: GroupInput): Promise<GroupDocument | null> {
        try {
            const groupUpdate: GroupDocument | null = await GroupModel.findOneAndUpdate({ _id: group.id }, data, { new: true });

            return groupUpdate;

        } catch (error) {
            throw error;
        }

    }

    public async delete(id: string): Promise<GroupDocument | null> {

        try {
            const groupDelete: GroupDocument | null = await GroupModel.findByIdAndDelete(id);
            return groupDelete;
        } catch (error) {
            throw error;
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

export default new GroupService();