// statusModel
import statusModel from "../Models/status.model.js";

// Services
import mongoose from "mongoose";
import { STATUS_CODES,ERROR_MESSAGES,SUCCESS_MESSAGES } from "../Constants/responseConstants.js";
import ApiError from "../Utils/ApiError.js";

class StatusServices {
    constructor(){
        this.statusModel = statusModel;
    }

    UploadStatus = async (payload) => {};

    ViewStatus = async (payload) => {};

    UpdateSeenBy = async (payload) => {};

    DeleteStatus = async (payload) => {};

    // GetStatus   
}

export default StatusServices;