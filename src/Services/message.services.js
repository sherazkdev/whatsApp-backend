// message Model and chat model
import messageModel from "../Models/message.model.js";
import chatModel from "../Models/chat.model.js";

// Services
import mongoose from "mongoose";
import mediaModel from "../Models/media.model.js";
import { ERROR_MESSAGES,STATUS_CODES,SUCCESS_MESSAGES } from "../Constants/responseConstants.js";
import ApiError from "../Utils/ApiError.js";
import ChatServices from "./chat.services.js";

class MessageServices extends ChatServices{
    constructor(){
        super();
        this.messageModel = messageModel;
        this.mediaModel = mediaModel;
    }

    
    // Send message 
    SendMessage = async (payload) => {
        const {
            receiverId,
            senderId,
            content,
            type,
            mediaUrl,
            fileName
        } = payload;

        // check chat is exist
        const chatRoomPayload = {
            senderId,
            receiverId
        }
        const chatRoom = await this.FindChatByUserAndReceiverId(chatRoomPayload);
        if(!chatRoom){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.CHAT_NOT_FOUND);
        }

        const createdSendMessage = await this.messageModel.create({
            senderId:new mongoose.Types.ObjectId(senderId),
            receiverId:new mongoose.Types.ObjectId(receiverId),
            content:content,
            type:"TEXT",
            seen:"SENT",
        });

        const updateChatLastMessage = await this.chatModel.findByIdAndUpdate(new mongoose.Types.ObjectId(receiverId),{
            $set : {lastMessage:createdSendMessage._id}
        },{new:true});
        
        let media = null;

        if(["IMAGE","VIDEO","FILE"].includes(type)){
            media = await this.mediaModel.create({
                fileName:fileName,
                mediaUrl:mediaUrl,
                fileType:type,
                uploadedBy:senderId,
            });
        }
        
        return {createdSendMessage,media};


    };

    // Send media message
    SendMediaMessage = async (payload) => {};

    // Update message
    UpdateMessage = async (payload) => {
        const {_id,content} = payload;
        const message = await this.FindMessageByMessageId({_id});
        if(!message){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.MESSAGE_NOT_FOUND);
        }
        // const updateMessage = await this.messageModel.findByIdAndUpdate(new mongoose.Types.ObjectId(message?._id),{
        //     $set : {content:content}
        // },{new:true});
        message.content = content;
        await message.save();
        return message;
    };

    // User messages by userId
    GetUserMessages = async (payload) => {
        const {currentlyloggedInUser,receiverId} = payload;

        const userSendedAndRecivedMessages = await this.messageModel.aggregate([
            {
                $match : {
                    $expr : {
                        $and : [
                            { $eq: ["$senderId",new mongoose.Types.ObjectId(currentlyloggedInUser)]},
                            { $eq: ["$receiverId",new mongoose.Types.ObjectId(receiverId)]}
                        ]
                    }
                }
            },
            {
                
            },
            {
                $lookup : {
                    from: "users",
                    localField: "senderId",
                    foreignField: "_id",
                    as:"senderId"
                }
            },
            {
                $lookup : {
                    from: "users",
                    localField: "receiverId",
                    foreignField: "_id",
                    as:"receiverId"
                }
            },
            {
                $project: {
                    _id:1,
                    content:1,
                    type:1,
                }
            }
        ])
    };

    // Delete message by messageId
    DeleteMessage = async (payload) => {
        const {_id} = payload;
        const message = await this.FindMessageByMessageId({_id});
        if(!message){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.MESSAGE_NOT_FOUND);
        }
        message.status = "DELETED";
        await message.save();
        return message;
    };

    // Reply message by messageId
    ReplyMessage = async (payload) => {
        const {_id,content,type,mediaUrl,fileName,senderId,receiverId} = payload;
        console.log(payload)

        const repliedMessage = await this.messageModel.create({
            content:content,
            replyTo:new mongoose.Types.ObjectId(_id),
            receiverId:new mongoose.Types.ObjectId(receiverId),
            senderId:new mongoose.Types.ObjectId(senderId),
            type:type,
            seen:"SENT"
        });
        let media = null;

        if(["IMAGE","VIDEO","FILE"].includes(type)){
            media = await this.mediaModel.create({
                fileName:fileName,
                mediaUrl:mediaUrl,
                fileType:type,
                uploadedBy:senderId,
            });
        }
        
        return {repliedMessage,media};
    };

    // Update message seen status
    UpdateMessageSeenStatus = async (payload) => {
        const {seen,messageId} = payload;
        const message = await this.FindMessageByMessageId({_id:messageId});
        if(!message){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.MESSAGE_NOT_FOUND);
        }
        message.seen = seen;
        await message.save();
        return message;
    };

    // Delete all message by userId
    DeleteAllMessages = async (payload) => {
        const {senderId,chatId} = payload;
        // check chatroom is exist
        const chat = await this.FindChatById(chatId);
        if(!chat){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.CHAT_NOT_FOUND);
        }
        const updateMessageDeleteForStatus = await this.messageModel.findByIdAndUpdate(new mongoose.Types.ObjectId(senderId),{
            $push : {deleteFor:new mongoose.Types.ObjectId(senderId)}
        });
        return updateMessageDeleteForStatus;
    };

    // Forward message and messages
    ForwardMessage = async (payload) => {
        const {message,senderId,receiverId} = payload;
        const forwardMessageDocument = await this.messageModel.create({
            content:message.content,
            senderId:senderId,
            receiverId:receiverId,
            type:"FORWARDED",
            seen:"SENT"
        });
        
        let media = null;

        if(["IMAGE","VIDEO","FILE"].includes(message.type)){
            media = await this.mediaModel.create({
                fileName:fileName,
                mediaUrl:mediaUrl,
                fileType:type,
                uploadedBy:senderId,
            });
        };

        return {media,forwardMessageDocument}
    };

    // Send group message
    SendGroupMessage = async (payload) => {
        const {groupId,senderId,receiverId,content,type,mediaUrl} = payload;
        const createMessageForGroupDocument = await this.messageModel.create({
            content:content,
            groupId:new mongoose.Types.ObjectId(groupId),
            senderId:senderId,
            receiverId:receiverId,
            type:type,
        });
        let media = null;
        if(["IMAGE","VIDEO","FILE"].includes(type)){
            media = await this.mediaModel.create({
                fileName:fileName,
                mediaUrl:mediaUrl,
                fileType:type,
                uploadedBy:senderId,
            },{new:true});
        };
        return {createMessageForGroupDocument,media};

    };

    // Pin message
    PinMessage = async (payload) => {

    };

    // Star message
    StarMessage = async (payload) => {};

    // Message reaction set
    SetMessageReaction = async (payload) => {};

    // Update message reation
    UpdateMessageReaction = async (payload) => {};

    // Send status message
    SendStatusMessage = async (payload) => {
        const {statusId,senderId,receiverId,content} = payload;
        const sendStatusMessage = await this.messageModel.create({
            content:content,
            senderId:senderId,
            receiverId:receiverId,
            statusId:new mongoose.Types.ObjectId(statusId)
        });
        return sendStatusMessage;
    };

    // Find message by message _id
    FindMessageByMessageId = async (payload) => {
        const {_id} = payload;
        const message = await this.messageModel.findById(new mongoose.Types.ObjectId(_id));
        return message;
    };
}

export default MessageServices;