import mongoose from "mongoose";

// Status Schema
const StatusSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    type: {
        type:String,
        enum : ["text","image","file","video"],
        required:true,
    },
    media : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Media",
        default:null,
    },
    content: {
        type:String,
        default:null,
    },
    seenBy: [
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        }
    ],
    isExpire:{
        type:Date,
        required:true,
    }


},{timestamps:true});

// Status Model
const StatusModel = mongoose.model("Status",StatusSchema);

export default StatusModel;