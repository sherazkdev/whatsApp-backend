import Joi from "joi";

// Validaters 
export const CreateChatValidate = Joi.object({
    receiverId:Joi.string().min(24).max(24).required(),
});
export const DeleteChatValidate = Joi.object({
    chatId:Joi.string().min(24).max(24).required(),
});
