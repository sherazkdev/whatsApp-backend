import Joi from "joi";

export const LoginUserValidate = Joi.object({
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
    inputValue: Joi.string().min(4).required()
});

export const OtpSendValidate = Joi.object({
    inputValue: Joi.string().required(),
});

export const ResendOtpValidate = Joi.object({
    type: Joi.string().min(5).max(7).required(),
    inputValue: Joi.string().required(),
})

export const RegisterUserValidate = Joi.object({
    fullname: Joi.string().min(3).max(30).required(),
    username: Joi.string().alphanum().min(6).max(15).required(),
    email: Joi.string().email().lowercase().required(),
    avatar: Joi.string().required(),
    coverImage: Joi.string().allow(""),
    phoneNumber: Joi.string().pattern(/^\+?[0-9]{10,15}$/).allow(""),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
});

export const UpdateUserAvatarValidate = Joi.object({
    avatar: Joi.string().required()
});

export const UpdateUserCoverImageValidate = Joi.object({
    coverImage: Joi.string().required()
});

export const UpdateUserFullnameValidate = Joi.object({
    fullname: Joi.string().min(3).max(30).required()
});

export const UpdateUserUsernameValidate = Joi.object({
    username: Joi.string().alphanum().min(6).max(15).required()
});

export const UpdateUserAboutValidate = Joi.object({
    about: Joi.string().max(200).required()
});

export const BlockedUserValidate = Joi.object({
    blockId: Joi.string().required()
});
