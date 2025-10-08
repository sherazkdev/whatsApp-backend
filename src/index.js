import app from "./app.js";
import DotEnv from "dotenv";
import MongooseConnection from "./Connections/connetion.js";
import http from "http";
import { Server } from "socket.io";

// Socket-io
import SocketHandler from "./Sockets/index.js";

// Envorments Variables Configration
DotEnv.config({
    path : ".env",

});

const Port = process.env.PORT || Math.floor( Math.random() * (20 * 59 / 5 ) * 10);

// Mongoose Connection
MongooseConnection.connect().then( (connectionInstance) => {
    const server = http.createServer(app);
    const io = new Server(server,{
        cors:{
            origin:"*"
        }
    });
    io.on("connection",(socket) => {
        console.log(socket)
    })
    server.listen(Port,() => console.log(` Server at running this port http://localhost:${Port}`));
    
} ).catch( (connectionError) => new Error(connectionError));
