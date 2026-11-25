
import express from "express"
import ApiRouter from './module/index'
import { handlerError } from "./middleware/GlobalError"
import { SuccessResponce } from "./common/Responce/Responce"
import cors from 'cors'
import {rateLimit} from 'express-rate-limit'
import { env } from "./common/Config/configService"
import { DataBaseConnection } from "./common/DataBase/Connection"
import { redisServices } from "./common/Services/Redis.service"


const app = express()
const Limit =rateLimit({
    windowMs:10*60*1000,
    limit:200,
    message:"Too Many Request"

})
DataBaseConnection()
redisServices.connect()

app.use(express.json())
app.use(cors({ origin: "http://localhost:5173"}))  
app.use(ApiRouter)
app.get("/get", async (req, res, next) => {
    try {
      
        SuccessResponce({res , message:"Server is Running" , data:"test"})
    } catch (err) {
        next(err);
    }
});
app.use(handlerError)
app.listen(env.port , ()=>{
  console.log(`server is running on port ${env.port}`)
})