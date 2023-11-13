import UserModel, {UserInput, UserDocument} from "../models/user.model";

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
            const userExists = await UserModel.findOne({email});
            return userExists;
        } catch (error) {
            throw error 
        }
    }

}

export default new UserService();