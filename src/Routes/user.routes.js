import e from "express";
import AsyncHandler from "../Utils/AsyncHandler.js";

const userRoute = e.Router();

// Middlewares
import authMiddleware from "../Middlewares/auth.middleware.js";

// Controllers
import userController from "../Controllers/user.controllers.js";

// Secured Routes
userRoute.route("/signIn-send-otp").post(AsyncHandler(userController.HandleSendOtpForLogin)); /** after fill number || email and user sending otp on email optional*/
userRoute.route("/signUp-send-otp").post(AsyncHandler(userController.HandleSendOtpForRegisteration)); /** after fill number || email and user sending otp on email optional*/
userRoute.route("/resend-otp:otp").get(AsyncHandler(userController.HandleResendOtp)); /** after 60 mint to resend otp again */
userRoute.route("/sign-in").post(AsyncHandler(userController.HandleLoginUser)); /** sign in user */
userRoute.route("/sign-up").patch(AsyncHandler(userController.HandleRegisterUser)); /** sign up user */
userRoute.route("/update-user-avatar").patch(AsyncHandler(authMiddleware.VerifyUserCookies,userController.HandleUpdateUserAvatar)); /** update user avatar */
userRoute.route("/update-user-coverImage").patch(AsyncHandler(authMiddleware.VerifyUserCookies,userController.HandleUpdateUserCoverImage)); /** update user coverImage */
userRoute.route("/update-user-about").patch(AsyncHandler(authMiddleware.VerifyUserCookies,userController.HandleUpdateUserCoverImage)); /** update user about */
userRoute.route("/update-user-fullname").patch(AsyncHandler(authMiddleware.VerifyUserCookies,userController.HandleUpdateUserFullname)); /** update user fullname */
userRoute.route("/block-user-toggle").patch(AsyncHandler(authMiddleware.VerifyUserCookies,userController.HandleBlockUser)); /** block anyone user */
userRoute.route("/logout-user").patch(AsyncHandler(authMiddleware.VerifyUserCookies,userController.HandleLogoutUser)); /** logged in user for logout user options */ 
userRoute.route("/search-user").get(AsyncHandler(authMiddleware.VerifyUserCookies,userController.HandleSearchUser)); /** search user phone number email or username */
userRoute.route("/user-profile/:profileId").get(authMiddleware.VerifyUserCookies,AsyncHandler(userController.HandleGetUserProfile)); /** for user profile to get all information  */
userRoute.route("/all-users").get(AsyncHandler(authMiddleware.VerifyUserCookies,userController.HandleGetAllUsers)); /** For admin Access all users */
userRoute.route("/all-blocked-users").get(authMiddleware.VerifyUserCookies,AsyncHandler(userController.HandleGetAllBlockedUsers));
export default userRoute;