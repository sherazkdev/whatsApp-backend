import Joi from "joi";

export const CreateGroupValidate = Joi.object({
    members:Joi.array().min(1).required(),
    name:Joi.string().min(3).required(),
    settings:Joi.object().min(2).required(),
    description:Joi.string().optional(),
    groupAvatar:Joi.string().optional(),
});

export const SetNewAdminValidate = Joi.object({
    userId:Joi.string().min(24).max(24).required(),
    groupId:Joi.string().min(24).max(24).required()
});

export const ExitGroupValidate = Joi.object({
    groupId:Joi.string().min(24).max(24).required(),
})

export const ExitGroupAndClearedChatValidate = Joi.object({
    groupId:Joi.string().min(24).max(24).required(),
});

export const AddNewMemberValidate = Joi.object({
    groupId:Joi.string().min(24).max(24).required(),
    userId:Joi.string().min(24).max(24).required(),
});

export const RemoveMemberValidate = Joi.object({
    groupId:Joi.string().min(24).max(24).required(),
    userId:Joi.string().min(24).max(24).required(),
});

export const UpdateGroupNameValidate = Joi.object({
    groupId:Joi.string().min(24).max(24).required(),
    name:Joi.string().min(3).required(),
});
export const UpdateGroupDescriptionValidate = Joi.object({
    groupId:Joi.string().min(24).max(24).required(),
    description:Joi.string().min(3).required(),
});
export const UpdateGroupSettingsValidate = Joi.object({
    groupId:Joi.string().min(24).max(24).required(),
    settings:Joi.object().required(),
});

export const UpdateGroupAvatarValidate = Joi.object({
    groupId:Joi.string().min(24).max(24).required(),
    groupAvatar:Joi.string().required(),
})