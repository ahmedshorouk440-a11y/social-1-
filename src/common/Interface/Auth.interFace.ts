export type Role = "admin" | "user"
export interface IAuth{
    FullName:string,
    email:string,
    password:string,
    isVerfied?:boolean,
    phone?:string,
    age?:number,
     role?: Role,
     bio?: string,
      profileImage?:string | undefined,
      provider?:string,
       confirmEmail?:Date,
       isPrivate?: boolean;
      
}