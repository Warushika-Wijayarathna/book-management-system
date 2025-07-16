import {Router} from "express"
import {authenticateToken} from "../middlewares/authenticateToken"
import {getUser, updateUser} from "../controllers/user.controller"

export const userRouter = Router()

userRouter.use(authenticateToken)

userRouter.get("/", getUser)
userRouter.put("/:id", updateUser)

export default userRouter
