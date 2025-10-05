import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./Middlewares/errorHandler.middleware.js";

// Routes Importing
import userRoutes from "./Routes/v1/user.routes.js";
import messageRouter from "./Routes/v1/message.routes.js";
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


// error handler
app.use(errorHandler);

export default app;
