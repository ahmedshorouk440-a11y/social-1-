import express from 'express'
import { IResponce } from '../Interface/responce.interface'
export const SuccessResponce=({res , message="Done" , status= 200 , data}:IResponce)=>{
  res.status(status).json({message , data})
}