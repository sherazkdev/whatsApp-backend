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
        required:true,
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
    type:{
        type:String,
        enum : ["text","image","file","video"],
        required:true
    },
    content:{
        type:String,
    },
    seen : {
        type:String,
        enum:["seen","delivered","sent"],
        default:"sent",
    },
    replyTo : [
        {
            messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },  
            replyDate: { type: Date, default: Date.now },
            media: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' }
        }
    ]
},{timestamps:true});

// Message Model#
const MessageModel = mongoose.model("Message",MessageSchema);

export default MessageModel;