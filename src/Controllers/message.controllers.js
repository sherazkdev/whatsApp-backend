import { STATUS_CODES,ERROR_MESSAGES,SUCCESS_MESSAGES } from "../Constants/responseConstants.js";

// Services
import MessageServices from "../Services/message.services.js";


class MessageControllers extends MessageServices {
    constructor(){
        super();
    }

    // for message sending
    HandleSendMessage = async (req,res) => {};
    HandleUpdateMessage = async (req,res) => {};
    HandleDeleteMessage = async (req,res) => {};
    HandleReplyMessage = async (req,res) => {};
    HandleReportMessage = async (req,res) => {};
    HandleDeleteUserMessages = async (req,res) => {};
    HandleForwardMessage = async (req,res) => {};
    HandleUpdateMessageSeenStatus = async (req,res) => {};
    HandleSendGroupMessage = async (req,res) => {};
    HandleSendStatusMessage = async (req,res) => {};
    HandleTypingIndicater = async (req,res) => {};
    HandleGetUserMessages = async (req,res) => {};
    Handle = async (req,res) => {};
    HandleUpdateMessage = async (req,res) => {};
    HandleUpdateMessage = async (req,res) => {};
    HandleUpdateMessage = async (req,res) => {};
    HandleUpdateMessage = async (req,res) => {};
    HandleUpdateMessage = async (req,res) => {};
    HandleUpdateMessage = async (req,res) => {};
    HandleUpdateMessage = async (req,res) => {};
    HandleUpdateMessage = async (req,res) => {};
    HandleUpdateMessage = async (req,res) => {};
    HandleUpdateMessage = async (req,res) => {};
}

export default new MessageControllers;