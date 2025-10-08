import mongoose from "mongoose";

// Contact Schema
const contactSchema = new mongoose.Schema({
    
});

// Contact Model
const contactModel = mongoose.model("Contact",contactSchema);

export default contactModel;