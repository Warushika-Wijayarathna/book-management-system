import {Router} from "express"
import {notifyAllOverdue} from "../controllers/notification.controller";

const notificationRouter = Router()

notificationRouter.post("/", notifyAllOverdue)

export default notificationRouter
