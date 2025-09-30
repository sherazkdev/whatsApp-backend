import app from "./app.js";
import DotEnv from "dotenv";
import MongooseConnection from "./Connections/connetion.js";

// Envorments Variables Configration
DotEnv.config({
    path : ".env",

});

const Port = process.env.PORT || Math.floor( Math.random() * (20 * 59 / 5 ) * 10);

// Mongoose Connection
MongooseConnection.connect().then( (connectionInstance) => {
    app.listen(Port,() => console.log(` Server at running this port http://localhost:${Port}`));
} ).catch( (connectionError) => new Error(connectionError));
