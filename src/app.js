import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./Middlewares/errorHandler.middleware.js";

// Routes Importing
import userRoutes from "./Routes/user.routes.js";

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


// error handler
app.use(errorHandler);

export default app;
