import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    isGroup:{
        type:Boolean,
        default:false,
    },
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Group",
    },
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
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
},{timestamps:true});

const chatModel = mongoose.model("Chat",chatSchema);
export default chatModel;