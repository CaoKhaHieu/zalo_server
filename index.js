import express from 'express'
import cors from 'cors'
import UserRouter from './routers/UserRouter.js'
import ConnectToDB from './config/DB.js'
import dotenv from 'dotenv'
import { createServer } from "http";
import { ConnectSocket } from "./config/Socket.js";

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = 5000;

ConnectSocket(server);
ConnectToDB();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/user", UserRouter);

server.listen(PORT, () => {
  console.log(`app run on port ${PORT}`);
});