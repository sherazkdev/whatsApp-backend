import messageModle from "../Models/message.model.js";
import mongoose from "mongoose";
import mediaModel from "../Models/media.model.js";
import { ERROR_MESSAGES,STATUS_CODES,SUCCESS_MESSAGES } from "../Constants/responseConstants";
import ApiError from "../Utils/ApiError";

class MessageServices {
    constructor(){
        this.messageModle = messageModle;
        this.mediaModel = mediaModel;
    }

    // Send message 
    SendMessage = async (payload) => {
        const {
            receiverId,
            senderId,
            content,
        } = payload;

        const createdSendMessage = await this.messageModle.create({
            senderId:new mongoose.Types.ObjectId(senderId),
            receiverId:new mongoose.Types.ObjectId(receiverId),
            content:content,
            type:"text",
            seen:"sent",
        });

        return createdSendMessage;


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
        // const updateMessage = await this.messageModle.findByIdAndUpdate(new mongoose.Types.ObjectId(message?._id),{
        //     $set : {content:content}
        // },{new:true});
        message.content = content;
        await message.save();
        return message;
    };

    // User messages by userId
    GetUserMessages = async (payload) => {
        const {currentlyloggedInUser,receiverId} = payload;

        const userSendedAndRecivedMessages = await this.messageModle.aggregate([
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

        const repliedMessage = await this.messageModle.create({
            content:content,
            replyTo:new mongoose.Types.ObjectId(_id),
            receiverId:new mongoose.Types.ObjectId(receiverId),
            senderId:new mongoose.Types.ObjectId(senderId),
            type:type
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

    // Report message by messageId
    ReportMessage = async (payload) => {};

    // Update message seen status
    UpdateMessageSeenStatus = async (payload) => {
        const {seen,_id} = payload;
        const message = await this.FindMessageByMessageId({_id});
        if(!message){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.MESSAGE_NOT_FOUND);
        }
        message.seen = seen;
        await message.save();
        return message;
    };

    // Delete all message by userId
    DeleteAllMessages = async (payload) => {
        const {_id} = payload;
        const loggedInUserDeleteAllMessages = await this.messageModle.deleteMany({
            senderId:new mongoose.Types.ObjectId(_id)
        });
        const loggedInUserDeleteMedia = await this.mediaModel.deleteMany({
            uploadedBy:new mongoose.Types.ObjectId(_id);
        })
        return true;
    };

    // Forward message and messages
    ForwardMessage = async (payload) => {
        const {message,senderId,receiverId} = payload;
        const forwardMessageDocument = await this.messageModle.create({
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
        const createMessageForGroupDocument = await this.messageModle.create({
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
        const sendStatusMessage = await this.messageModle.create({
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
        const message = await this.messageModle.findById(new mongoose.Types.ObjectId(_id));
        return message;
    };
}

export default MessageServices;