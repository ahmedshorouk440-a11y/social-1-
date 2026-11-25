
import z from 'zod'


export const SignUpScema={
    body:z.object({
        FullName:z.string(),
        email:z.string().email(),
        password:z.string().min(8),
        confirmPassword:z.string().min(6).optional(),

    }).superRefine((data, ctx)=>{
       if(data.password != data.confirmPassword){
        ctx.addIssue({
            code:"custom",
            message:'Password and Confirm Password Does not Match'
        })
       } 
    })
    
}
export const LoginSchema={
    body:z.object({
        email:z.string().email(),
        password:z.string().min(8)
    })
}