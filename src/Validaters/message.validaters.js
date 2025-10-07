import Joi from "joi";

export const sendMessageValidate = Joi.object({
    content:Joi.string().required(),
    type:Joi.string().required(),
    chatId:Joi.string().required().min(1),
    mediaUrl:Joi.string().optional(),
    filename:Joi.string().optional()
});
export const UpdateMessageValidate = Joi.object({
    content:Joi.string().required().min(1),
    chatId:Joi.string().required().min(1),
    messageId:Joi.string().required().min(24).max(24)
});
export const DeleteMessageValidate = Joi.object({
    chatId:Joi.string().required().min(1),
    messageId:Joi.string().min(24).max(24).required()
});
export const ReplyMessageValidate = Joi.object({
    messageId:Joi.string().min(24).max(24).required(),
    chatId:Joi.string().required().min(1),
    content:Joi.string().required(),
    type:Joi.string().required(),
    mediaUrl:Joi.string().optional(),
    filename:Joi.string().optional()
});
export const DeleteUserMessagesValidate = Joi.object({
    chatId:Joi.string().min(24).max(24).required(),
});
export const UpdateMessageSeenStatusValidate = Joi.object({
    chatId:Joi.string().required().min(1),
    messageId:Joi.string().min(24).max(24).required(),
    seen:Joi.string().required(),
});
export const SendGroupMessageValidate = Joi.object({
    groupId:Joi.string().min(24).max(24).required(),
    content:Joi.string().required(),
    type:Joi.string().required(),
    mediaUrl:Joi.string().optional(),
    filename:Joi.string().optional()
});
export const SendStatusMessageValidate = Joi.object({
    statusId:Joi.string().min(24).max(24).required(),
    content:Joi.string().required(),
    type:Joi.string().required(),
});
export const GetUserMessageValidate = Joi.object({
    chatId:Joi.string().min(24).max(24).required()
});
export const ForwardMessageValidate = Joi.object({
    messageId:Joi.string().min(24).max(24).required(),
    chatId:Joi.string().required().min(1),
    forwardToChatId:Joi.string().min(24).max(24).required(),
});
