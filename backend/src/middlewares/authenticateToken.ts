import jwt, {JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import {NextFunction, Request, Response} from "express"
import {APIError} from "../errors/APIError"

declare module "express-serve-static-core" {
    interface Request {
        user?: any
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader =  req.headers["authorization"]
        console.log("[AUTH MIDDLEWARE] Authorization header received:", authHeader);
        const token =  authHeader && authHeader.split(" ")[1]

        if (!token) {
            console.log("[AUTH MIDDLEWARE] No token found in Authorization header.");
            throw new APIError(403, "Access token not found")
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (error, decoded) => {
            if (error) {
                console.log("[AUTH MIDDLEWARE] Token verification failed:", error);
                if (error instanceof TokenExpiredError) {
                    throw new APIError(403, "Access token expired")
                } else if (error instanceof JsonWebTokenError) {
                    throw new APIError(403, "Invalid access token")
                } else {
                    throw new APIError(403, "Could not authenticate token")
                }
            }
            console.log("[AUTH MIDDLEWARE] Token payload:", decoded);

            if (!decoded || typeof decoded === "string") {
                throw new APIError(403, "Invalid token payload")
            }

            req.user = decoded

            next()
        })

    } catch (error) {
        next(error)
    }
}
