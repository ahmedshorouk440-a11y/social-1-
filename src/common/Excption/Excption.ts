
 export class ApplicationExcption extends Error {
    constructor(
        message: string,
        public status: number,
        cause?: unknown
    ) {
        super(message, { cause });
        this.name = this.constructor.name;
    }
}

export class BadRequestExcption extends ApplicationExcption {
    constructor(message = "Bad Request", cause?: unknown) {
        super(message, 400, cause);
    }
}
export class NotFoundExcption extends ApplicationExcption{
    constructor(message ="Not Found" , cause?:unknown) {
        super(message , 404 , cause)
    }
}
export class ConflictExcption extends ApplicationExcption{
constructor(message = "Conflict" , cause?:unknown){
    super(message , 409 , cause)
}}
export class UnauthrizedExption extends ApplicationExcption{
    constructor(message = "UnAuthrized" , cause?:unknown){
        super(message , 401 , cause)
    }
}


