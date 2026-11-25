
import { response, Router } from "express";
import type { NextFunction, Request , Response } from "express";
import  authService from "./Authanction.service";
import { validation } from "../../common/Services/validation.services";
import { LoginSchema, SignUpScema } from "./Authanction.validation";
import { SuccessResponce } from "../../common/Responce/Responce";
import { auth } from "../../middleware/Auth.middle";
import { BadRequestExcption, UnauthrizedExption } from "../../common/Excption/Excption";
import { IReq } from "../../common/Interface/Request.InterFace";
  
const router:Router = Router()

router.get("/" ,(req:Request, res:Response)=>{
    res.json('Auth is Running Successfully')
})
router.post("/Register" , validation(SignUpScema) ,async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
    try{

    
  let data =await authService.register(req.body)
 
  res.json({message :"done", data})
    }catch(error){
      next(error)
     
    }
})
router.post("/Login" , validation(LoginSchema) , async(req:Request , res:Response )=>{
  let data = await authService.login(req.body)
  res.json({message:"Done" , data})
})
router.get("/GetUserById" ,auth  , async(req:IReq, res:Response, next:NextFunction)=>{
  try{
     if(!req.userId) throw new BadRequestExcption('Unauthorized')
   let data = await authService.GetUserById(req.userId)
   SuccessResponce({res , data , message: "User registered successfully" , status:201})
  }catch(error){
    next(error)
  }

})

router.post("/Generate-Access-Token" , async(req:Request , res:Response, next:NextFunction)=>{
  try{
    let data = await authService.generateAccessToken(req.body)
    SuccessResponce({res , data , message:"Done"})
  }catch(error){
    next(error)
  }
})


router.get("/MyProfile" , auth, async(req:IReq, res:Response, next:NextFunction)=>{
try{
  if(!req.userId) throw new BadRequestExcption("Unauthorized")
   let data = await authService.GetMyProfile(req.userId)
  SuccessResponce({res , data , message:"Done"})
}catch(error){
   next(error)
}
})


router.patch("/Update-my-profile/:id", auth , async(req:IReq, res:Response, next:NextFunction)=>{
  try{
    if(!req.userId) throw new BadRequestExcption("Unauthorized")
    let data = await authService.updateMyProfile(req.userId , req.body)
  SuccessResponce({res , data , message:"Done"})
  }catch(error){
     next(error)
  }
})

router.get("/Search" , auth , async(req:IReq, res:Response, next:NextFunction)=>{
  try{
     if(!req.userId) throw new UnauthrizedExption("Unauthorized")
    let data = await authService.searchUsers(req.userId , req.query.q as string)
    SuccessResponce({res , data , message:"Done"})
  }catch(error){
   next(error)
  }
})

router.get("/suggestions" , auth , async(req:IReq, res:Response,next:NextFunction )=>{
  try{
    if(!req.userId) throw new BadRequestExcption("Unauthorized")
    let data = await authService.Suggestions(req.userId)
    SuccessResponce({res, data , message:"Done"})
  }catch(error){
    next(error)
  }

})


router.patch("/UpdatePrivacy" , auth , async(req:IReq , res:Response , next:NextFunction)=>{
  try{
    if(!req.userId) throw new BadRequestExcption("Unauthorized")
     let data = await authService.updatePrivacy(req.userId ,  req.body.isPrivate)
     SuccessResponce({res , data , message:"Done"})

  }catch(error){
   next(error)
  }
})

router.get("/varify-account" ,async(req:Request, res:Response, next:NextFunction)=>{
  try{
    let data = await authService.varfy(req.query)
     SuccessResponce({res, data , message:"account varifed"})
  }catch(error){
     next(error)
  }
})
router.post("/Request-Forget-Password" , async(req:Request, res:Response, next:NextFunction)=>{
  try{
    const {email} = req.body
  let data = await authService.RequestForgetPassword(email)
  SuccessResponce({res , data , message:"Done"})
  }catch(error){
   
     next(error)
  }
})

router.post("/Verify-confirm-password" , async(req:Request, res:Response, next:NextFunction)=>{
  try{
   
    let {otp , email} = req.body
    let data = await authService.VerifyConfirmPassword(otp , email)
     SuccessResponce({res , data , message:"Done"})
  }catch(error){
    next(error)
  }
})
router.post("/ResitPassword" , async(req:Request, res:Response, next:NextFunction)=>{
  try{
    let {otp , email , newPassword} = req.body
    let data = await authService.ResitPassword(otp , email , newPassword)
    SuccessResponce({res, data , message:"Done"})

  }catch(error){
    next(error)
  }
})
router.post("/auth/google" , async(req:Request, res:Response, next:NextFunction)=>{
  try{
   let data = await authService.LoginWithGoogle(req.body.idToken)
   SuccessResponce({res, data , message:"Done"})
  }catch(error){
    console.log(error)
    next(error)
  }
})

export default router