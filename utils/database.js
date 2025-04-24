import mongoose from "mongoose";
let isConnected = false;

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);

    if (isConnected) {
        console.log("MongoDb is already connected");
        return;
    }

    try {
        const uri = process.env.MONGODB_URI;
        const dbName = process.env.DB_NAME;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        await mongoose.connect(`${uri}`,{dbName:dbName});

        isConnected = true;
        console.log("MongoDB connected");
    } catch (e) {
        console.log(e);
    }
};