import {Router} from "express"
import {authenticateToken} from "../middlewares/authenticateToken"
import {getUser, updateUser, getCurrentUser, updateProfile, changePassword} from "../controllers/user.controller"

export const userRouter = Router()

userRouter.use(authenticateToken)

userRouter.get("/", getUser)
userRouter.get("/me", getCurrentUser)
userRouter.put("/profile", updateProfile)
userRouter.put("/change-password", changePassword)
userRouter.put("/:id", updateUser)

export default userRouter
