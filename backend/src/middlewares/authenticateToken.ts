import jwt, {JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import {NextFunction, Request, Response} from "express"

declare module "express-serve-static-core" {
    interface Request {
        user?: any
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader =  req.headers["authorization"]
        const token =  authHeader && authHeader.split(" ")[1]

        if (!token) {
            return res.status(403).json({ message: "Access token not found" });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (error, decoded) => {
            if (error) {
                if (error instanceof TokenExpiredError) {
                    return res.status(403).json({ message: "Access token expired" });
                } else {
                    return res.status(403).json({ message: "Invalid access token" });
                }
            }

            if (!decoded || typeof decoded === "string") {
                return res.status(403).json({ message: "Invalid token payload" });
            }

            req.user = decoded
            next()
        })

    } catch (error) {
        return res.status(403).json({ message: "Authentication failed" });
    }
}
