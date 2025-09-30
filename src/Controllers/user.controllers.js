import UserServices from "../Services/user.services.js";
import { ERROR_MESSAGES,STATUS_CODES } from "../Constants/responseConstants.js";
import { LoginUserValidate, OtpSendValidate, RegisterUserValidate, UpdateUserAvatarValidate, UpdateUserCoverImageValidate, UpdateUserFullnameValidate } from "../Validaters/user.validaters.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
class UserControllers extends UserServices {
    
    constructor(){
        super();
    }

    HandleLoginUser = async (req,res) => {
        const {error} = LoginUserValidate.validate(req.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error.details[0].message);
        }
        const userSavingPayload = {
            inputValue:req?.body?.inputValue,
            otp:req?.body?.otp
        };
        const verifyOtpAndUpdateUserObject = await this.LoginUser(userSavingPayload);
        const {acaccessToken,refreshToken} = this.GenrateAccessAndRefreshToken({_id:verifyOtpAndUpdateUserObject._id});
        const cookiesOptions = {
            httpOnly:true,
            secure:true,
            sameSite:"None"
        };

        return res.status(STATUS_CODES.OK)
        .cookie("accessToken",acaccessToken,cookiesOptions)
        .cookie("refreshToken",refreshToken,cookiesOptions)
        .json(new ApiResponse(verifyOtpAndUpdateUserObject,"Success: User Loggind In Successfully",true,STATUS_CODES.OK));
    };

    HandleRegisterUser = async (req,res) => {
        const {error} = RegisterUserValidate.validate(req?.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error.details[0].message);
        }
        const user = await this.FindUserByEmailOrUsernameOrPhoneNumberForSSR({inputValue:req?.body?.email});
        const {accessToken,refreshToken} = this.GenrateAccessAndRefreshToken({_id:user._id});

        const registerUserPayload = {
            email:req?.body?.email,
            phoneNumber:req?.body?.phoneNumber,
            username:req?.body?.email,
            fullname:req?.body?.email,
            _id:user._id,
            avatar:req?.body?.avatar,
            coverImage:req?.body?.coverImage,
        };

        const registerLatestUser = await this.RegisterUser(registerUserPayload);
        if(!registerLatestUser){
            throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR,ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
        }
        const cookiesOptions = {
            httpOnly:true,
            secure:true,
            sameSite:"None"
        };

        res.status(STATUS_CODES.OK)
        .cookie("accessToken",accessToken,cookiesOptions)
        .cookie("refreshToken",refreshToken,cookiesOptions)
        .json(new ApiResponse([],"Success:Your account successfully created",true,STATUS_CODES.OK))
    };

    HandleSendOtpForLogin = async (req,res) => {
        const {error,value} = OtpSendValidate.validate(req.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error?.details[0]?.message);
        }
        const user = await this.FindUserByEmailOrUsernameOrPhoneNumberForSSR({inputValue:req?.body?.inputValue});
        if(!user){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.USER_NOT_FOUND);
        }
        const genrateVerificationToken = this.GenrateOtp();
        const sendOtpPayload = {
            to:req?.body?.inputValue,
            mode:"login",
            subject:"WhatsApp Otp Verification",
            body:{
                otp:genrateVerificationToken,
                email:user.email
            }
        };
        const sendOtpUser = await this.SendOtpByEmail(sendOtpPayload);
        
        return res.status(STATUS_CODES.OK).json(new ApiResponse([],"Success: Otp Sended Successfully"));

    };

    HandleSendOtpForRegisteration = async (req,res) => {
        const {error,value} = OtpSendValidate.validate(req.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error?.details[0]?.message);
        }
        const genrateVerificationToken = this.GenrateOtp();
        const sendOtpPayload = {
            to:req?.body?.inputValue,
            mode:"register",
            subject:"WhatsApp Otp Verification",
            body:{
                otp:genrateVerificationToken,
                email:req.body.inputValue,
            }
        };
        const sendOtpUser = await this.SendOtpByEmail(sendOtpPayload);
        
        return res.status(STATUS_CODES.OK).json(new ApiResponse([],"Success: Otp Sended Successfully"));
    };

    HandleUpdateUserAvatar = async (req,res) => {
        const {error} = UpdateUserAvatarValidate.validate(req?.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error?.details[0]?.message);
        }
        const updateAvatarPayload = {
            _id:req.user._id,
            avatarPath:req?.body?.avatarPath,
        };
        const updateUserAvatar = await this.ChangeUserAvatarById(updateAvatarPayload);
        return res.status(STATUS_CODES.OK).json(new ApiResponse([],"Success: User Avatar Updated",true,STATUS_CODES.OK));
    };

    HandleUpdateUserFullname = async (req,res) => {
        const {error} = UpdateUserFullnameValidate.validate(req?.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error?.details[0]?.message);
        }
        const updateFullnamePayload = {
            _id:req.user._id,
            fullname:req?.body?.fullname,
        };
        const updateUserAvatar = await this.ChangeUserFullnameById(updateAvatarPayload);
        return res.status(STATUS_CODES.OK).json(new ApiResponse([],"Success: User Fullname Updated",true,STATUS_CODES.OK));        
    };

    HandleUpdateUserCoverImage = async (req,res) => {
        const {error} = UpdateUserCoverImageValidate.validate(req?.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error?.details[0]?.message);
        }
        const updateCoverImagePathPayload = {
            _id:req.user._id,
            coverImagePath:req?.body?.coverImagePath,
        };
        const updateCoverImagePathAvatar = await this.ChangeUserCoverImageById(updateCoverImagePathPayload);
        return res.status(STATUS_CODES.OK).json(new ApiResponse([],"Success: User CoverImage Updated",true,STATUS_CODES.OK));         
    };

    HandleSearchUser = (req,res) => {

    };

    HandleResendOtp = (req,res) => {};

    HandleLogoutUser = (req,res) => {};

    HandleGetUserProfile = (req,res) => {};

    HandleGetAllUsers = (req,res) => {};

    HandleBlockUser = (req,res) => {};
    
}

export default new UserControllers;