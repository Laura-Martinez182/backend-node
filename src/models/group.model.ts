import  mongoose from "mongoose";

/**
 * Defines the GroupInput that stores group data when a group is created or modified
 */
export interface GroupInput {
    name: string;
    users: string[];
}

/**
 * Extends GroupInput and mongoose.Document, for adding meta data stored on Mongo DB
 */
export interface GroupDocument extends GroupInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    deleteAt?: Date;
}

/**
 * Defines the schema for the Group model in Mongoose. 
 */
const groupSchema = new mongoose.Schema({
        name: {type: String, required: true, unique:true},
        users: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
    }, {timestamps: true, collection: "groups"});

const Group = mongoose.model<GroupDocument>("Group", groupSchema);

export default Group;