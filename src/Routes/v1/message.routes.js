import e from "express";

// Controllers and utils
import AsyncHandler from "../../Utils/AsyncHandler.js";
import MessageControllers from "../../Controllers/message.controllers.js";

const messageRouter = e.Router();

// secured routes
messageRouter.route("/send-message").post();
messageRouter.route("update-message").patch();
messageRouter.route("delete-message").patch();
messageRouter.route("reply-message").patch();
messageRouter.route("report-message").post();
messageRouter.route("/update-message-seen-status").patch();
messageRouter.route("/delete-user-all-message").delete();
messageRouter.route("/forward-message").post();
messageRouter.route("/send-group-message").post();
messageRouter.route("/pin-message").post();
messageRouter.route("/star-message").patch();
messageRouter.route("/update-message-reaction").patch();
messageRouter.route("/set-message-reaction").post();
messageRouter.route("/typing-status").get();



export default messageRouter;