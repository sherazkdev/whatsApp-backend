// groupModel
import groupModel from "../Models/group.model.js";

// Services
import ChatServices from "./chat.services.js";
import mongoose from "mongoose";
import { STATUS_CODES,ERROR_MESSAGES,SUCCESS_MESSAGES } from "../Constants/responseConstants.js";
import ApiError from "../Utils/ApiError.js";

class GroupServices extends ChatServices{
    constructor(){
        super();
        this.groupModel = groupModel;
    }

    CreateGroup = async (payload) => {

        const {name,description,groupAvatar,settings,members,admin} = payload;

        const createGroup = await this.groupModel.create({
            admins : [admin],
            members : [members].push(admin),
            groupAvatar : groupAvatar || null,
            description: description || "",
            name: name,
            settings:{
                addOtherMembers:settings.addOtherMembers,
                sendMessages:settings.sendMessages,
                editGroupSettings:settings.editGroupSettings
            },
            groupType:"PRIVATE",
        });

        const createChatForGroup = await this.chatModel.create({
            groupId:createGroup._id,
            members:createGroup.members,
            isGroup:true,
        });


        return {createGroup,createChatForGroup};

    };

    DeleteGroup = async (payload) => {
        const {groupId,admin,chatId} = payload;
        const findGroup = await this.groupModel.findOne({_id:new mongoose.Types.ObjectId(groupId),admins:{$in : [admin]}});
        if(!findGroup){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.GROUP_NOT_FOUND);
        }
        const deleteChat = await this.chatModel.findByIdAndDelete(new mongoose.Types.ObjectId(chatId));
        const deleteGroup = await this.groupModel.findByIdAndDelete(new mongoose.Types.ObjectId(groupId));
        if(!deleteChat || !deleteGroup){
            throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR,ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
        }
        return true;

    };

    RemoveMember = async (payload) => {
        const {memberId,groupId} = payload;
        const group = await this.FindGroupById({_id:groupId});
        if(!group){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.GROUP_NOT_FOUND);
        }
        // const removeMemberIndex = group.members.findIndex( member => member === memberId);
        // group.members.splice(removeMemberIndex,1);
        // await group.save();
        const removeMemberFromGroup = await this.groupModel.findByIdAndUpdate(new mongoose.Types.ObjectId(groupId),{
            $pull : {members:memberId}
        },{new:true});
        return removeMemberFromGroup;
    };

    FindGroupById = async (payload) => {
        const {_id} = payload;
        const group = await this.groupModel.findById(new mongoose.Types.ObjectId(_id));
        return group;
    }

    AddMember = async (payload) => {
        const {memberId,groupId} = payload;
        const group = await this.FindGroupById({_id:groupId});
        if(!group){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.GROUP_NOT_FOUND);
        }
        if(group?.members?.includes(memberId) === true){
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.USER_ALREADY_EXISTS);
        }
        group?.members?.push(memberId);

        await group.save();
        return group;
    };

    AddAdmin = async (payload) => {

        const {adminId,groupId} = payload;
        const group = await this.FindGroupById({_id:groupId});
        if(!group){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.GROUP_NOT_FOUND);
        }
        if(group?.admins?.includes(adminId) === true){
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.USER_ALREADY_EXISTS);
        }
        group?.admins?.push(memberId);

        await group.save();
        return group;
    };

    UpdateGroupName = async (payload) => {
        const {groupId,name} = payload;
        const group = await this.FindGroupById({_id:groupId});
        if(!group){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.GROUP_NOT_FOUND);
        }
        group.name = name;

        await group.save();
        return group;
    };

    UpdateGroupAvatar = async (payload) => {
        const {groupAvatar,groupId} = payload;
        const group = await this.FindGroupById({_id:groupId});
        if(!group){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.GROUP_NOT_FOUND);
        }
        group.groupAvatar = groupAvatar;

        await group.save();
        return group;
    };

    UpdateGroupSettings = async (payload) => {
        const {settings,groupId} = payload;
        const group = await this.FindGroupById({_id:groupId});
        if(!group){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.GROUP_NOT_FOUND);
        }
        group.settings.addOtherMembers = settings.addOtherMembers;
        group.settings.editGroupSettings = settings.editGroupSettings;
        group.settings.sendMessages = settings.sendMessages;

        await group.save();
        return group;
    };

    UpdateGroupDescription = async (payload) => {

        const {description,groupId} = payload;
        const group = await this.FindGroupById({_id:groupId});
        if(!group){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.GROUP_NOT_FOUND);
        }
        group.description = description;
        
        await group.save();
        return group;
    }; 

    ExistGroupAndDeleteChat = async (payload) => {
        const {groupId,userId,chatId} = payload;
        const group = await this.FindGroupById({_id:groupId});
        const chat = await this.FindChatById({_id:chatId});
        if(!group || !chat){
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.GROUP_NOT_FOUND);
        }
        if(!chat.clearedBy) chat.clearedBy = [];
        if(group?.members?.includes(userId) === true){
            
            if(group.members.length === 1 && group.admins.length === 1){
                // delete group record
                const deleteGroup = await this.groupModel.findOneAndDelete(new mongoose.Types.ObjectId(groupId));
                const deleteChat = await this.chatModel.findByIdAndDelete(new mongoose.Types.ObjectId(chatId));
                if(!deleteChat || !deleteChat){
                    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR,ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
                }
                return {deleteChat,deleteGroup};
            }else {
                const removeMemberFromGroup = await this.groupModel.findByIdAndUpdate(new mongoose.Types.ObjectId(groupId),{
                    $pull : {members:new mongoose.Types.ObjectId(userId)}
                });
                    
                chat.clearedBy.push(userId);
                await chat.save();
                return {chat,removeMemberFromGroup};
            }
            
        }else if(group?.admins?.includes(userId) === true){
            if(group?.admins?.length === 1){
                const findIndexToRemoveThisUser = group.admins.findIndex( (adminId) => adminId.toString().trim() === userId.toString().trim());
                if(findIndexToRemoveThisUser === -1){
                    throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.USER_NOT_FOUND);
                }
                group.admins.splice(findIndexToRemoveThisUser,1);
                const randomAdmin = Math.floor(Math.random() * group?.members?.length);
                group.admins.push(group.members[randomAdmin]);
                if(!chat.clearedBy) {
                    chat.clearedBy = [];
                }
                chat.clearedBy.push(userId);
                
                await chat.save();
                await group.save(); 
                
                return group;
            }else {                
                const findIndexToRemoveThisUser = group.admins.findIndex( (adminId) => adminId.toString().trim() === userId.toString().trim());
                if(findIndexToRemoveThisUser === -1){
                    throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.USER_NOT_FOUND);
                }
                group.admins.splice(findIndexToRemoveThisUser,1);
                chat.clearedBy.push(userId);
                
                await chat.save();
                await group.save();
                
                return group;
            }
        }
    };

    ExitGroup = async (payload) => {
        const {groupId,userId,chatId} = payload;
        const group = await this.FindGroupById({_id:groupId});
        const chat = await this.FindChatById({_id:chatId});
        if(!group || !chat){
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.GROUP_NOT_FOUND);
        }
        if(!chat.clearedBy) chat.clearedBy = [];
        if(group.members.includes(userId) === true){

            if(group.members.length === 1 && group.admins.length === 1){
                // delete group record
                const deleteGroup = await this.groupModel.findOneAndDelete(new mongoose.Types.ObjectId(groupId));
                const deleteChat = await this.chatModel.findByIdAndDelete(new mongoose.Types.ObjectId(chatId));
                if(!deleteChat || !deleteChat){
                    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR,ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
                }
                return {deleteChat,deleteGroup};
            }else {
                const removeUserFromMembers = await this.groupModel.findByIdAndUpdate( new mongoose.Types.ObjectId(groupId),{
                    $pull : {members:new mongoose.Types.ObjectId(userId)}
                });
                chat.members = removeUserFromMembers.members;
                await chat.save();
                return {removeUserFromMembers,chat};
            }

        }else if(group.admins.includes(userId) === true){
            if(group.members.length === 1 && group.admins.length === 1){
                // delete group record
                const deleteGroup = await this.groupModel.findByIdAndDelete(new mongoose.Types.ObjectId(groupId));
                const deleteChat = await this.chatModel.findByIdAndDelete(new mongoose.Types.ObjectId(chatId));
                if(!deleteChat || !deleteChat){
                    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR,ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
                }
                return {deleteChat,deleteGroup};
            }else {
                const randomMemberConvertingToOwner = Math.floor(Math.random() * group?.members?.length);
                const removeUserFromAdmin = await this.groupModel.findByIdAndUpdate( new mongoose.Types.ObjectId(groupId),{
                    $pull : {members:new mongoose.Types.ObjectId(userId)},
                    $push : {admins:group.members[randomMemberConvertingToOwner]}
                });
                chat.members = removeUserFromAdmin.members;
                await chat.save();
                return {removeUserFromAdmin,chat};
            }
        }else {
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.USER_NOT_FOUND);
        }
    };

}

export default GroupServices;