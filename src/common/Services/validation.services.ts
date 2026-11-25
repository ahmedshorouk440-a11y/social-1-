import type { NextFunction , Request , Response } from "express";
import {ZodError , ZodType} from "zod"
import { BadRequestExcption } from "../Excption/Excption";

type ValidationKey = keyof Request
type ValidationSchema = Partial<Record<ValidationKey, ZodType>>

export const validation = (schema: ValidationSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validationErrors: { key: ValidationKey; issue: ZodError["issues"] }[] = []

        for (const key of Object.keys(schema) as ValidationKey[]) {
            if (!schema[key]) continue

            const result = schema[key].safeParse(req[key])
            if (!result.success) {
                validationErrors.push({ key, issue: result.error.issues })
            }
        }

        if (validationErrors.length > 0) {
            throw new BadRequestExcption("Validation error", validationErrors)
        }

        next()
    }
}
