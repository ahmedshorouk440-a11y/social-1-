
import type { Request, Response, NextFunction } from "express";
import { IError } from "../common/Interface/Error.interface";



export const handlerError = (
    err: IError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
      console.log(JSON.stringify(err.cause, null, 2));

    const status = err.cause?.status || err.statusCode || err.status || 500;

    res.status(status).json({
        error: status === 500 ? "Internal server error" : err.message,
    });
};