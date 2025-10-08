import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./Middlewares/errorHandler.middleware.js";

// Routes Importing
import userRoutes from "./Routes/v1/user.routes.js";
import messageRouter from "./Routes/v1/message.routes.js";
import statusRouter from "./Routes/v1/status.routes.js";
import groupRouter from "./Routes/v1/group.routes.js";
import channelRouter from "./Routes/v1/channel.routes.js";
import chatRouter from "./Routes/v1/chat.routes.js";

// App
const app = e();

// Middlewares
app.use(e.urlencoded({extended:true}));
app.use(cookieParser());
app.use(e.json());
app.use(cors({
    origin : process.env.CORS_ORIGIN || "*",
    methods : ["GET","POST","PUT","PATCH","DELETE"]
}));

// Routes
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/messages",messageRouter);
app.use("/api/v1/chats",chatRouter);
app.use("/api/v1/status",statusRouter);
app.use("/api/v1/groups",groupRouter);
app.use("/api/v1/channels",channelRouter);


// error handler
app.use(errorHandler);

export default app;
