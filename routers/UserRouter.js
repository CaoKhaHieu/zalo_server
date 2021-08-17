import express from 'express'
import { checkCodeOtp, getUser, Login, Register, sendMail, UpdatePassword } from '../controllers/UserController.js'

const UserRouter = express.Router()

UserRouter.get('/', getUser)
UserRouter.post('/login', Login)
UserRouter.post('/register', Register)

UserRouter.post('/sendmail', sendMail)
UserRouter.post('/checkotp', checkCodeOtp)
UserRouter.post('/updatepassword', UpdatePassword)

export default UserRouter
