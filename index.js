import express from 'express'
import cors from 'cors'
import UserRouter from './routers/UserRouter.js'
import ConnectToDB from './config/DB.js'

ConnectToDB()
const app = express()
const PORT = 5000


app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use('/user', UserRouter)

app.listen(PORT, () => {
    console.log(`app run on port ${PORT}`)
})