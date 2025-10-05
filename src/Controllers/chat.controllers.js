import mongoose from "mongoose";

// services
import ChatServices  from "../Services/chat.services.js";
import { CreateChatValidate } from "../Validaters/chat.validaters.js";
import ApiError from "../Utils/ApiError.js";
import { ERROR_MESSAGES, STATUS_CODES, SUCCESS_MESSAGES } from "../Constants/responseConstants.js";
import ApiResponse from "../Utils/ApiResponse.js";

class ChatController extends ChatServices {
    constructor(){
        super();
    }
    HandleCreateChat = async (req,res) => {
        const {error,value} = CreateChatValidate.validate(req.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error?.details[0].message);
        }
        const createChatPayload = {
            receiverId:value?.receiverId,
            senderId:req?.user?._id,
        };
        const createChatDocument = await this.CreateChat(createChatPayload);
        return res.status(STATUS_CODES.CREATED).json( new ApiResponse(createChatDocument,SUCCESS_MESSAGES.CHAT_CREATED,true,STATUS_CODES.CREATED) );
    };
    HandleDelete = async (req,res) => {};
    HandleGetUserChats = async (req,res) => {};

}

export default new ChatController;