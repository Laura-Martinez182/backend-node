import { GroupDocument } from "../models/group.model";
import UserModel, { UserInput, UserDocument } from "../models/user.model";
import jwt from "jsonwebtoken";

/* The `UserService` class provides methods for creating, finding, updating, and deleting user
documents in a database, as well as associating users to groups and generating JWT tokens. */
class UserService {

    /**
     * The function creates a new user document in the database using the provided user input.
     * @param {UserInput} userInput - The `userInput` parameter is an object that contains the data
     * needed to create a new user. It includes properties such as `name`, `email`, `password` and role
     * @returns The `create` function is returning a `Promise` that resolves to a `UserDocument`
     * object.
     */
    public async create(userInput: UserInput): Promise<UserDocument> {
        try {
            const user = await UserModel.create(userInput);
            return user;
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function findByEmail searches for a user in the database based on their email and returns
     * the user document if found, or null if not found.
     * @param {string} email - The `email` parameter is a string that represents the email address of
     * the user you want to find.
     * @returns a Promise that resolves to either a UserDocument object or null.
     */
    public async findByEmail(email: string): Promise<UserDocument | null> {
        try {
            const userExists = await UserModel.findOne({ email });
            return userExists;
        } catch (error) {
            throw error
        }
    }

    /**
     * The function findById takes an id as input and returns a Promise that resolves to a UserDocument
     * or null.
     * @param {string} id - The `id` parameter is a string that represents the unique identifier of a
     * user.
     * @returns a Promise that resolves to either a UserDocument object or null.
     */
    public async findById(id: string): Promise<UserDocument | null> {
        try {
            const user = await UserModel.findById(id);
            return user;
        } catch (error) {
            throw error
        }
    }


    /**
     * The function updates a user document in the database and returns the updated document.
     * @param {UserDocument} user - The "user" parameter is of type UserDocument, which represents a
     * document in the User collection in the database. It contains information about a specific user, the one is going to be updated.
     * @param {UserInput} data - The `data` parameter is an object of type `UserInput` which contains
     * the updated data for the user.
     * @returns a Promise that resolves to either a UserDocument object or null.
     */
    public async update(user: UserDocument, data: UserInput): Promise<UserDocument | null> {
        try {
            const userUpdate: UserDocument | null = await UserModel.findOneAndUpdate({ _id: user.id }, data, { new: true });

            return userUpdate;

        } catch (error) {
            throw error;
        }
    }

    /**
     * The below function is an asynchronous function that deletes a user document from the database
     * based on the provided id and returns the deleted document or null if it doesn't exist.
     * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
     * user document that needs to be deleted.
     * @returns a Promise that resolves to either a UserDocument object or null.
     */
    public async delete(id: string): Promise<UserDocument | null> {
        try {
            const userDelete: UserDocument | null = await UserModel.findByIdAndDelete(id);
            return userDelete;
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function `associateToGroup` associates a user to a group by updating the user's groups array
     * and the group's users array.
     * @param {UserDocument} user - The user parameter is of type UserDocument, which represents a user
     * document in a database. It contains the user information.
     * @param {GroupDocument} group - The `group` parameter is of type `GroupDocument`, which
     * represents a document in a MongoDB collection for groups. It contains information about a
     * specific group, its name and associated users.
     * @returns an object with two properties: "user" and "group". The values of these properties are
     * the updated user document and group document, respectively.
     */
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

    /**
     * The function removes a user from a group and updates the user and group documents.
     * @param {UserDocument} user - The `user` parameter is of type `UserDocument`, which represents a
     * user document in a database. It contains information about a specific user, such as their
     * name, email, and other relevant data.
     * @param {GroupDocument} group - The "group" parameter is of type "GroupDocument", which
     * represents a document in a MongoDB collection for groups. It contains information about a
     * specific group, such as its name, members, and other properties.
     * @returns an object with two properties: "user" and "group". The values of these properties are
     * the updated user and group documents, respectively.
     */
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

    /**
     * The function `findUsersById` takes an array of user IDs as input and returns a promise that
     * resolves to an array of user documents, the user documents with the given ids.
     * @param {string[]} ids - An array of strings representing the IDs of the users to be found.
     * @returns a Promise that resolves to an array of UserDocument objects.
     */
    public async findUsersById(ids: string[]): Promise<UserDocument[]> {
        try{
            const user = await UserModel.find({'_id':{$in:ids}});
            return user;
        } catch(error){
            throw error
        }
    }


    /**
     * The function generates a JWT token for a given user with an expiration time of 5 minutes.
     * @param {UserDocument} user - The `user` parameter is of type `UserDocument`, which
     * represents a user object.
     * @returns a Promise that resolves to a string, which is the generated token.
     */
    public async generateToken(user: UserDocument): Promise<String> {
        try {
            const token = jwt.sign({ user_id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: "5m" });

            return token;
        } catch (error) {
            throw error;
        }
    }

}

export default new UserService();