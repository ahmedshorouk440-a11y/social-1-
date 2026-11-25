
import dotenv from "dotenv"
import path from "path"

dotenv.config({path:path.resolve(`./.env.${process.env.NODE_ENV}`)})
const port = process.env.PORT
const DataBaseURL = process.env.DATABASE_URL
const REDIS_URL = process.env.REDIS_URL as string
const SALT = process.env.SALT 

const ADMINSIGNATUR  = process.env.ADMINSIGNATUR as string
const USERSIGNATUR = process.env.USERSIGNATUR as string
const  ADMINREFRESHSIGNATURE = process.env.ADMINREFRESHSIGNATURE as string
const  USERREFRESHSIGNATURE = process.env.USERREFRESHSIGNATURE as string
const App_Password = process.env.App_Password as string
const APP_EMAIL = process.env.APP_EMAIL as string
const WEB_CLIENT_ID = process.env.WEB_CLIENT_ID as string

export const env={
    port,
    DataBaseURL,
    REDIS_URL,
    SALT,
ADMINSIGNATUR,
  USERSIGNATUR,
  ADMINREFRESHSIGNATURE,
  USERREFRESHSIGNATURE,
  App_Password,
  APP_EMAIL,
  WEB_CLIENT_ID


    
}