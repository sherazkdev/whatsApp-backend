import mongoose from "mongoose";

// Constancts
import {DB_NAME} from "../Constants/constants.js";

// connection to database
class Connection {

    constructor(){
        this.isConnected = false;
    }

    // connection instance
    connect = async () => {
        try {
            console.log(`${process.env.MONGO_URI}/${DB_NAME}`)
            const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
            console.log(`\n DB connected successfully ${connectionInstance?.connection?.host}`);
            this.isConnected = true;
            return connectionInstance;
        } catch (error) {
            this.connect = false;
            throw new Error("Error in DB connection" + error);
        }
    };

    disconnect = async () => {
        if (this.isConnected) {
            await mongoose.disconnect();
            this.isConnected = false;
        }
    }

}

export default new Connection();