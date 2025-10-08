import mongoose from "mongoose";

// services
import ChannelServices  from "../Services/channel.services.js";
import { CreateChatValidate, DeleteChatValidate } from "../Validaters/chat.validaters.js";
import ApiError from "../Utils/ApiError.js";
import { ERROR_MESSAGES, STATUS_CODES, SUCCESS_MESSAGES } from "../Constants/responseConstants.js";
import ApiResponse from "../Utils/ApiResponse.js";

class ChannelControllers extends ChannelServices {
    constructor(){
        super();
    }
}

export default new ChannelControllers;