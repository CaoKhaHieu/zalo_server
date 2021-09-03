import { UsersModel } from "../models/UserModel.js";
import { generateToken } from "../utils/index.js";
import { mailer } from "../utils/mailer.js";
import cloudinary from "cloudinary";

export const getUser = async (req, res) => {
  const users = await UsersModel.find();
  res.send(users);
};

export const getUserById = async (req, res) => {
  const user = await UsersModel.findById(req.params.id);
  if (user) {
    res.send(user);
  } else {
    res.status(403).send({ message: "user not found" });
  }
};

export const updateRefeshToken = (user, refeshToken) => {
  user.refeshToken = refeshToken;
  user.save();
};

export const Login = async (req, res) => {
  const user = await UsersModel.findOne(req.body);
  if (user) {
    const tokens = generateToken(user);
    updateRefeshToken(user, tokens.refeshToken);

    res.send({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      password: user.password,
      otp: user.otp || null,
      token: tokens.accessToken,
      refeshToken: tokens.refeshToken,
    });
  } else {
    res.status(403).send({ message: "Số điện thoại hoặc mật khẩu không đúng" });
  }
};

export const Register = async (req, res) => {
  const userExists = await UsersModel.findOne({ phone: req.body.phone });
  if (userExists) {
    res.status(400).send({ message: "Số điện thoại này đã đăng kí tài khoản" });
  } else {
    const user = new UsersModel(req.body);
    user.avatar =
      "https://res.cloudinary.com/caokhahieu/image/upload/v1630225166/zalo/anonymous_bujoil.jpg";
    await user.save();

    const refeshToken = generateToken(user).refeshToken;
    updateRefeshToken(user, refeshToken);

    res.status(200).send({
      _id: user._id,
      name: user.name,
      password: user.password,
      phone: user.phone,
      otp: "",
    });
  }
};

export const getNewToken = async (req, res) => {
  const refeshToken = req.body;
  const userExists = await UsersModel.findOne(refeshToken);
  if (userExists) {
    const tokens = generateToken(userExists);
    updateRefeshToken(userExists, tokens.refeshToken);
    res.send(tokens);
  } else {
    res.status(403).send({ message: "no refesh token" });
  }
};

export const UpdatePassword = async (req, res) => {
  const userExist = await UsersModel.findOne({ phone: req.body.email });
  if (userExist) {
    userExist.password = req.body.password;
    await userExist.save();
    res.send({ message: "Cập nhật mật khẩu thành công" });
  } else {
    res.status(403).send({ message: "Email này chưa đăng kí tài khoản" });
  }
};

function countDownOtp(time, user) {
  setTimeout(() => {
    user.otp = "";
    user.save();
  }, time);
}

export const sendMail = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    const userExist = await UsersModel.findOne({ phone: email });
    if (userExist) {
      countDownOtp(60000, userExist);
      userExist.otp = String(otp);
      await userExist.save();
      await mailer(
        String(email),
        "GET CODE OTP",
        `<b>Your code is: ${otp}</b>`
      );
      res.send({ message: "send code to your email" });
    } else {
      res.status(403).send({ message: "Email này chưa đăng kí tài khoản" });
    }
  } catch (error) {
    console.log(error);
    res.status(403).send({ message: "Không gửi được" });
  }
};

export const checkCodeOtp = async (req, res) => {
  console.log(req.body);
  const userExist = await UsersModel.findOne({ phone: req.body.email });
  if (userExist) {
    if (req.body.otp === userExist.otp) {
      res.send({ message: "OTp đã đúng" });
    } else {
      res.status(403).send({ message: "OTP không đúng" });
    }
  } else {
    res.status(403).send({ message: "Email này chưa đăng kí tài khoản" });
  }
};

export const changeAvatar = async (req, res) => {
  const userExist = await UsersModel.findById(req.body._id);
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "zalo",
  });

  if (userExist) {
    userExist.avatar = result.secure_url;
    userExist.cloulinary_id = result?.public_id || userExist.cloudinary_id;
    await userExist.save();
    res.send(userExist);
  } else {
    res.status(403).send({ mesage: "user not found" });
  }
  cloudinary.uploader.destroy(userExist.cloudinary_id);
};

export const searchUser = async (req, res) => {
  const user = await UsersModel.findOne({ phone: req.body.phone });
  if (user) {
    res.send(user);
  } else {
    res.status(403).send({ message: "Số điện thoại hoặc email không đúng" });
  }
};

export const addFriend = async (userFrom, userTo) => {
  const userToAccount = await UsersModel.findById(userTo._id);
  const userFromAccount = await UsersModel.findById(userFrom._id);

  if (userToAccount && userFromAccount) {
    userToAccount.peopleRequest.push(userFrom);
    userFromAccount.myRequest.push(userTo);

    await userToAccount.save();
    await userFromAccount.save();
  }
};

export const deleteRequestFriend = async (userFrom, userTo) => {
  const userToAccount = await UsersModel.findById(userTo._id);
  const userFromAccount = await UsersModel.findById(userFrom._id);

  if (userToAccount && userFromAccount) {
    userToAccount.peopleRequest = userToAccount.peopleRequest.filter(
      (x) => x._id !== userFrom._id
    );
    userFromAccount.myRequest = userFromAccount.myRequest.filter(
      (x) => x._id !== userTo._id
    );

    await userToAccount.save();
    await userFromAccount.save();
  }
};

export const acceptFriend = async (req, res) => {
  const user = await UsersModel.findOne({ _id: req.user._id });
  const userSender = await UsersModel.findOne({ _id: req.body._id });

  if (user) {
    const friend = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
    };

    user.peopleRequest = user.peopleRequest.filter(
      (x) => x._id !== req.body._id
    );
    user.friends.push(req.body);

    userSender.myRequest = userSender.myRequest.filter(
      (x) => x._id !== req.user._id
    );
    userSender.friends.push(friend);

    await user.save();
    await userSender.save();
    res.send(user);
  } else {
    res.status(403).send({ message: "user not found" });
  }
};

export const Demo = (req, res) => {
  res.send("dnsahbc");
};
