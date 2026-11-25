
import bcrypt from "bcrypt"
import { env } from "../Config/configService"


export const hash=(PlainText:string, saltRounds:number=Number(env.SALT))=>{
  return bcrypt.hash(PlainText, saltRounds)

}
export const compare=(PlainText:string , hashText:string)=>{
  return bcrypt.compare(PlainText,hashText)
}