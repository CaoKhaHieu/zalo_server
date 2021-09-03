import express from 'express'
import {
  acceptFriend,
  changeAvatar,
  checkCodeOtp,
  Demo,
  getNewToken,
  getUser,
  getUserById,
  Login,
  Register,
  searchUser,
  sendMail,
  UpdatePassword,
} from "../controllers/UserController.js";
import { isAuth } from "../utils/index.js";
import { upload } from "../utils/uploadImage.js";

const UserRouter = express.Router();

UserRouter.get("/", getUser);
UserRouter.get("/:id", getUserById);
UserRouter.post("/login", Login);
UserRouter.post("/register", Register);

UserRouter.post("/sendmail", sendMail);
UserRouter.post("/checkotp", checkCodeOtp);
UserRouter.post("/updatepassword", UpdatePassword);
UserRouter.post("/getnewtoken", getNewToken);

UserRouter.post("/avatar", isAuth, upload.single("image"), changeAvatar);
UserRouter.post("/search", searchUser);
UserRouter.post("/acceptfriend", isAuth, acceptFriend);

UserRouter.get("/demo", Demo);

export default UserRouter
