// chanelModel
import chanelModel from "../Models/channel.model.js";

// Services
import mongoose from "mongoose";
import { STATUS_CODES,ERROR_MESSAGES,SUCCESS_MESSAGES } from "../Constants/responseConstants.js";
import ApiError from "../Utils/ApiError.js";

class ChannelServices {
    constructor(){
        this.chanelModel = chanelModel;
    }
}

export default ChannelServices;