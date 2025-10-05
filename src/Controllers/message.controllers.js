import { STATUS_CODES,ERROR_MESSAGES,SUCCESS_MESSAGES } from "../Constants/responseConstants.js";

// Services
import MessageServices from "../Services/message.services.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { DeleteMessageValidate, ForwardMessageValidate, GetUserMessageValidate, ReplyMessageValidate, SendGroupMessageValidate, sendMessageValidate, SendStatusMessageValidate, UpdateMessageSeenStatusValidate, UpdateMessageValidate } from "../Validaters/message.validaters.js";


class MessageControllers extends MessageServices  {
    constructor(){
        super();
    }

    // for message sending
    HandleSendMessage = async (req,res) => {
        const {error,value} = sendMessageValidate.validate(req.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error.details);
        }
        const sendMessagePayload = {
            receiverId:value.receiverId,
            senderId:req.user.id,
            content:value.content,
            type:value.type,
            mediaUrl:value.mediaUrl,
            fileName:value.fileName,
            receiver:value.receiver,
        };
        const sendMessageResponse = await this.SendMessage(sendMessagePayload);
        return res.status(STATUS_CODES.CREATED).json(new ApiResponse(sendMessageResponse.createdSendMessage,SUCCESS_MESSAGES.MESSAGE_SENT,true,STATUS_CODES.CREATED));
    };
    HandleUpdateMessage = async (req,res) => {
        const {error,value} = UpdateMessageValidate.validate(req.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error.details);
        }
        const updateMessagePayload = {
            content:value?.content,
            _id:value?._id
        };
        const updateMessageDocument = await this.UpdateMessage(updateMessagePayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(updateMessageDocument,SUCCESS_MESSAGES.MESSAGE_UPDATED,true,STATUS_CODES.ok));
    };

    HandleDeleteMessage = async (req,res) => {
        const {error,value} = DeleteMessageValidate.validate(req.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error.details[0].message);
        }
        const deleteMessagePayload = {
            _id:value?._id
        };
        const deletMessageDocuemnt = await this.DeleteMessage(deleteMessagePayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse([],SUCCESS_MESSAGES.MESSAGE_DELETED,true,STATUS_CODES.OK));
    };

    HandleReplyMessage = async (req,res) => {
        const {error,value} = ReplyMessageValidate.validate(req.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error.details);
        }
        const replyMessagePayload = {
            _id:value?._id,
            content:value?.content,
            receiverId:value?.receiverId,
            senderId:req?.user?._id,
            type:value?.type,
            mediaUrl:value?.mediaUrl,
            fileName:value?.mediaUrl
        };
        const replyMessageDocument = await this.ReplyMessage(replyMessagePayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(replyMessageDocument,SUCCESS_MESSAGES.MESSAGE_REPLIED,true,STATUS_CODES.OK));
    };

    HandleReportMessage = async (req,res) => {};

    HandleDeleteUserMessages = async (req,res) => {
        const {error} = DeleteMessageValidate.validate(req.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error.details[0].message)
        }
        const deleteUserChatPayload = {
            chatId:value?.chatId,
            senderId:req.user?._id
        };

        const deleteUserChatMessageDocument = await this.DeleteAllMessages(deleteUserChatPayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(deleteUserChatMessageDocument,SUCCESS_MESSAGES.MESSAGE_DELETED,true,STATUS_CODES.OK))
    };
    
    HandleForwardMessage = async (req,res) => {
        const {error,value} = ForwardMessageValidate.validate(req.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error.details)
        }
        const message = await this.FindMessageByMessageId({_id:value?.messageId});
        if(!message){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.MESSAGE_NOT_FOUND);
        }
        const forwardMessagePayload = {
            message,
            receiverId:value?.receiverId,
            sender:req?.user?._id
        };
        const createForwardedDocument = await this.ForwardMessage(forwardMessagePayload);
        return res.status(STATUS_CODES.CREATED).json( new ApiResponse(createForwardedDocument,SUCCESS_MESSAGES.MESSAGE_FORWARDED,true,STATUS_CODES.CREATED))

    };

    HandleUpdateMessageSeenStatus = async (req,res) => {
        const {error,value} = UpdateMessageSeenStatusValidate.validate(req.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error.details)
        }
        const updateMessageSeenStatusPayload = {
            seen:value?.seen,
            messageId:value?.messageId
        };
        const updateMessageSeenStatusDocument = await this.UpdateMessageSeenStatus(updateMessageSeenStatusPayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(updateMessageSeenStatusDocument,SUCCESS_MESSAGES.MESSAGE_SEEN,true,STATUS_CODES.OK));
    };

    HandleSendGroupMessage = async (req,res) => {
        const {error,value} = SendGroupMessageValidate.validate(req?.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error.details)
        }
        const sendGroupMessagePayload = {
            groupId:value?.groupId,
            content:value?.content,
            type:value?.type,
            mediaUrl:value?.mediaUrl,
            fileName:value?.fileName
        };
        const sendGroupMessageDocument = await this.SendGroupMessage(sendGroupMessagePayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(sendGroupMessageDocument,SUCCESS_MESSAGES.MESSAGE_SENT,true,STATUS_CODES.OK));
    };

    HandleSendStatusMessage = async (req,res) => {
        const {error,value} = SendStatusMessageValidate.validate(req?.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error.details)
        }
        const sendStatusMessagePayload = {
            statusId:value?.statusId,
            content:value?.content,
            type:value?.type,
        };
        const sendStatusMessageDocument = await this.SendStatusMessage(sendStatusMessagePayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(sendStatusMessageDocument,SUCCESS_MESSAGES.MESSAGE_SENT,true,STATUS_CODES.OK));
    };
    
    HandleGetUserMessages = async (req,res) => {
        const {error,value} = GetUserMessageValidate.validate(req.query);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error.details)
        }
        const getUserMessagesPayload = {
            currentlyloggedInUser:req?.user?._id,
            receiverId:value?.receiverId
        };
        const userMessages = await this.GetUserMessages(getUserMessagesPayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(userMessages,SUCCESS_MESSAGES.DATA_FETCHED,true,STATUS_CODES.OK));

    };
}

export default new MessageControllers;