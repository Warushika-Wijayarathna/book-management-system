import {Router} from "express"
import {notifyAllOverdue} from "../controllers/notification.controller"

const notificationRouter = Router()

notificationRouter.post("/notify-overdue", (req, res, next) => {
  notifyAllOverdue(req, res, next)
})

export default notificationRouter
