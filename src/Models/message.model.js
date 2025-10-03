import mongoose from "mongoose";

// Message Schema
const MessageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Group",
        default:null,
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
    status : {
        type:String,
        enum:["DELETED","DISABLED","ENABLED"],
        default:"ENABLED"
    }
    
},{timestamps:true});

// Message Model#
const MessageModel = mongoose.model("Message",MessageSchema);

export default MessageModel;