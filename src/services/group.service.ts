import GroupModel, { GroupInput, GroupDocument } from "../models/group.model";

/* The GroupService class provides methods for creating, finding, updating, and deleting groups in a
database. */
class GroupService {
    /**
     * The function creates a new group document using the provided input and returns the created
     * document.
     * @param {GroupInput} groupInput - The `groupInput` parameter is an object that represents the
     * input data for creating a new group. It contains the group name.
     * @returns The `create` function is returning a `Promise` that resolves to a `GroupDocument`
     * object.
     */
    public async create(groupInput: GroupInput): Promise<GroupDocument> {
        try {
            const user = await GroupModel.create(groupInput);
            return user;
        } catch (error) {
            throw error;
        }
    }

    /**
     * The above function is an asynchronous function that retrieves all group documents from a
     * database using the GroupModel and returns them as an array of GroupDocument objects.
     * @returns An array of `GroupDocument` objects.
     */
    public async findAll(): Promise<GroupDocument[]> {
        try {
            const groups = await GroupModel.find();
            return groups;
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function `findByName` is an asynchronous function that takes a name as input and returns a
     * the group with the given name.
     * @param {String} name - The `name` parameter is a string that represents the name of the group.
     * @returns a Promise that resolves to either a GroupDocument object or null.
     */
    public async findByName(name: String): Promise<GroupDocument | null> {
        try {
            const group = await GroupModel.findOne({name});
            return group;
        } catch (error) {
            throw error;
        }
    }

    /**
     * The function findById takes an id as input and returns a the group with the given id.
     * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
     * group.
     * @returns a Promise that resolves to either a GroupDocument object or null.
     */
    public async findById(id: string): Promise<GroupDocument | null> {
        try {
            const group = await GroupModel.findById(id);
            return group;
        } catch (error) {
            throw error
        }
    }

    /**
     * The function `findManyByIds` takes an array of string ids as input and returns a promise that
     * resolves to an array of GroupDocument objects or null, the groups with the given ids.
     * @param {string[]} ids - An array of strings representing the IDs of the groups to be found.
     * @returns an array of GroupDocument objects or null.
     */
    public async findManyByIds(ids: string[]): Promise<GroupDocument[] | null> {
        try {
            const groups = await GroupModel.find({'_id':{$in:ids}});
            return groups;
        } catch (error) {
            throw error
        }
    }

    /**
     * The function updates a group document in a MongoDB database using the provided data.
     * @param {GroupDocument} group - The `group` parameter is of type `GroupDocument`, which
     * represents a document in the `Group` collection in the database. It contains information about a
     * specific group.
     * @param {GroupInput} data - The `data` parameter is an object of type `GroupInput`. It contains
     * the updated data for the group.
     * @returns a Promise that resolves to either a GroupDocument object or null.
     */
    public async update(group: GroupDocument, data: GroupInput): Promise<GroupDocument | null> {
        try {
            const groupUpdate: GroupDocument | null = await GroupModel.findOneAndUpdate({ _id: group.id }, data, { new: true });

            return groupUpdate;

        } catch (error) {
            throw error;
        }

    }

    /**
     * The function deletes a group document by its ID and returns the deleted document or null if it
     * doesn't exist.
     * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
     * group document that needs to be deleted.
     * @returns a Promise that resolves to either a GroupDocument object or null.
     */
    public async delete(id: string): Promise<GroupDocument | null> {

        try {
            const groupDelete: GroupDocument | null = await GroupModel.findByIdAndDelete(id);
            return groupDelete;
        } catch (error) {
            throw error;
        }
    }
}

export default new GroupService();