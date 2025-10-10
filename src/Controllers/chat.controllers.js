import mongoose from "mongoose";

// services
import ChatServices  from "../Services/chat.services.js";
import { CreateChatValidate, DeleteChatValidate } from "../Validaters/chat.validaters.js";
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
            receiver:value?.receiverId,
            sender:req?.user?._id,
        };
        const createChatDocument = await this.CreateChat(createChatPayload);
        return res.status(STATUS_CODES.CREATED).json( new ApiResponse(createChatDocument,SUCCESS_MESSAGES.CHAT_CREATED,true,STATUS_CODES.CREATED) );
    };

    HandleDeleteChat = async (req,res) => {
        const {error,value} = DeleteChatValidate(req.params);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error?.details[0].message);
        }
        const deleteChatPayload = {
            chatId:value?.chatId,
            sender:req?.user?._id
        };
        const updateDeleteChatDocument = await this.DeleteChat(deleteChatPayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(updateDeleteChatDocument,SUCCESS_MESSAGES.CHAT_DELETED,true,STATUS_CODES.OK))
    };
    
    HandleGetUserChats = async (req,res) => {
        const getUserChatsPayload = {
            _id:req?.user?._id
        }
        const chats = await this.GetUserChats(getUserChatsPayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(chats,SUCCESS_MESSAGES.DATA_FETCHED,true,STATUS_CODES.OK));
    };

}

export default new ChatController;