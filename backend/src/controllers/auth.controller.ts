import jwt, {JsonWebTokenError, JwtPayload, TokenExpiredError} from "jsonwebtoken"
import {NextFunction, Request, Response} from "express"
import {UserModel} from "../models/User"
import bcrypt from "bcrypt"
import {APIError} from "../errors/APIError"

const createAccessToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "10s",
    })
}

const createRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: "7d",
    })
}

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { name, email, password } = req.body

        const SALT = 10
        const hashedPassword = await bcrypt.hash(password, SALT)
        const user = new UserModel({
            name,
            email,
            password: hashedPassword
        })

        await user.save()
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email
        }

        res.status(201).json(userResponse)
    } catch (error: any) {
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body

        const user = await UserModel.findOne({email})
        if (!user) {
            throw new APIError(404, "User not found")
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new APIError(401, "Invalid email or password")
        }

        const accessToken = createAccessToken(user._id.toString())
        const refreshToken = createRefreshToken(user._id.toString())

        const isProd = process.env.NODE_ENV === "production"

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProd,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/api/auth/refresh-token",
        })

        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            accessToken,
        }

        res.status(200).json(userResponse)
    } catch (error: any) {
        next(error)
    }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Refreshing token...")
    try {
        const token = req.cookies?.refreshToken
        if (!token) {
            throw new APIError(401, "Refresh token missing")
        }

        jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET!,
            async (err: Error | null, decoded: string | JwtPayload | undefined) => {
                if (err) {
                    if (err instanceof TokenExpiredError) {
                        throw new APIError(401, "Refresh token expired")
                    } else if (err instanceof JsonWebTokenError) {
                        throw new APIError(401, "Invalid refresh token")
                    } else {
                        throw new APIError(401, "Refresh token error")
                    }
                }

                if (!decoded || typeof decoded === "string") {
                    throw new APIError(401, "Refresh token payload error")
                }

                const userId = decoded.userId as string
                const user = await UserModel.findById(userId)

                if (!user) {
                    throw new APIError(401, "User not found")
                }

                const newAccessToken = createAccessToken(user._id.toString())
                res.status(200).json({ accessToken: newAccessToken })
            }
        )
    } catch (error: any) {
        next(error)
    }
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
    try {
        const isProd = process.env.NODE_ENV === "production"

        res.cookie("refreshToken", "", {
            httpOnly: true,
            secure: isProd,
            expires: new Date(0),
            path: "/api/auth/refresh-token",
        })

        res.status(200).json({ message: "Logout successful" })
    } catch (err) {
        next(err)
    }
}
