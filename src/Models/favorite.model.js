import mongoose from "mongoose";

// Favorite Schema
const favoriteSchema = new mongoose.Schema({
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    },
},{timestamps:true});

// Favorite Model
const favoriteModel = mongoose.model("Favorite",favoriteSchema);

export default favoriteModel;