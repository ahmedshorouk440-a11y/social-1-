
import jwt, { JwtPayload } from "jsonwebtoken"
import { randomUUID } from "node:crypto"
import { env } from "../Config/configService"
import { BadRequestExcption } from "../Excption/Excption"
import { Types } from "mongoose"

export type Audience = "admin" | "user"

export type Token = JwtPayload & {
    aud: Audience
    id: string
}

export type TokenUser = {
    _id: Types.ObjectId | string
    role?: Audience
}

export const generateToken = (user: TokenUser): { accessToken: string; refreshToken: string } => {
    let audience: Audience
    let signature: string
    let refreshSignature: string

    switch (user.role) {
        case "admin":
            signature = env.ADMINSIGNATUR
            refreshSignature = env.ADMINREFRESHSIGNATURE
            audience = "admin"
            break
        default:
            signature = env.USERSIGNATUR
            refreshSignature = env.USERREFRESHSIGNATURE
            audience = "user"
    }

    const payload = { id: String(user._id) }

    const accessToken = jwt.sign(payload, signature, {
        expiresIn: "30m",
        audience,
        jwtid: randomUUID(),
    })

    const refreshToken = jwt.sign(payload, refreshSignature, {
        expiresIn: "1y",
        audience,
        jwtid: randomUUID(),
    })

    return { accessToken, refreshToken }
}

export const generateAccessToken = async (refreshToken: string): Promise<string> => {
    const data = jwt.decode(refreshToken)

    if (!data || typeof data === "string") {
        throw new BadRequestExcption("Invalid Refresh Token")
    }

    let signature: string
    let refreshSignature: string
    let audience: Audience

    switch (data.aud) {
        case "admin":
            signature = env.ADMINSIGNATUR
            refreshSignature = env.ADMINREFRESHSIGNATURE
            audience = "admin"
            break
        case "user":
            signature = env.USERSIGNATUR
            refreshSignature = env.USERREFRESHSIGNATURE
            audience = "user"
            break
        default:
            throw new BadRequestExcption("Invalid Token Audience")
    }

    let decodedDataRefresh: Token
    try {
        decodedDataRefresh = jwt.verify(refreshToken, refreshSignature, { audience }) as Token
    } catch {
        throw new BadRequestExcption("Invalid or Expired Refresh Token")
    }

    return jwt.sign({ id: decodedDataRefresh.id }, signature, {
        expiresIn: "30m",
        audience,
        jwtid: randomUUID(),
    })
}