import mongoose from "mongoose";

// Media Schema for uploading files, images, videos, etc.
const MediaSchema = new mongoose.Schema({
    fileType: {
        type: String,
        enum: ["image", "video", "audio", "file"],  
        required: true,
    },
    fileName: {
        type: String,
        required: true, 
    },
    fileUrl: {
        type: String,
        required: true,  
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,  
    },
}, {timestamps: true});

// Media Model
const MediaModel = mongoose.model("Media", MediaSchema);

export default MediaModel;
