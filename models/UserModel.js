import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: String,
    phone: String,
    password: String,
    otp: String,
    refeshToken: String,
},{
    timestamps: true
})

export const UsersModel = mongoose.model('User', UserSchema)