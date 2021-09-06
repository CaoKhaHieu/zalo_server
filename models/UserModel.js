import mongoose from 'mongoose'

const Schema = mongoose.Schema

const FriendSchema = new Schema({
  idUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const UserSchema = new Schema(
  {
    name: String,
    phone: String,
    avatar: String,
    password: String,
    otp: String,
    refeshToken: String,
    cloudinary_id: String,

    friends: [FriendSchema], // ban be cua user
    myRequest: [FriendSchema], // cac yeu cau kb cua user gửi đi
    peopleRequest: [FriendSchema], // các yêu cầu kb tới accout của user
  },
  {
    timestamps: true,
  }
);

export const UsersModel = mongoose.model("User", UserSchema);
export const FriendsModel = mongoose.model("Friend", FriendSchema);