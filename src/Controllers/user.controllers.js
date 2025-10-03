import UserServices from "../Services/user.services.js";
import { ERROR_MESSAGES,STATUS_CODES } from "../Constants/responseConstants.js";
import { BlockedUserValidate, LoginUserValidate, OtpSendValidate, RegisterUserValidate, ResendOtpValidate, UpdateUserAboutValidate, UpdateUserAvatarValidate, UpdateUserCoverImageValidate, UpdateUserFullnameValidate } from "../Validaters/user.validaters.js";
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
        const {accessToken,refreshToken} = await this.GenrateAccessAndRefreshToken({_id:verifyOtpAndUpdateUserObject._id});
        const cookiesOptions = {
            httpOnly:true,
            secure:true,
            sameSite:"None"
        };

        return res.status(STATUS_CODES.OK)
        .cookie("accessToken",accessToken,cookiesOptions)
        .cookie("refreshToken",refreshToken,cookiesOptions)
        .json(new ApiResponse(verifyOtpAndUpdateUserObject,"Success: User Loggind In Successfully",true,STATUS_CODES.OK));
    };

    HandleRegisterUser = async (req,res) => {
        const {error} = RegisterUserValidate.validate(req?.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error.details[0].message);
        }
        const checkUserIsAlreadyCreatedAccount = await this.FindUserByUsernameOrEmailOrPhone({inputValue:req?.body?.email});
        if(checkUserIsAlreadyCreatedAccount){
            throw new ApiError(STATUS_CODES.UNPROCESSABLE_ENTITY,ERROR_MESSAGES.USER_ALREADY_EXISTS);
        }
        const user = await this.FindUserByEmailOrUsernameOrPhoneNumberForSSR({inputValue:req?.body?.email});
        if(!user){
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.USER_NOT_FOUND);
        }
        const {accessToken,refreshToken} = await this.GenrateAccessAndRefreshToken({_id:user._id});
        const registerUserPayload = {
            email:req?.body?.email,
            phoneNumber:req?.body?.phoneNumber,
            username:req?.body?.username,
            fullname:req?.body?.email,
            _id:user._id,
            avatar:req?.body?.avatar,
            otp:req?.body?.otp,
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
        console.log(value)
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error?.details[0]?.message);
        }
        const user = await this.FindUserByUsernameOrEmailOrPhone({inputValue:req?.body?.inputValue});
        if(!user){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.USER_NOT_FOUND);
        }
        const genrateVerificationToken = this.GenrateOtp();
        const sendingType = "Login";
        const sendOtpPayload = {
            to:req?.body?.inputValue,
            type:sendingType,
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
        const user = await this.FindUserByEmailOrUsernameOrPhoneNumberForSSR({inputValue:req?.body?.inputValue});
        if(user){
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.USER_ALREADY_EXISTS);
        }
        const genrateVerificationToken = this.GenrateOtp();
        const sendingType = "Register";
        const sendOtpPayload = {
            to:req?.body?.inputValue,
            mode:type,
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
        const {error} = UpdateUserAvatarValidate.validate(req?.body,{abortEarly:true});
        if(error){
            console.log(error.details)
            throw new ApiError(STATUS_CODES.NOT_FOUND,error?.details[0]?.message);
        }
        const updateAvatarPayload = {
            _id:req.user._id,
            avatar:req?.body?.avatar,
        };
        const updateUserAvatar = await this.ChangeUserAvatarById(updateAvatarPayload);
        return res.status(STATUS_CODES.OK).json(new ApiResponse([],"Success: User Avatar Updated",true,STATUS_CODES.OK));
    };

    HandleUpdateUserFullname = async (req,res) => {
        const {error} = UpdateUserFullnameValidate.validate(req?.body);
        if(error){
            throw new ApiError(STATUS_CODES.NOT_FOUND,error?.details[0]?.message);
        }
        console.log(req.body)
        const updateFullnamePayload = {
            _id:req.user._id,
            fullname:req?.body?.fullname,
        };
        const updateUserAvatar = await this.ChangeUserFullnameById(updateFullnamePayload);
        console.log(updateUserAvatar)
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

    HandleResendOtp = async (req,res) => {
        const {error} = ResendOtpValidate.validate(req?.body,{abortEarly:true});
        if(error){
            error?.details?.map( (e) => { throw new ApiError(STATUS_CODES.NOT_FOUND,e.message) })
        }
        const genrateRandomOtp = this.GenrateOtp();
        const sendingType = req?.body?.type;
        const resendOtpPayload = {
            type:sendingType,
            to:req?.body?.inputValue,
            body:{
                email:req?.body?.inputValue,
                otp:genrateRandomOtp
            }
        };
        const updateUserDocumentAndSendOtp = await this.SendOtpByEmail(resendOtpPayload);
        return res.status(STATUS_CODES.OK).json(new ApiResponse(updateUserDocumentAndSendOtp,"Success: otp resended succesfully",true,STATUS_CODES.OK))
    };

    HandleLogoutUser = async (req,res) => {

        const loggedInUserRemoveAccessToken = await this.userModel.findByIdAndUpdate(req?.user?._id,{
            $set : {refreshToken:null}
        });
        const cookiesOptions = {
            httpOnly:true,
            secure:true,
            sameSite:"None",
        };
        res.status(STATUS_CODES.OK)
        .clearCookie("accessToken",cookiesOptions)
        .clearCookie("refreshToken",cookiesOptions)
        .json(new ApiResponse([],"Success: User sign out successfully",true,STATUS_CODES.OK))

    };

    HandleGetUserProfile = (req,res) => {};

    HandleGetAllUsers = (req,res) => {};

    HandleBlockUser = async (req,res) => {
        const {error} = BlockedUserValidate.validate(req.body,{abortEarly:true});
        if(error){
            throw new ApiError(STATUS_CODES.NO_CONTENT,error.details[0].message);
        }
        const user = await this.FindUserById({_id:req?.user?._id});
        const checkBlockedUser = await this.FindUserById({_id:req?.body?.blockId});
        if(!checkBlockedUser){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.USER_NOT_FOUND);
        }
        const blockUserPayload = {
            _id:user?._id,
            blockId:checkBlockedUser?._id,
        };

        const blockedUserUpdatedDocument = await this.BlockToggleUserById(blockUserPayload);

        // fincaly return blocked user response
        return res.status(STATUS_CODES.OK).json(new ApiResponse(blockedUserUpdatedDocument,"Success: User Blocked successfully",true,200));
    };

    HandleUpdateUserAbout = async (req,res) => {
        const {error} = await UpdateUserAboutValidate.validate(req.body,{abortEarly:true});
        if(error){
            throw new ApiError(STATUS_CODES.NO_CONTENT,error.details[0].message);
        }
        const user = await this.FindUserById({_id:req.user._id});
        const updateAboutPayload = {
            about:req?.body?.about,
            _id:user?._id
        };
        const updateAboutSection = await this.ChangeUserAboutById(updateAboutPayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(updateAboutSection,"Success: user About updated Successfully",true,STATUS_CODES.OK))
    };

    HandleRefreshAccessToken = async (req,res) => {

    };
    
}

export default new UserControllers;