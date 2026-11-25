
import {  Router } from "express";
import type{Request , Response ,NextFunction } from "express"
import followService from './Follow.service'
import { SuccessResponce } from "../../common/Responce/Responce";
import { auth } from "../../middleware/Auth.middle";
import { BadRequestExcption, UnauthrizedExption } from "../../common/Excption/Excption";
import { IReq } from "../../common/Interface/Request.InterFace";
const router:Router = Router()



router.post("/:id/follow" , auth,async(req:IReq, res:Response, next:NextFunction)=>{
    try{
       if (!req.userId) throw new UnauthrizedExption('Unauthorized');
      const data = await followService.follow(req.userId, req.params.id as string);
      SuccessResponce({res, data ,message:"Done" })
    }catch(error){
        console.log(error)
   next(error)
    }
})
router.delete("/:id/unfollow" , auth , async(req:IReq, res:Response , next:NextFunction)=>{
    try{
        console.log("unfollow route hit", req.userId, req.params.id);

          if(!req.userId) throw new UnauthrizedExption('Unauthorized')
        let data = await followService.unfollow(req.userId , req.params.id as string)
        SuccessResponce({res, data , message:"Done"})
    }catch(error){
       
       next(error)
    }
})

router.get("/:id/followers" , auth , async(req:Request, res:Response, next:NextFunction)=>{
    try{
       let data = await followService.getFollowers(req.params.id as string)
       SuccessResponce({res , data , message:"Done"})
    }catch(error){
     next(error)
    }
})
router.get("/:id/following" , auth , async(req:Request, res:Response, next:NextFunction )=>{
    try{
    let data = await followService.getFollowing(req.params.id as string)
    SuccessResponce({res , data , message:"Done"})
    }catch(error){
     next(error)
    } 
})



export default router