import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    lastMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    clearedBy: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          clearedAt: { type: Date, default: Date.now }
        }
    ],
},{timestamps:true});

const chatModel = mongoose.model("Chat",chatSchema);
export default chatModel;