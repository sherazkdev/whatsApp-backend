import e from "express";

// Middlewares
import authMiddleware from "../../Middlewares/auth.middleware.js";

// controllers utils
import groupControllers from "../../Controllers/group.controllers.js";
import AsyncHandler from "../../Utils/AsyncHandler.js";

const groupRouter = e.Router();

// // secured routes
groupRouter.route("/create-group").post(AsyncHandler(authMiddleware.VerifyUserCookies,groupControllers.HandleCreateGroup)) /** creating group for conversation */
groupRouter.route("/add-admin").patch(AsyncHandler(authMiddleware.VerifyUserCookies,groupControllers.HandleAddAdmin)) /** add new admin */
groupRouter.route("/add-member").patch(AsyncHandler(authMiddleware.VerifyUserCookies,groupControllers.HandleAddMember)) /** add new member */
groupRouter.route("/exit-group-clear-chat").delete(AsyncHandler(authMiddleware.VerifyUserCookies,groupControllers.HandleExistGroupAndDeleteChat)) /** exit group and delete chat historty */
groupRouter.route("/exit-group").patch(AsyncHandler(authMiddleware.VerifyUserCookies,groupControllers.HandleExitGroup)) /** exit group */
groupRouter.route("/remove-member").patch(AsyncHandler(authMiddleware.VerifyUserCookies,groupControllers.HandleRemoveMember)) /** remove any member allow for admin */
groupRouter.route("/update-group-name").patch(AsyncHandler(authMiddleware.VerifyUserCookies,groupControllers.HandleUpdateGroupName)) /** update group name */
groupRouter.route("/update-group-settings").patch(AsyncHandler(authMiddleware.VerifyUserCookies,groupControllers.HandleUpdateGroupSettings)) /** update group settings */
groupRouter.route("/update-group-description").patch(AsyncHandler(authMiddleware.VerifyUserCookies,groupControllers.HandleUpdateGroupDescription)) /** update group description */
groupRouter.route("/update-group-avatar").patch(AsyncHandler(authMiddleware.VerifyUserCookies,groupControllers.HandleUpdateGroupAvatar)) /** update group avatar */

export default groupRouter;