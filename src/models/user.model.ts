import  mongoose from "mongoose";

/**
 * Defines the UserInput that stores user data when user is created or modified
 */
export  interface UserInput {
    name: string;
    email: string;
    password: string;
    role:string;
    groups: string[];
}

/**
 * Extends UserInput and mongoose.Document, for adding meta data stored on Mongo DB
 */
export  interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    deleteAt?: Date;
}

/**
 * Defines the schema for the User model in Mongoose. 
 */
const userSchema = new mongoose.Schema({
        name: {type: String, required: true},
        email: {type: String, required: true, index: true, unique: true},
        password: {type: String, required: true},
        role: {type: String, required: true, enum: ["superadmin", "user"]},
        groups: [{type: mongoose.Schema.Types.ObjectId, ref: "Group"}]
    }, {timestamps: true, collection: "users"});

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;