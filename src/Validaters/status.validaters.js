import Joi from "joi";


export const UploadStatusValidate = Joi.object({
    content:Joi.string().optional(),
    type:Joi.string().required(),
    media:Joi.string().required(),
});

export const DeleteStatusValidate = Joi.object({
    statusId:Joi.string().min(24).max(24).required()    
});