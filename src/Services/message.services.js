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
            chatId,
            sender,
            content,
            type,
            mediaUrl,
            filename
        } = payload;

        const chatRoom = await this.FindChatById({_id:chatId});
        if(!chatRoom){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.CHAT_NOT_FOUND);
        }

        const createdSendMessage = await this.messageModel.create({
            sender:new mongoose.Types.ObjectId(sender),
            chatId:new mongoose.Types.ObjectId(chatRoom?._id),
            content:content,
            type:type.toUpperCase(),
            seen:"SENT",
        });

        const updateChatLastMessage = await this.chatModel.findByIdAndUpdate(new mongoose.Types.ObjectId(chatId),{
            $set : {lastMessage:createdSendMessage._id}
        },{new:true});
        

        let media = null;

        if(["IMAGE","VIDEO","FILE"].includes(type)){
            media = await this.mediaModel.create({
                filename:filename,
                mediaUrl:mediaUrl,
                filetype:type.toUpperCase(),
                uploadedBy:senderId,
                messageId:createdSendMessage?._id
            });
        }
        
        return {createdSendMessage,media};


    };

    // Send media message
    SendMediaMessage = async (payload) => {};

    // Update message
    UpdateMessage = async (payload) => {
        const {messageId,chatId,content} = payload;
        const chatRoom = await this.FindChatById({_id:chatId});
        if(!chatRoom){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.CHAT_NOT_FOUND);
        }
        const message = await this.FindMessageByMessageId({_id:messageId});
        if(!message){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.MESSAGE_NOT_FOUND);
        }
        message.content = content;
        await message.save();
        return message;
    };

    // User messages by userId
    GetUserMessages = async (payload) => {
        const { chatId,sender } = payload;
        const verifyChatOwnershipPayload = {
            chatId,
            owner:sender
        }
        const chatRoomIsExist = await this.verifyChatOwnership(verifyChatOwnershipPayload);
        if(!chatRoomIsExist){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.CHAT_NOT_FOUND)
        }
        const [receiver] = chatRoomIsExist?.members?.filter( (_id) => _id.toString().trim() !== sender.toString().trim());
        
        const userSendedAndRecivedMessages = await this.messageModel.aggregate([
            {
                 
                $match: {
                    $expr: {
                        $or: [
                            // Normal messages (sender ↔ receiver)
                            {
                                $and: [
                                    { $eq: ["$sender", new mongoose.Types.ObjectId(sender)] },
                                    { $eq: ["$chatId", new mongoose.Types.ObjectId(chatRoomIsExist?._id)] }
                                ]
                            },
                            {
                                $and: [
                                    { $eq: ["$sender", new mongoose.Types.ObjectId(receiver)] },
                                    { $eq: ["$chatId", new mongoose.Types.ObjectId(chatRoomIsExist?._id)] }
                                ]
                            }
                        ]
                    }
                }
            },
            // {
            //     $lookup : {
            //         from : "users",
            //         localField:"sender",
            //         foreignField:"_id",
            //         as:"sender"
            //     }
            // },
            // {
            //     $lookup : {
            //         from : "media",
            //         let : {messageId:"$_id",messageType:"$type"},
            //         pipeline : [
            //             {
            //                 $match : {
            //                     $expr : {
            //                         $and : [
            //                             {$eq : ["$messageId","$$messageId"]},
            //                             {$eq : ["$filetype","$$messageType"]}
            //                         ]
            //                     }
            //                 }
            //             }
            //         ],
            //         as:"media"
            //     }
            // },
            // {
            //     $lookup: {
            //       from: "messages",
            //       localField: "replyTo",
            //       foreignField: "_id",
            //       as: "replyToMessage"
            //     }
            // },  
            // {
            //     $addFields : {
            //         sender : {
            //             $first : "$sender"
            //         },
                    
            //        replyToMessage: { $first: "$replyToMessage" },
            //         media : {
            //             $first : "$media"
            //         },
                    
            //     }
            // },
            // { $sort: { createdAt: 1 } },
            // {
            //     $project : {
            //         _id:1,
            //         content:1,
            //         type:1,
            //         deleteFor:1,
            //         seen:1,
            //         replyToMessage:1,
            //         status:1,
            //         "sender._id":1,
            //         "sender.avatar":1,
            //         "sender.fullname":1,
            //         media:1,
            //         createdAt:1,
            //     }
            // }
        ]); 

        return userSendedAndRecivedMessages;
    };


    // Delete message by messageId
    DeleteMessage = async (payload) => {
        const {messageId,chatId} = payload;
        const chatRoom = await this.FindChatById({_id:chatId});
        if(!chatRoom){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.CHAT_NOT_FOUND);
        }
        const message = await this.FindMessageByMessageId({_id:messageId});
        if(!message){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.MESSAGE_NOT_FOUND);
        }
        message.status = "DELETED";
        await message.save();
        return message;
    };

    // Reply message by messageId
    ReplyMessage = async (payload) => {
        const {messageId,content,type,mediaUrl,filename,sender,chatId} = payload;

        const repliedMessage = await this.messageModel.create({
            content:content,
            replyTo:new mongoose.Types.ObjectId(messageId),
            chatId:new mongoose.Types.ObjectId(chatId),
            sender:new mongoose.Types.ObjectId(sender),
            type:type,
            seen:"SENT"
        });
        let media = null;

        if(["IMAGE","VIDEO","FILE"].includes(type)){
            media = await this.mediaModel.create({
                filename:filename,
                mediaUrl:mediaUrl,
                filetype:type,
                messageId:repliedMessage?._id,
            });
        }
        
        return {repliedMessage,media};
    };

    // Update message seen status
    UpdateMessageSeenStatus = async (payload) => {
        const {seen,messageId,chatId} = payload;

        const chatRoom = await this.FindChatById({_id:chatId});
        if(!chatRoom){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.CHAT_NOT_FOUND);
        }
        const message = await this.FindMessageByMessageId({_id:messageId});
        if(!message){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.MESSAGE_NOT_FOUND);
        }
        if(["SENT","SEEN","DELIVERED"].includes(seen.toUpperCase()) !== true){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
        }
        message.seen = seen;
        await message.save();
        return message;
    };

    // Delete all message by userId
    DeleteAllMessages = async (payload) => {
        const {sender,chatId} = payload;
        // check chatroom is exist
        const chat = await this.FindChatById(chatId);
        if(!chat){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.CHAT_NOT_FOUND);
        }
        const updateMessageDeleteForStatus = await this.messageModel.findOneAndUpdate({sender:new mongoose.Types.ObjectId(sender),chatId:new mongoose.Types.ObjectId(chatId)},{
            $push : {deleteFor:new mongoose.Types.ObjectId(sender)}
        });
        return updateMessageDeleteForStatus;
    };

    // Forward message and messages
    ForwardMessage = async (payload) => {
        const {messageId,sender,chatId,forwardToChatId} = payload;

        // const chatRoom = await this.verifyChatOwnership({chatId:chatId,owner:sender});
        const verifyForwardChatIsExist = await this.verifyChatOwnership({chatId:forwardToChatId,owner:sender});
        const message = await this.FindMessageByMessageId({_id:messageId});
        if(!message){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.MESSAGE_NOT_FOUND);
        }
        const forwardMessageDocument = await this.messageModel.create({
            content:message.content,
            sender:sender,
            chatId:forwardToChatId,
            type:message?.type,
            seen:"SENT",
        });
        
        let media = null;

        if(["IMAGE","VIDEO","FILE"].includes(message.type)){
            const mediaDocument = await this.mediaModel.findOne({messageId:new mongoose.Types.ObjectId(message?._id)});
            console.log(mediaDocument)
            if(!mediaDocument){
                throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES?.MESSAGE_SEND_FAILED)
            }
            media = await this.mediaModel.create({
                filename:mediaDocument?.filename,
                mediaUrl:mediaDocument?.mediaUrl,
                messageId:mediaDocument?.messageId,
                filetype:mediaDocument?.filetype,
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