import { UsersModel } from "../models/UserModel.js"
import expressAsyncHandler from 'express-async-handler'
import { generateToken } from "../utils/index.js"
import nodemailer from 'nodemailer'
import { mailer } from "../utils/mailer.js"

export const getUser = async (req, res) => {
    const users = await UsersModel.find()
    res.send(users)
}

export const Login = async (req, res) => {
    const user = await UsersModel.findOne(req.body)
    if(user){
        res.send({
            _id: user._id,
            name: user.name,
            phone: user.phone,
            password: user.password,
            otp: user.otp || null,
            token: generateToken(user),
        })
    }else{
        res.status(403).send({message: 'Số điện thoại hoặc mật khẩu không đúng'})
    }
}

export const Register = async (req, res) => {
    const userExists = await UsersModel.findOne({phone: req.body.phone})
    if(userExists){
        res.status(400).send({message: 'Số điện thoại này đã đăng kí tài khoản'})
    }else{
        const user = new UsersModel(req.body)
        await user.save()
        res.status(200).send({
            _id: user._id,
            name: user.name,
            password: user.password,
            phone: user.phone,
            otp: '',
            token: generateToken(user)
        })
    }
}

export const UpdatePassword = async (req, res) => {
    const userExist = await UsersModel.findOne({phone: req.body.email})
    if(userExist){
        userExist.password = req.body.password
        await userExist.save()
        res.send({message: 'Cập nhật mật khẩu thành công'})
    }else{
        res.status(403).send({message: 'Email này chưa đăng kí tài khoản'})
    }
}

function countDownOtp(time, user) {
    setTimeout(() => {
        user.otp = ''
        user.save()
    }, time)
}

export const sendMail = async (req, res) => {
    try {
      const { email } = req.body
      const otp = Math.floor(100000 + Math.random() * 900000)

      const userExist = await UsersModel.findOne({phone: email})
      if(userExist){
        countDownOtp(60000, userExist)
        userExist.otp = String(otp)
        await userExist.save()
        await mailer(String(email), 'GET CODE OTP', `<b>Your code is: ${otp}</b>`)
        res.send({message: 'send code to your email'})
      }else{
        res.status(403).send({message: 'Email này chưa đăng kí tài khoản'})
      }
    } catch (error) {
      console.log(error)
      res.status(403).send({message: 'Không gửi được'})
    }
}


export const checkCodeOtp = async (req, res) => {
    console.log(req.body)
    const userExist = await UsersModel.findOne({phone: req.body.email})
    if(userExist){
        if(req.body.otp === userExist.otp){
            res.send({message: 'OTp đã đúng'})
        }
        else{
            res.status(403).send({message: 'OTP không đúng'})
        }
    }else{
        res.status(403).send({message: 'Email này chưa đăng kí tài khoản'})
    }
}