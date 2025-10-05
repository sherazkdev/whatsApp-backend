import e from "express";

// Middlewares
import authMiddleware from "../../Middlewares/auth.middleware.js";

// controllers utils
import chatControllers from "../../Controllers/chat.controllers.js";
import AsyncHandler from "../../Utils/AsyncHandler.js";

const chatRouter = e.Router();

// secured routes
chatRouter.route("/create-chat").post(AsyncHandler(authMiddleware.VerifyUserCookies,chatControllers.HandleCreateChat))

export default chatRouter;