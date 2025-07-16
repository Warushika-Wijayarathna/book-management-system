import jwt, {JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import {NextFunction, Request, Response} from "express"
import {APIError} from "../errors/APIError"

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader =  req.headers["authorization"]
        const token =  authHeader && authHeader.split(" ")[1]

        if (!token) {
            throw new APIError(403, "Access token not found")
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (error, decoded) => {
            if (error) {
                if (error instanceof TokenExpiredError) {
                    throw new APIError(403, "Access token expired")
                } else if (error instanceof JsonWebTokenError) {
                    throw new APIError(403, "Invalid access token")
                } else {
                    throw new APIError(403, "Could not authenticate token")
                }
            }

            if (!decoded || typeof decoded === "string") {
                throw new APIError(403, "Invalid token payload")
            }

            next()
        })

    } catch (error) {
        next(error)
    }
}
