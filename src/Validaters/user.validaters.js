import Joi from "joi";

export const LoginUserValidate = Joi.object({
    otp:Joi.number().min(4).max(4).required(),
    inputValue:Joi.string().min(4).required()
});
export const OtpSendValidate = Joi.object({
    inputValue:Joi.string().required(),
});
export const RegisterUserValidate = Joi.object({
    fullname:Joi.string().required().min(3),
    username:Joi.string().min(6).max(15).required(),
    email:Joi.string().email().required(),
    avatar:Joi.string().required(),
    coverImage:Joi.string(),
    phoneNumber:Joi.string(),
    otp:Joi.
})
export const UpdateUserAvatarValidate = Joi.object({
    cvatarPath:Joi.string().required()
});
export const UpdateUserCoverImageValidate = Joi.object({
    coverImagePath:Joi.string().required()
});
export const UpdateUserFullnameValidate = Joi.object({
    fullname:Joi.string().required()
});
export const UpdateUserUsernameValidate = Joi.object({
    username:Joi.string().required()
});
export const UpdateUserAboutValidate = Joi.object({
    about:Joi.string().required()
});
export const BlockedUserValidate = Joi.object({
    blockId:Joi.string().required()
});