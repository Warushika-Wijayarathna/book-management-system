import {Router} from "express"
import {notifyAllOverdue} from "../controllers/notification.controller"
import {authenticateToken} from "../middlewares/authenticateToken";

const notificationRouter = Router()

// add authenticateToken middleware to all routes
notificationRouter.use(authenticateToken)

notificationRouter.post("/", notifyAllOverdue)

export default notificationRouter
