import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const connectionString = process.env.MONGO_URI || "mongodb://localhost:27017/test";
export const db = mongoose.connect(connectionString)
    .then((res) => {
        console.log("Connected to MongoDb");
    }).catch((err) => {
        console.log(err);
    }); 