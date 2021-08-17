import jwt from 'jsonwebtoken'

export const generateToken = (user) => {
    return jwt.sign({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        password: user.password, 
    },
    process.env.TOKEN_SECRET || "caokhahieu",
    {
        expiresIn: '30d',
    })
}