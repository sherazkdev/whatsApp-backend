import mongoose from "mongoose";

// Message Schema
const MessageSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat",
        required:true
    },
    statusId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Status",
        default:null
    },
    replyTo : {
        type: mongoose.Schema.Types.ObjectId, ref: "Message"
    },
    type:{
        type:String,
        enum : ["TEXT","IMAGE","FILE","VIDEO","FORWARDED"],
        required:true
    },
    content:{
        type:String,
    },
    seen : {
        type:String,
        enum:["SEEN","DELIVERED","SENT"],
        default:"sent",
    },
    deleteFor: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    status : {
        type:String,
        enum:["DELETED","DISABLED","ENABLED"],
        default:"ENABLED"
    },
    
},{timestamps:true});

// Message Model#
const MessageModel = mongoose.model("Message",MessageSchema);

export default MessageModel;