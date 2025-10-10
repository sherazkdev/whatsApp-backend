import e from "express";

// Controllers
import statusControllers from "../../Controllers/status.controllers.js";

// Middlewares
import authMiddleware from "../../Middlewares/auth.middleware.js";

// utils
import AsyncHandler from "../../Utils/AsyncHandler.js";

const statusRouter = e.Router();

// // secured routes
statusRouter.route("/upload-status").post(AsyncHandler(authMiddleware.VerifyUserCookies,statusControllers.HandleUpdloadStatus)) /** upload status with media and text file */
statusRouter.route("/view-status").get(AsyncHandler(authMiddleware.VerifyUserCookies,statusControllers.HandleWatchStatus)) /** view by single id to view status */
statusRouter.route("/get-users-status").get(AsyncHandler(authMiddleware.VerifyUserCookies,statusControllers.HandleGetAllStatus)) /** getting all status */
statusRouter.route("/delete-status").delete(AsyncHandler(authMiddleware.VerifyUserCookies,statusControllers.HandleDeleteStatus)) /** delete loggedInUserStatus */
export default statusRouter;