import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const connectionString = process.env.MONGO_URI || "mongodb://localhost:27018/nodeBD";

/**
 * Connects to MongoDB using the provided connection string.
 * @returns A promise that resolves to a MongoDB connection object.
 */
export const db = mongoose.connect(connectionString)
    .then((res) => {
        console.log("Connected to MongoDb");
    }).catch((err) => {
        console.log(err);
    }); 