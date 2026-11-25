
import mongoose from "mongoose";
import { IAuth } from "../common/Interface/Auth.interFace";



const AuthScema = new mongoose.Schema<IAuth>({
    FullName:{
    type:String,
     required:true

    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }, phone:{
        type:String,
     
    },
     profileImage:{
      type:String
    },
    isVerfied:{
   type:Boolean,
    default:false
    },
    age:{
        type:Number,
     }
     ,
     bio: { type: String, maxlength: 150 },
     isPrivate: { type: Boolean, default: false },
     
    role: { type: String,
     enum: ["admin", "user"],
      default: "user" },
      
})
export const AuthModel = mongoose.model<IAuth>('user' , AuthScema)