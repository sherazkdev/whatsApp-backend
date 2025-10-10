import mongoose from "mongoose";

// services
import GroupServices  from "../Services/group.services.js";
import { AddNewMemberValidate, CreateGroupValidate, ExitGroupAndClearedChatValidate, ExitGroupValidate, RemoveMemberValidate, SetNewAdminValidate, UpdateGroupAvatarValidate, UpdateGroupNameValidate, UpdateGroupSettingsValidate,UpdateGroupDescriptionValidate } from "../Validaters/group.validaters.js";
import ApiError from "../Utils/ApiError.js";
import { ERROR_MESSAGES, STATUS_CODES, SUCCESS_MESSAGES } from "../Constants/responseConstants.js";
import ApiResponse from "../Utils/ApiResponse.js";

class GroupControllers extends GroupServices {
    constructor(){
        super();
    }
    HandleCreateGroup = async (req,res) => {
        const {error,value} = CreateGroupValidate.validate(req.body);
        if(error){
            const message = error.details.map(e => e.message);
            throw new ApiError(STATUS_CODES.NOT_FOUND,message);
        }
        const createGroupPayload = {
            name:value.name,
            groupAvatar:value.groupAvatar,
            description:value.description,
            members:value.members,
            settings:value.settings,
            admin:req.user._id
        };
        const createGroupDocument = await this.CreateGroup(createGroupPayload);
        return res.status(STATUS_CODES.OK).json(new ApiResponse(createGroupDocument,SUCCESS_MESSAGES.GROUP_CREATED,true,STATUS_CODES.OK));
    };
    HandleAddAdmin = async (req,res) => {
        const {error,value} = SetNewAdminValidate.validate(req.body);
        if(error){
            const message = error.details.map(e => e.message);
            throw new ApiError(STATUS_CODES.NOT_FOUND,message);
        }
        const addAdminPayload = {
            groupId:value.groupId,
            adminId:value.userId,
            userId:req.user._id
        };
        const addAdminDocument = await this.AddAdmin(addAdminPayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(addAdminDocument,SUCCESS_MESSAGES.GROUP_ADMIN_ADDED))
    };
    HandleRemoveMember = async (req,res) => {
        const {error,value} = RemoveMemberValidate.validate(req.body);
        if(error){
            error.details?.map( (e) => {
                throw new ApiError(STATUS_CODES.NOT_FOUND,e.message);
            })
        }
        
        const removeMemberPayload = {
            memberId:value.userId,
            groupId:value.groupId,
            userId:req.user._id
        };
        const removeMemberDocument = await this.RemoveMember(removeMemberPayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(removeMemberDocument,SUCCESS_MESSAGES.GROUP_MEMBER_REMOVED))
    };
    HandleAddMember = async (req,res) => {
        
        const {error,value} = AddNewMemberValidate.validate(req.body);
        if(error){
            const message = error.details.map(e => e.message);
            throw new ApiError(STATUS_CODES.NOT_FOUND,message);
        }
        
        const addMemberPayload = {
            memberId:value.userId,
            groupId:value.groupId,
            userId:req.user._id
        };
        const addMemberDocument = await this.AddMember(addMemberPayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(addMemberDocument,SUCCESS_MESSAGES.GROUP_MEMBER_ADDED))
    };
    HandleUpdateGroupDescription = async (req,res) => {
        const {error,value} = UpdateGroupDescriptionValidate.validate(req.body);
        if(error){
            const message = error.details.map(e => e.message);
            throw new ApiError(STATUS_CODES.NOT_FOUND,message);
        }

        const updateDescriptionPayload = {
            groupId:value.groupId,
            userId:req.user._id,
            description:value.description,
        };
        const UpdateGroupDescriptionDocument = await this.UpdateGroupDescription(updateDescriptionPayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(updateDescriptionPayload,SUCCESS_MESSAGES.GROUP_UPDATED,true,STATUS_CODES.OK));
    };
    HandleUpdateGroupSettings = async (req,res) => {
        const {error,value} = UpdateGroupSettingsValidate.validate(req.body);
        if(error){
            const message = error.details.map(e => e.message);
            throw new ApiError(STATUS_CODES.NOT_FOUND,message);
        }
        const updateGroupSettingdPayload = {
            groupId:value.groupId,
            settings:value.settings,
            userId:req.user._id
        };
        const UpdateGroupSettingsDocument = await this.UpdateGroupSettings(updateGroupSettingdPayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(UpdateGroupSettingsDocument,SUCCESS_MESSAGES.GROUP_UPDATED,true,STATUS_CODES.OK));
    };
    HandleUpdateGroupAvatar = async (req,res) => {
        const {error,value} = UpdateGroupAvatarValidate.validate(req.body);
        if(error){
            const message = error.details.map(e => e.message);
            throw new ApiError(STATUS_CODES.NOT_FOUND,message);
        }

        const updateGroupAvatarPayload = {
            groupId:value.groupId,
            groupAvatar:value.groupAvatar,
            userId:req.user._id
        };
        const UpdateGroupAvatarDocument = await this.UpdateGroupAvatar(updateGroupAvatarPayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(UpdateGroupAvatarDocument,SUCCESS_MESSAGES.GROUP_UPDATED,true,STATUS_CODES.OK));
    };
    HandleExistGroupAndDeleteChat = async (req,res) => {
        const {error,value} = ExitGroupAndClearedChatValidate.validate(req.body);
        if(error){
            const message = error.details.map(e => e.message);
            throw new ApiError(STATUS_CODES.NOT_FOUND,message);
        }
        const exitGroupAndDeleteChatPayload = {
            chatId:value.chatId,
            groupId:value.groupId,
            userId:req.user._id
        };
        const exitGroupAndDeleteChatDocumentResponse = await this.ExistGroupAndDeleteChat(exitGroupAndDeleteChatPayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(exitGroupAndDeleteChatDocumentResponse,SUCCESS_MESSAGES.GROUP_MEMBER_REMOVED,true,STATUS_CODES.OK));
    };
    HandleExitGroup = async (req,res) => {
        const {error,value} = ExitGroupValidate.validate(req.body);
        if(error){
            const message = error.details.map(e => e.message);
            throw new ApiError(STATUS_CODES.NOT_FOUND,message);
        }
        const exitGroupPayload = {
            chatId:value.chatId,
            groupId:value.groupId,
            userId:req.user._id
        };
        const exitGroupDocumentResponse = await this.ExitGroup(exitGroupPayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(exitGroupDocumentResponse,SUCCESS_MESSAGES.GROUP_MEMBER_REMOVED,true,STATUS_CODES.OK));
    };
    HandleUpdateGroupName = async (req,res) => {
        const {error,value} = UpdateGroupNameValidate.validate(req.body);
        if(error){
            const message = error.details.map(e => e.message);
            throw new ApiError(STATUS_CODES.NOT_FOUND,message);
        }

        const updateGroupNamePayload = {
            groupId:value.groupId,
            name:value.name,
            chatId:value.chatId,
            userId:req.user._id
        };
        const UpdateGroupNameDocument = await this.UpdateGroupName(updateGroupNamePayload);
        return res.status(STATUS_CODES.OK).json( new ApiResponse(UpdateGroupNameDocument,SUCCESS_MESSAGES.GROUP_UPDATED,true,STATUS_CODES.OK));
    };

}

export default new GroupControllers;