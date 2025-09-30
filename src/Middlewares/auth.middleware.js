import jwt from "jsonwebtoken";
import ApiError from "../Utils/ApiError.js";
import { ERROR_MESSAGES, STATUS_CODES } from "../Constants/responseConstants.js";
import UserModel from "../Models/user.model.js";
import mongoose from "mongoose";

class Authentication{

    VerifyUserCookies = async (req,res,next) => {
        const token = req.cookies?.accessToken;
        if(!token){
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
        }

        // Verify Json Web Token
        const VerifyJwt = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        if(!VerifyJwt)
        {
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.USER_NOT_FOUND);
        }
        // Verify user
        const user = await UserModel.findOne({_id:new mongoose.Types.ObjectId(VerifyJwt?._id),status:"ENABLED",isVerified:true}).select("-refreshToken -otp -otpExpiry");
        if(!user){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
        }

        // Asign req.user values for VeifyJwt object
        req.user = user;
        next();
    }

}

export default new Authentication;