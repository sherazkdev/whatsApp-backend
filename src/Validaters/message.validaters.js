import Joi from "joi";

export const sendMessageValidate = Joi.object({
    content:Joi.string().required(),
    type:Joi.string().required(),
    receiverId:Joi.string().required().min(24).max(24),
    mediaUrl:Joi.string().optional(),
    fileName:Joi.string().optional()
});
export const UpdateMessageValidate = Joi.object({
    content:Joi.string().required().min(1),
    _id:Joi.string().required().min(24).max(24)
});
export const DeleteMessageValidate = Joi.object({
    _id:Joi.string().min(24).max(24).required()
});
export const ReplyMessageValidate = Joi.object({
    _id:Joi.string().min(24).max(24).required(),
    receiverId:Joi.string().min(24).max(24).required(),
    content:Joi.string().required(),
    type:Joi.string().required(),
    mediaUrl:Joi.string().optional(),
    fileName:Joi.string().optional()
});
export const DeleteUserMessagesValidate = Joi.object({
    chatId:Joi.string().min(24).max(24).required(),
});
export const UpdateMessageSeenStatusValidate = Joi.object({
    messageId:Joi.string().min(24).max(24).required(),
    seen:Joi.string().required(),
});
export const SendGroupMessageValidate = Joi.object({
    groupId:Joi.string().min(24).max(24).required(),
    content:Joi.string().required(),
    type:Joi.string().required(),
    mediaUrl:Joi.string().optional(),
    fileName:Joi.string().optional()
});
export const SendStatusMessageValidate = Joi.object({
    statusId:Joi.string().min(24).max(24).required(),
    content:Joi.string().required(),
    type:Joi.string().required(),
});
export const GetUserMessageValidate = Joi.object({
    receiverId:Joi.string().min(24).max(24).required()
});
export const ForwardMessageValidate = Joi.object({
    messageId:Joi.string().min(24).max(24).required(),
    receiverId:Joi.string().min(24).max(24).required(),
});
