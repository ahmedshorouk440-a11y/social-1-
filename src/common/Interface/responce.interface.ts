import express from "express"
export interface IResponce{
    res:express.Response,
    message:string,
    data?:any,
    status?:number

}