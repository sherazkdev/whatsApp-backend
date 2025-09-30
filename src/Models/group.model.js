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
        enum: ["private", "public"], 
        default: "private",
    },
    description: {
        type: String,
        default: null,
    },
    settings: {
        allowMessage: {
            type: Boolean,
            default: true,  
        },
        allowMedia: {
            type: Boolean,
            default: true,
        },
    },
},{timestamps:true});

// Group Model
const GroupModel = mongoose.model("Group",GroupSchema);

export default GroupModel;