// statusModel
import statusModel from "../Models/status.model.js";

// Services
import mongoose from "mongoose";
import ChatServices from "./chat.services.js";
import { STATUS_CODES,ERROR_MESSAGES,SUCCESS_MESSAGES } from "../Constants/responseConstants.js";
import ApiError from "../Utils/ApiError.js";

class StatusServices extends ChatServices{
    constructor(){
        super();
        this.statusModel = statusModel;
    }

    UploadStatus = async (payload) => {
        const {type,mediaUrl,content,userId} = payload;

        if(["VIDEO","IMAGE","TEXT"].includes(type) !== true){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        const statusExpiryDate = Date.now() + ( 12 * 60 * 60 * 1000);
        const uploadStatus = await this.statusModel.create({
            content:content.toString().trim(),
            mediaUrl:mediaUrl,
            userId:new mongoose.Types.ObjectId(userId),
            seenBy:null,
            type:type,
            isExpire: statusExpiryDate,
        });
        return uploadStatus;
    };

    WatchStatus = async (payload) => {
        const {statusId,userId} = payload;
        
        const status = await this.statusModel.aggregate([
            {
                $match : {
                    $expr : {
                        $and : [
                            {$eq : ["$_id",new mongoose.Types.ObjectId(statusId)]},
                            {$gte : ["$isExpire",Date.now()]}
                        ]
                    }
                }
            },
            {
                $lookup : {
                    from : "users",
                    localField:"userId",
                    foreignField:"_id",
                    as:"userId"
                }
            },
            {
                $lookup : {
                    from : "users",
                    let:{userId:"$seenBy.userId"},
                    pipeline : [
                        {
                            $match : {
                                $expr : {
                                    $eq : ["$_id","$$userId"]
                                }
                            }
                        }
                    ],
                    as:"seenBy"
                }
            },
            {
                $addFields : {
                    seenBy : {
                        $first : "$seenBy"
                    },
                    userId : {
                        $first : "$userId"
                    }
                }
            },
            {
                _id:1,
                content:1,
                seenBy:1,
                userId:1,
                mediaUrl:1,
                createdAt:1,
                type:1,
                isExpire:1,
            }
        ]);
        
        if(status[0].seenBy.userId.includes(statusId) !== true){
            const UpdateStatusSeenBy = await this.statusModel.findByIdAndUpdate(new mongoose.Types.ObjectId(statusId),{
                $push : {seenBy:{
                    userId:new mongoose.Types.ObjectId(userId),  
                    createdAt:Date.now()
                }}
            })
        }

        return status;
    };

    DeleteStatus = async (payload) => {
        const {statusId,userId} = payload;
        const verifyStatusAndStatusOwner = await this.statusModel.findOne({_id:new mongoose.Types.ObjectId(statusId),userId:new mongoose.Types.ObjectId(userId)});
        if(!verifyStatusAndStatusOwner){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.STAR_NOT_FOUND);
        }
        const deleteStatus = await this.statusModel.findByIdAndDelete(new mongoose.Types.ObjectId(verifyStatusAndStatusOwner._id));
        return deleteStatus;
    };

    GetAllStatus = async (payload) => {
        const {userId} = payload;

        const chats = await this.chatModel.find({members:new mongoose.Types.ObjectId(userId)});
        const filterAllUserAndRemoveLoggedInUser = chats.filter( (chat) => chat?.members?.find( (member) => member.toString().trim() !== userId.toString().trim()));

        const filterdStatus = await this.statusModel.aggregate( [
            {
                $match : {
                    $expr : {
                        userId: {$in : filterAllUserAndRemoveLoggedInUser},
                        isExpire : { $gte:  Date.now()}
                        
                    }
                }
            },
            {
                $lookup : {
                    from : "users",
                    localField:"userId",
                    foreignField:"_id",
                    as:"userId"
                }
            },
            {
                $unwind : "$userId"
            },
            {
                $project : {
                    _id:1,
                    userId : {
                        "userId._id":1,
                        "userId.fullname":1,
                        "userId.avatar":1,
                    },
                    content:1,
                    mediaUrl:1,
                    seenBy:1,
                    type:1,
                    isExpire:1
                }
            }
        ] );

        return filterAllUserAndRemoveLoggedInUser;
    };
    
}

export default StatusServices;