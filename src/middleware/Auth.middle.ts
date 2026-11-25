
import jwt, { JwtPayload } from 'jsonwebtoken'
import { env } from '../common/Config/configService'

import type { NextFunction, Request, Response } from "express"
import { BadRequestExcption, UnauthrizedExption } from '../common/Excption/Excption'
import { IAuth } from '../common/Interface/Auth.interFace'
import { IReq } from '../common/Interface/Request.InterFace'






type Audience = "admin" | "user"


const signature : Record<Audience , string>={
    admin:env.ADMINSIGNATUR ,
    user:env.USERSIGNATUR
}
export const auth = async(req:IReq , res:Response , next:NextFunction)=>{
    try{
    const header = req.headers.authorization
    if(!header){
        throw new BadRequestExcption("Token Not Found")
    }
    const [flag , token] = header.split(" ")
    if(flag !== "Bearer" || !token){
        throw new BadRequestExcption("Invalid Authorization")
    }
    const decoded = jwt.decode(token) as JwtPayload | null
if (!decoded) throw new UnauthrizedExption("Invalid token")

const audience = decoded.aud as Audience
const signatures = signature[audience]           
if (!signatures) throw new BadRequestExcption("Invalid Audience")

const verified = jwt.verify(token, signatures, { audience }) as JwtPayload
  req.userId = verified.id
next()
    }catch(error){
        next(error)
     
    }
}