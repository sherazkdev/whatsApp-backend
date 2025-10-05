import e from "express";

// Controllers and utils
import AsyncHandler from "../../Utils/AsyncHandler.js";
import MessageControllers from "../../Controllers/message.controllers.js";

// Middlewares
import authMiddleware from "../../Middlewares/auth.middleware.js";

const messageRouter = e.Router();

// secured routes
messageRouter.route("/send-message").post(AsyncHandler(authMiddleware.VerifyUserCookies,MessageControllers.HandleSendMessage));
messageRouter.route("/update-message").patch(AsyncHandler(authMiddleware.VerifyUserCookies,MessageControllers.HandleUpdateMessage));
messageRouter.route("/delete-message").patch(AsyncHandler(authMiddleware.VerifyUserCookies,MessageControllers.HandleDeleteMessage));
messageRouter.route("/reply-message").patch(AsyncHandler(authMiddleware.VerifyUserCookies,MessageControllers.HandleReplyMessage));
// messageRouter.route("report-message").post();
messageRouter.route("/update-message-seen-status").patch(AsyncHandler(authMiddleware.VerifyUserCookies,MessageControllers.HandleUpdateMessageSeenStatus));
messageRouter.route("/delete-user-all-message").delete(AsyncHandler(authMiddleware.VerifyUserCookies,MessageControllers.HandleDeleteUserMessages));
messageRouter.route("/forward-message").post(AsyncHandler(authMiddleware.VerifyUserCookies,MessageControllers.HandleForwardMessage));
messageRouter.route("/send-group-message").post(AsyncHandler(authMiddleware.VerifyUserCookies,MessageControllers.HandleSendMessage));
// messageRouter.route("/pin-message").post();
// messageRouter.route("/star-message").patch();
// messageRouter.route("/update-message-reaction").patch();
// messageRouter.route("/set-message-reaction").post();
// messageRouter.route("/typing-status").get();



export default messageRouter;