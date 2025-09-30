import mongoose from "mongoose";

// Channel Schema
const ChannelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, 
    },
    description: {
        type: String,
        default: "",  
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,  
    },
    subscribers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
        }
    ],
    isPrivate: {
        type: Boolean,
        default: false,  
    },
    settings: {
        allowContent: {
            type: Boolean,
            default: true,  
        },
        allowComments: {
            type: Boolean,
            default: false,  
        },
    },
}, {timestamps: true});

// Channel Model
const ChannelModel = mongoose.model("Channel", ChannelSchema);

export default ChannelModel;
