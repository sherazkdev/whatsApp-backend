// chatModel
import chatModel from "../Models/chat.model.js";

// Services
import mongoose from "mongoose";
import { STATUS_CODES,ERROR_MESSAGES,SUCCESS_MESSAGES } from "../Constants/responseConstants.js";
import ApiError from "../Utils/ApiError.js";

class ChatServices {
    constructor(){
        this.chatModel = chatModel;
    }

    // chat creating proccess
    CreateChat = async (payload) => {
        const {senderId,receiverId} = payload;
        const createChat = await this.chatModel.create({
            members:[new mongoose.Types.ObjectId(senderId),new mongoose.Types.ObjectId(receiverId)]
        });
        return createChat;
    };

    DeleteChat = async (payload) => {
        const {senderId,chatId} = payload;
        const checkChatRoomIsExist = await this.FindChatById({_id:chatId});
        if(!checkChatRoomIsExist){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.CHAT_NOT_FOUND)
        }
        /** deleteChatFromCurrenltyLoggedInUser */
        const deleteChatFromCurrenltyLoggedInUser = await this.chatModel.findByIdAndUpdate(new mongoose.Types.ObjectId(checkChatRoomIsExistE._id),{
            $push : {clearedBy:{
                userId:new mongoose.Types.ObjectId(senderId),
                clearAt: new Date(),
            }}
        },{new:true});
        return deleteChatFromCurrenltyLoggedInUser;
    };

    FindChatById = async (payload) => {
        const {_id} = payload;
        const chat = await this.chatModel.findById(new mongoose.Types.ObjectId(_id));
        return chat;
    };

    FindChatByUserAndReceiverId = async (payload) => {
        const {senderId,receiverId} = payload;
        const chat = await this.chatModel.findOne({members:{$all : [ new mongoose.Types.ObjectId(senderId),new mongoose.Types.ObjectId(receiverId)]}});
        return chat;
    };

    GetUserChats = async (payload) => {
        const {_id} = payload;
        const chats = await this.chatModel.aggregate([
            {
                $match : {
                    $expr: {
                        $in: [new mongoose.Types.ObjectId(_id),"$members"]
                    }
                }
            },
            {
                $lookup : {
                    from : "users",
                    let:{members:"$members"},
                    pipeline:[
                        {
                            $match:{
                                $expr : {
                                    $in : ["$$members","$_id"]
                                }
                            }
                        }
                    ],
                    as:"members"
                }
            },
            {
                $unwind : "$members"
            },
            {
                $lookup : {
                    from : "messages",
                    localField:"lastMessage",
                    foreignField:"_id",
                    as:"lastMessage"
                }
            },
            {
                $project : {
                    _id:1,
                    members:{
                        "members.fullname":1,
                        "members.lastSeen":1,
                        "members._id":1,
                        "members.avatar":1,
                        "members.createdAt":1,
                    },
                    lastMessage:1,
                }
            }
        ]);
        return chats;
    };
}

export default ChatServices;
