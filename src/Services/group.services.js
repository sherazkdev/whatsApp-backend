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
        /** First approch */
        // if(settings.addOtherMembers === undefined || settings.sendMessages === undefined || settings.editGroupSettings === undefined){
        //     throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.MISSING_FIELDS)
        // }
        
        /** Second approch */
        if([settings.addOtherMembers,settings.editGroupSettings,settings.sendMessages].some( (v) => v === undefined)){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.MISSING_FIELDS)
        }
        const filterMember = members.filter( (m) => m.trim());
        filterMember.push(admin)
        
        const createGroup = await this.groupModel.create({
            admins : [new mongoose.Types.ObjectId(admin)],
            members : filterMember,
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
        const {groupId,admin} = payload;
        const findGroup = await this.groupModel.findOne({_id:new mongoose.Types.ObjectId(groupId),admins:{$in : [admin]}});
        if(!findGroup){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.GROUP_NOT_FOUND);
        }
        const deleteChat = await this.chatModel.findOneAndDelete({groupId:new mongoose.Types.ObjectId(groupId)});
        const deleteGroup = await this.groupModel.findByIdAndDelete(new mongoose.Types.ObjectId(groupId));
        if(!deleteChat || !deleteGroup){
            throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR,ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
        }
        return true;

    };

    RemoveMember = async (payload) => {
        const {memberId,groupId} = payload;
        const group = await this.FindGroupById({_id:groupId});
        const chat = await this.FindChatByGroupId({_id:groupId});
        if(!group || !chat){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.CHAT_OR_GROUP_NOT_FOUND);
        }
        // const removeMemberIndex = group.members.findIndex( member => member === memberId);
        // group.members.splice(removeMemberIndex,1);
        // await group.save();
        // const removeMemberFromGroup = await this.groupModel.findByIdAndUpdate(new mongoose.Types.ObjectId(groupId),{
        //     $pull : {members:memberId}
        // },{new:true});
        const isInGroup = group.members.some(m => m.toString() === memberId.toString());
        const isInChat = chat.members.some(m => m.toString() === memberId.toString());
        if (!isInGroup || !isInChat) {
            throw new ApiError(
                STATUS_CODES.UNAUTHORIZED,
                ERROR_MESSAGES.CHAT_MEMBER_OR_GROUP_MEMBER_NOT_FOUND
            );
        }

        /** Remove for chat room userId and Remove from group userId */
        const memberGroupIndex = group.members.findIndex( (m) => m.toString().trim() === memberId.toString().trim());
        const memberChatIndex = chat.members.findIndex( (m) => m.toString().trim() === memberId.toString().trim());

        // remove from group and chat
        group.members.splice(memberGroupIndex,1);
        chat.members.splice(memberChatIndex,1);

        // saved updates
        await group.save();
        await chat.save();

        return {group,chat};
    };

    FindGroupById = async (payload) => {
        const {_id} = payload;
        const group = await this.groupModel.findById(new mongoose.Types.ObjectId(_id));
        return group;
    }

    AddMember = async (payload) => {
        const {memberId,groupId} = payload;
        const group = await this.FindGroupById({_id:groupId});
        const chat  = await this.FindChatByGroupId({_id:groupId});
        const member = await this.FindUserById({_id:memberId});
        if(!group || !chat){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.CHAT_AND_GROUP_NOT_FOUND);
        }
        if(!member){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.USER_NOT_FOUND);
        }
        if(group.members.some( (m) => m.toString().trim() === member._id.toString()) || chat.members.some( (m) => m.toString().trim() === member._id.toString())){
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.CHAT_MEMBER_OR_GROUP_MEMBER_ALREADY_EXIST);
        }
        group?.members?.push(member._id);
        chat.members.push(member._id)
        await group.save();
        await chat.save();

        return {group,chat};
    };

    AddAdmin = async (payload) => {

        const {adminId,groupId} = payload;
        const group = await this.FindGroupById({_id:groupId});
        const user = await this.FindUserById({_id:adminId});
        if(!group){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.GROUP_NOT_FOUND);
        }
        if(!user){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.USER_NOT_FOUND)
        }
        if(group?.admins?.includes(user._id) === true){
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.USER_ALREADY_EXISTS);
        }else if(group.members.includes(user._id)){
            group?.admins?.push(new mongoose.Types.ObjectId(user._id));
        }else if(group.members.includes(user._id) !== true){
            group.members.push(new mongoose.Types.ObjectId(user._id))
        }

        await group.save();
        return group;
    };

    UpdateGroupName = async (payload) => {
        const {groupId,name,userId} = payload;
        const group = await this.FindGroupById({_id:groupId});
        const user = await this.FindUserById({_id:userId});
        if(!group || !user){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.MEMBER_OR_GROUP_NOT_FOUND);
        }
        if(group.settings.editGroupSettings === true){
            group.name = name;
        }else if(group.settings.editGroupSettings === false && group.admins.includes(user._id) === true){
            group.name = name;
        }else {
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.ALLOWED_ADMIN);
        }

        await group.save();
        return group;
    };

    UpdateGroupAvatar = async (payload) => {
        // const {groupAvatar,groupId,userId} = payload;
        // const group = await this.FindGroupById({_id:groupId});
        // if(!group){
        //     throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.GROUP_NOT_FOUND);
        // }
        // group.groupAvatar = groupAvatar;

        // await group.save();
        // return group;
        const {groupId,groupAvatar,userId} = payload;
        const group = await this.FindGroupById({_id:groupId});
        const user = await this.FindUserById({_id:userId});
        if(!group || !user){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.MEMBER_OR_GROUP_NOT_FOUND);
        }
        if(group.settings.editGroupSettings === true){
            group.groupAvatar = groupAvatar;
        }else if(group.settings.editGroupSettings === false && group.admins.includes(user._id) === true){
            group.groupAvatar = groupAvatar;
        }else {
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.ALLOWED_ADMIN);
        }

        await group.save();
        return group;
    };

    UpdateGroupSettings = async (payload) => {
        const {settings,groupId,userId} = payload;
        /** First approch */
        // if(settings.addOtherMembers === undefined || settings.sendMessages === undefined || settings.editGroupSettings === undefined){
        //     throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.MISSING_FIELDS)
        // }
        
        /** Second approch */
        if([settings.addOtherMembers,settings.editGroupSettings,settings.sendMessages].some( (v) => v === undefined)){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.MISSING_FIELDS)
        }
        const group = await this.FindGroupById({_id:groupId});
        const user = await this.FindUserById({_id:userId});
        if(!group || !user){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.MEMBER_OR_GROUP_NOT_FOUND);
        }
        if(group.admins.some( (admin) => admin.toString() === userId.toString()) === true){
            group.settings.addOtherMembers = settings.addOtherMembers;
            group.settings.editGroupSettings = settings.editGroupSettings;
            group.settings.sendMessages = settings.sendMessages;
        }else{
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.ALLOWED_ADMIN);
        }
        // group.settings.addOtherMembers = settings.addOtherMembers;
        // group.settings.editGroupSettings = settings.editGroupSettings;
        // group.settings.sendMessages = settings.sendMessages;
        await group.save();
        return group;
    };

    UpdateGroupDescription = async (payload) => {

        /** old version */
        // const {description,groupId} = payload;
        // const group = await this.FindGroupById({_id:groupId});
        // if(!group){
        //     throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.GROUP_NOT_FOUND);
        // }
        // group.description = description;
        
        // await group.save();
        // return group;

        const {groupId,description,userId} = payload;
        const group = await this.FindGroupById({_id:groupId});
        const user = await this.FindUserById({_id:userId});
        if(!group || !user){
            throw new ApiError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.MEMBER_OR_GROUP_NOT_FOUND);
        }
        if(group.settings.editGroupSettings === true){
            group.description = description;
        }else if(group.settings.editGroupSettings === false && group.admins.includes(user._id) === true){
            group.description = description;
        }else {
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.ALLOWED_ADMIN);
        }

        await group.save();
        return group;
    }; 

    ExistGroupAndDeleteChat = async (payload) => {
        const {groupId,userId} = payload;
        const group = await this.FindGroupById({_id:groupId});
        const chat = await this.FindChatByGroupId({_id:groupId});
        if(!group || !chat){
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.CHAT_AND_GROUP_NOT_FOUND);
        }
        if(!chat.clearedBy) chat.clearedBy = [];
        if(group?.members?.some( (admin) => admin.toString() === userId) === true){
            
            if(group.members.length === 1 && group.admins.length === 1){
                // delete group record
                const deleteGroup = await this.groupModel.findOneAndDelete(new mongoose.Types.ObjectId(groupId));
                const deleteChat = await this.chatModel.findByIdAndDelete(new mongoose.Types.ObjectId(chat._id));
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
            
        }else if(group?.admins?.some( (admin) => admin.toString() === userId) === true){
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
        const {groupId,userId} = payload;
        const group = await this.FindGroupById({_id:groupId});
        const chat = await this.FindChatByGroupId({_id:groupId});
        if(!group || !chat){
            throw new ApiError(STATUS_CODES.UNAUTHORIZED,ERROR_MESSAGES.CHAT_AND_GROUP_NOT_FOUND);
        }
        if(!chat.clearedBy) chat.clearedBy = [];
        if(group.members.some( (member) => member.toString() === userId.toString()) === true){

            if(group.members.length === 1 && group.admins.length === 1){
                // delete group record
                const deleteGroup = await this.groupModel.findOneAndDelete(new mongoose.Types.ObjectId(group._id));
                const deleteChat = await this.chatModel.findByIdAndDelete(new mongoose.Types.ObjectId(chat._id));
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

        }else if(group.admins.some( (admin) => admin.toString() === userId.toString()) === true){
            if(group.members.length === 1 && group.admins.length === 1){
                // delete group record
                const deleteGroup = await this.groupModel.findByIdAndDelete(new mongoose.Types.ObjectId(group._id));
                const deleteChat = await this.chatModel.findByIdAndDelete(new mongoose.Types.ObjectId(chat._id));
                if(!deleteChat || !deleteChat){
                    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR,ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
                }
                return {deleteChat,deleteGroup};
            }else {
                const randomMemberConvertingToOwner = Math.floor(Math.random() * group?.members?.length);
                const removeUserFromAdmin = await this.groupModel.findByIdAndUpdate( new mongoose.Types.ObjectId(group._id),{
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