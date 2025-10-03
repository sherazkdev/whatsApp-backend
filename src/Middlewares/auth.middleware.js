import jwt from "jsonwebtoken";
import ApiError from "../Utils/ApiError.js";
import { ERROR_MESSAGES, STATUS_CODES } from "../Constants/responseConstants.js";
import UserModel from "../Models/user.model.js";
import mongoose from "mongoose";

class Authentication{

    VerifyUserCookies = async (req,res,next) => {
        try {

        const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
        if(!token){
            throw new ApiError(404,"Unauthorized Request");
        }

        const verifyJwt = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        if(!verifyJwt) {
            throw new ApiError(402,"Jwt Is Not Verifed")
        }
        const checkTheUserInDb = await UserModel.findById(verifyJwt._id).select("-password -refreshToken");
    
        if(!checkTheUserInDb){
            throw new ApiError(404,"User Not Found Error From verifyJsonWebToekns")
        }

        req.user = checkTheUserInDb;

        next();


        } catch (error) {
            throw new ApiError(401,error.message)
        }

    }

}

export default new Authentication;