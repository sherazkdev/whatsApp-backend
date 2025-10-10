import e from "express";

// Middlewares
import authMiddleware from "../../Middlewares/auth.middleware.js";

// controllers utils
import chatControllers from "../../Controllers/chat.controllers.js";
import AsyncHandler from "../../Utils/AsyncHandler.js";

const chatRouter = e.Router();

// secured routes
chatRouter.route("/create-chat").post(AsyncHandler(authMiddleware.VerifyUserCookies,chatControllers.HandleCreateChat)) /** creating chat for conversation */
chatRouter.route("/delete-chat/:chatId").patch(AsyncHandler(authMiddleware.VerifyUserCookies,chatControllers.HandleDeleteChat)) /** Delete chat  */
chatRouter.route("/chats").get(AsyncHandler(authMiddleware.VerifyUserCookies,chatControllers.HandleGetUserChats)) /** user chat history  */

export default chatRouter;  