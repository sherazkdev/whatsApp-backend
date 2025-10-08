import mongoose from "mongoose";

// services
import GroupServices  from "../Services/group.services.js";
import { CreateChatValidate, DeleteChatValidate } from "../Validaters/chat.validaters.js";
import ApiError from "../Utils/ApiError.js";
import { ERROR_MESSAGES, STATUS_CODES, SUCCESS_MESSAGES } from "../Constants/responseConstants.js";
import ApiResponse from "../Utils/ApiResponse.js";

class GroupControllers extends GroupServices {
    constructor(){
        super();
    }
}

export default new GroupControllers;