import mongoose from 'mongoose'

const Schema = mongoose.Schema

const Friend = new Schema({
  _id: String,
  name: String,
  avatar: String,
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

    friends: [Friend], // ban be cua user
    myRequest: [Friend], // cac yeu cau kb cua user gửi đi
    peopleRequest: [Friend], // các yêu cầu kb tới accout của user
  },
  {
    timestamps: true,
  }
);

export const UsersModel = mongoose.model('User', UserSchema)