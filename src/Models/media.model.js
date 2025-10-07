import mongoose from "mongoose";

// Media Schema for uploading files, images, videos, etc.
const MediaSchema = new mongoose.Schema({
    filetype: {
        type: String,
        enum: ["IMAGE", "VIDEO", "AUDIO", "FILE"],  
        required: true,
    },
    filename: {
        type: String,
        required: true, 
    },
    mediaUrl: {
        type: String,
        required: true,  
    },
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  
        required: true,
    },
}, {timestamps: true});

// Media Model
const MediaModel = mongoose.model("Media", MediaSchema);

export default MediaModel;
