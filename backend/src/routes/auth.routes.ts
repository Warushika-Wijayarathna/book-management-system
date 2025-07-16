import {Router} from "express";
import {login, refreshToken, signUp} from "../controllers/auth.controller";

export const authRouter = Router()

authRouter.post("/signup", signUp)
authRouter.post("/login", login)
authRouter.post("/refresh-token", refreshToken)

export default authRouter
