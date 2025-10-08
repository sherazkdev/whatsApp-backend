// chatModel
import chatModel from "../Models/chat.model.js";

// Services
import mongoose from "mongoose";
import { STATUS_CODES,ERROR_MESSAGES,SUCCESS_MESSAGES } from "../Constants/responseConstants.js";
import ApiError from "../Utils/ApiError.js";
import UserServices from "./user.services.js";

class ChatServices extends UserServices{
    constructor(){
        super();
        this.chatModel = chatModel;
    }

    // chat creating proccess
    CreateChat = async (payload) => {
        const {sender,receiver} = payload;
        const verifyTheUserIsExist = await this.FindUserById({_id:receiver});
        if(!verifyTheUserIsExist){
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.USER_NOT_FOUND);
        }
        const checkTheUserChatIsExist = await this.CheckUserAndReceiverChatExist(payload);
        if(checkTheUserChatIsExist){
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.CHAT_ALREADY_EXISTS)
        }
        const createChat = await this.chatModel.create({
            members:[new mongoose.Types.ObjectId(sender),new mongoose.Types.ObjectId(receiver)]
        });
        return createChat;
    };

    CheckUserAndReceiverChatExist = async (payload) => {
        const {sender,receiver} = payload;
        const checkTheUserChatIsExist = await this.chatModel.findOne({
            members: { $all: [sender, receiver] }
        });
        return checkTheUserChatIsExist
    }

    DeleteChat = async (payload) => {
        const {sender,chatId} = payload;
        const checkChatRoomIsExist = await this.FindChatById({_id:chatId});
        if(!checkChatRoomIsExist){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.CHAT_NOT_FOUND)
        }
        /** deleteChatFromCurrenltyLoggedInUser */
        const deleteChatFromCurrenltyLoggedInUser = await this.chatModel.findByIdAndUpdate(new mongoose.Types.ObjectId(checkChatRoomIsExistE._id),{
            $push : {clearedBy:new mongoose.Types.ObjectId(sender)}
        },{new:true});
        return deleteChatFromCurrenltyLoggedInUser;
    };

    FindChatById = async (payload) => {
        const {_id} = payload;
        const chat = await this.chatModel.findById(new mongoose.Types.ObjectId(_id));
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

    FindChatMemberAndReceiver = async (payload) => {
        const {loggedInUser,chatId} = payload;
        const chat = await this.FindChatById({_id:chatId});
        if(!chat){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.CHAT_NOT_FOUND);
        }
        const members = {
            sender:chat?.filter( (id) => id.toString().trim() === loggedInUser.toString().trim()),
            receiver:chat?.filter( (id) => id.toString().trim() !== loggedInUser.toString().trim())
        };
        return members;
    }

    verifyChatOwnership = async (payload) => {
        const {owner,chatId} = payload;
        const chat = await this.FindChatById({_id:chatId});
        if(!chat){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.CHAT_NOT_FOUND);
        }
        if(chat.members?.includes(owner) !== true){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.CHAT_OWNER_NOT_FOUND)
        }
        return chat;
    }
}

export default ChatServices;
