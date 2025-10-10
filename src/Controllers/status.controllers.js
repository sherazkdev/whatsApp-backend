import mongoose from "mongoose";

// services
import StatusServices  from "../Services/status.services.js";
import { DeleteStatusValidate, UploadStatusValidate, WatchStatusValidate } from "../Validaters/status.validaters.js";
import ApiError from "../Utils/ApiError.js";
import { ERROR_MESSAGES, STATUS_CODES, SUCCESS_MESSAGES } from "../Constants/responseConstants.js";
import ApiResponse from "../Utils/ApiResponse.js";

class StatusControllers extends StatusServices {
    constructor(){
        super();
    }

    HandleUpdloadStatus = async (req,res) => {
        const {error,value} = UploadStatusValidate.validate(req.body);
        if(error){
            const message = error.details.map(e => e.message);
            throw new ApiError(STATUS_CODES.NOT_FOUND,message);
        }
        const uploadStatusPayload = {
            content:value.content,
            type:value.type,
            mediaUrl:value.mediaUrl,
            userId:req.user._id
        };
        const uploadStatusDocument = await this.UploadStatus(uploadStatusPayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(uploadStatusDocument,SUCCESS_MESSAGES.STATUS_UPLOADED,true,STATUS_CODES.OK));
    };
    HandleDeleteStatus = async (req,res) => {
        const {error} = DeleteStatusValidate.validate(req.body);
        if(error){
            const message = error.details.map(e => e.message);
            throw new ApiError(STATUS_CODES.NOT_FOUND,message);   
        }
        
        const deleteStatusPayload = {
            statusId:value.statusId,
            userId:req.user._id
        };
        const deleteStatusDocument = await this.DeleteStatus(deleteStatusPayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(deleteStatusDocument,SUCCESS_MESSAGES.STATUS_DELETED,true,STATUS_CODES.OK));
    };
    HandleWatchStaus = async (req,res) => {
        const {error} = WatchStatusValidate.validate(req.body);
        if(error){
            const message = error.details.map(e => e.message);
            throw new ApiError(STATUS_CODES.NOT_FOUND,message);
        }
        const watchStatusPayload = {
            statusId:value.statusId,
            userId:req.user._id
        };
        const watchStatusDocument = await this.WatchStatus(watchStatusPayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(watchStatusDocument,SUCCESS_MESSAGES.DATA_FETCHED,true,STATUS_CODES.OK));
    };
    HandleGetAllStatus = async (req,res) => {
        const allStatus = await this.GetAllStatus({userId:req.user._id});
        return res.status(STATUS_CODES.OK).json( new ApiResponse(allStatus[0],SUCCESS_MESSAGES.DATA_FETCHED,true,STATUS_CODES.OK))
    };
}

export default new StatusControllers;