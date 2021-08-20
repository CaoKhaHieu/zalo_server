import express from 'express'
import {
  checkCodeOtp,
  Demo,
  getNewToken,
  getUser,
  Login,
  Register,
  sendMail,
  UpdatePassword,
} from "../controllers/UserController.js";
import { isAuth } from "../utils/index.js";

const UserRouter = express.Router();

UserRouter.get("/", getUser);
UserRouter.post("/login", Login);
UserRouter.post("/register", Register);

UserRouter.post("/sendmail", sendMail);
UserRouter.post("/checkotp", checkCodeOtp);
UserRouter.post("/updatepassword", UpdatePassword);
UserRouter.post("/getnewtoken", getNewToken);

UserRouter.get("/demo", Demo);

export default UserRouter
