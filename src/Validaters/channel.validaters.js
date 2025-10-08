import Joi from "joi";

export const CreateChannel = Joi.object({
    name:Joi.string().required(),
    description:Joi.string().optional(),
    channelAvatar:Joi.string().optional(),
});

