import mongoose from "mongoose";
import userModel from "../Models/user.model.js"
import ApiError from "../Utils/ApiError.js";
import {ERROR_MESSAGES,STATUS_CODES} from "../Constants/responseConstants.js";
import NodeMailer from "../Utils/nodeMailer.js";

class UserServices {
    
    constructor(){
        this.userModel = userModel;
    }

    // Refresh refreshToken
    GenrateAccessAndRefreshToken = async (payload) => {
        const {_id} = payload;
        const user = await this.FindUserById(new mongoose.Types.ObjectId(_id));

        // genrating tokens
        const accessToken = await user.genrateAccessToken();
        const refreshToken = await user.genrateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave:false});
        
        return {accessToken,refreshToken};

    };

    // Genrate OTP
    GenrateOtp = () => {
        
        let genratingNewOtp = "";
        for(let i = 1; i <= 6; i++){
            genratingNewOtp += Math.floor( Math.random() * 10 );
        }

        return genratingNewOtp;

    };

    // Find user by username or email or phone for client side
    FindUserByUsernameOrEmailOrPhone = async (payload) => {
        const {inputValue} = payload;
        const matchedUsers = await this.userModel.findOne({
            $or : [
                {email:inputValue},
                {phoneNumber:inputValue},
                {username:inputValue}
            ],
            status:String("ENABLED"),
            isVerified:true
        });

        // return matched users
        return matchedUsers;

    };

    // Change Avatar
    ChangeUserAvatarById = async (payload) => {
        const {avatar,_id} = payload;
        const changeAvatar = await this.userModel.findByIdAndUpdate(new mongoose.Types.ObjectId(_id),{
            $set : {avatar:String(avatar)}
        },{new:true}).select("-refreshToken");

        return changeAvatar;
    };

    // Change CoverImage
    ChangeUserCoverImageById = async (payload) => {
        const {_id,coverImagePath} = payload;
        const changeUserCoverImage = await this.userModel.findByIdAndUpdate(new mongoose.Types.ObjectId(_id),{
            $set : {coverImage:String(coverImagePath)}
        },{new:true}).select("-refreshToken");
        return changeUserCoverImage;
    };

    // Change fullname 
    ChangeUserFullnameById = async (payload) => {
        const {_id,fullname} = payload;
        const changeUserFullname = await this.userModel.findByIdAndUpdate(new mongoose.Types.ObjectId(_id),{
            $set : {fullname:String(fullname)}
        },{new:true}).select("-refreshToken");
        return changeUserFullname;
    };
    
    // Change User About
    ChangeUserAboutById = async (payload) => {
        const {_id,about} = payload;
        const changeUserAbout = await this.userModel.findByIdAndUpdate(new mongoose.Types.ObjectId(_id),{
            $set : {about:String(about)}
        },{new:true}).select("-refreshToken");
        return changeUserAbout;
    };

    // Register User Information
    RegisterUser = async (payload) => {
        const {fullname,_id,username,phoneNumber,avatar,coverImage,otp} = payload;
        
        const user = await this.FindUserById({_id});

        if (user.otpExpiry && user.otpExpiry.getTime() > Date.now()) {
            const otpComparing = await user.verifyHashedOtp(otp);
            if(!otpComparing){
                throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.OTP_INVALID);
            }
            const updateUserInfo = await this.userModel.findByIdAndUpdate(new mongoose.Types.ObjectId(user._id),{
                $set : {
                    otp:null,
                    otpExpiry:null,
                    fullname:fullname,
                    username:username,
                    phoneNumber:phoneNumber,
                    avatar:avatar,
                    coverImage:coverImage,
                    isVerified:true,
                    status:"ENABLED"
                },
            }).select("-otp -otpExpiry -refreshToken");
            return updateUserInfo;
        }else {
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.OTP_EXPIRED)
        }
    };

    // Login user with Information
    LoginUser = async (payload) => {     
        const {inputValue,otp} = payload;

        const checkUserIsExist = await this.FindUserByUsernameOrEmailOrPhone({inputValue});
        if(!checkUserIsExist || checkUserIsExist.length < 1){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.USER_NOT_FOUND);
        }
        if (checkUserIsExist.otpExpiry && checkUserIsExist.otpExpiry.getTime() > Date.now()) {
            const otpComparing = await checkUserIsExist.verifyHashedOtp(otp);
            if(!otpComparing){
                throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.OTP_INVALID);
            }
            const updateUserInfo = await this.userModel.findByIdAndUpdate(new mongoose.Types.ObjectId(checkUserIsExist._id),{
                $set : {otp:null,otpExpiry:null},
            }).select("-otp -otpExpiry -refreshToken");
            return updateUserInfo;
        }else {
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.OTP_EXPIRED)
        }
        

    };

    // Change User Online Status
    ChangeUserOnlineStatus = async (payload) => {
        const {_id,isOnlineStatus} = payload;
        const user = await this.FindUserById({_id});
        if(!user){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.USER_NOT_FOUND);
        }
        const updateUserOnlineStatus = await this.userModel.findOneAndUpdate(new mongoose.Types.ObjectId(user._id),{
            $set:{isOnline:isOnlineStatus}
        }).select("-otp -otpExpiry -refreshToken");
        return updateUserOnlineStatus;
    };

    // Block User
    BlockToggleUserById = async (payload) => {
        const {_id,blockId} = payload;
        const user = await this.FindUserById(_id);

        if(user?.blockedUsers?.includes(blockId)){
            const sliceBlockIdFromUserBlockList = await this.userModel.findByIdAndUpdate(_id,{
                $pull:{blockedUsers:blockId}
            },{new:true});
            return sliceBlockIdFromUserBlockList;    
        }else{
            const pushBlockIdFromUserBlockList = await this.userModel.findByIdAndUpdate(_id,{
                $push:{blockedUsers:blockId}
            },{new:true});
            return pushBlockIdFromUserBlockList;
        }
    };

    // Send Otp
    SendOtpByEmail = async (payload) => {
        const {body,to,subject,type} = payload;

        if(type === "Login"){
            // Mail options object sending
            const sendMail = await new NodeMailer().send({to,text:body,subject});
            if(!sendMail){
                throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR,ERROR_MESSAGES.BAD_REQUEST);
            }
            const user = await this.userModel.findOneAndUpdate({email:to.toString()},{
                $set : {otp:body.otp,otpExpiry:new Date(new Date().getTime() + ( 5 * 60 * 1000))},
            },{new:true}).select("-refreshToken");
            if(!user){
                throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR,ERROR_MESSAGES.BAD_REQUEST);
            }
            return user;
        }else if(type === "Register"){
            const sendMail = await new NodeMailer().send({to,subject,text:body});
            if(!sendMail){
                throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR,ERROR_MESSAGES.BAD_REQUEST);
            }
            const registerUser = await this.userModel.create({
                email:to,
                otp:body.otp,
                otpExpiry: new Date(new Date().getTime() + ( 5 * 60 * 1000))
            });
            return registerUser;
        }
    };

    // find user by username email phone 
    FindUserByPhoneNumber = async (inputValue) => {

    };
    
    // Find user by id
    FindUserById = async (payload) => {
        const {_id} = payload;
        const user = await this.userModel.findById(new mongoose.Types.ObjectId(_id));
        return user;
    }

    // Find user by email for ssr not for client
    FindUserByEmailOrUsernameOrPhoneNumberForSSR = async (payload) => {
        const {inputValue} = payload;
        const user = await this.userModel.findOne({
            $or : [
                {email:String(inputValue)},
                {username:String(inputValue)},
                {phoneNumber:String(inputValue)},
            ]
        });
        return user;
    };


    // Verify Otp
    VerifyOtp = async (payload) => {
        const {mode,otp,email} = payload;
        if(mode === "register"){
            const user = await this.FindUserByUsernameOrEmailOrPhone({inputValue:email});
            const verifySendedOtpToHashedOtp = user.verifyHashedOtp(otp);
            if(!verifySendedOtpToHashedOtp){
                throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.OTP_INVALID);
            }
            user.isVerified = true;
            user.status = "ENABLED";
            user.otp = null;
            user.otpExpiry = null;
            await user.save();
            return true;
        }else if(mode === "login"){
            const user = await this.FindUserByUsernameOrEmailOrPhone({inputValue:email});
            const verifySendedOtpToHashedOtp = user.verifyHashedOtp(otp);
            if(!verifySendedOtpToHashedOtp){
                throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.OTP_INVALID);
            }
            user.otp = null;
            user.otpExpiry = null;
            await user.save();
            return true;
        }
    };



}

export default UserServices;