import {Router} from "express"
import {authenticateToken} from "../middlewares/authenticateToken"
import {getUser, updateUser} from "../controllers/user.controller"

export const userRouter = Router()

// add authenticateToken middleware to all routes
userRouter.use(authenticateToken)

userRouter.get("/", getUser)
userRouter.put("/:id", updateUser)

export default userRouter
