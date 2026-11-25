
import mongoose from "mongoose";
import { env } from "../Config/configService";

export const DataBaseConnection=()=>{
    mongoose.connect(env.DataBaseURL as string).then(()=>{
        console.log("DataBase Connected")
    }).catch((err)=>{
        console.log(err)
    })
}