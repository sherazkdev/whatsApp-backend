
import mongoose from "mongoose";

// Group Schema
const GroupSchema = new mongoose.Schema({
    admins : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    name : {
        type:String,
        required:true
    }, 
    groupType: {
        type: String,
        enum: ["PRIVATE", "PUBLIC"], 
        default: "PRIVATE",
    },
    groupAvatar:{
        type:String,
        default:null
    },
    description: {
        type: String,
        default: null,
    },
    settings: {
        sendMessages: {
            type: Boolean,
            default: true,  
        },
        addOtherMembers : {
            type: Boolean,
            default: true,  
        },
        editGroupSettings : {
            type: Boolean,
            default: true,  
        }
    },
},{timestamps:true});

// Group Model
const GroupModel = mongoose.model("Group",GroupSchema);

export default GroupModel;