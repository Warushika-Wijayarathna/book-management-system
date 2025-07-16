import {Router} from "express"
import {getOverdueByReader, getOverdueReaders} from "../controllers/overdue.controller"
import {authenticateToken} from "../middlewares/authenticateToken";

export const overdueRouter = Router()

// add authenticateToken middleware to all routes
overdueRouter.use(authenticateToken)

overdueRouter.get("/", getOverdueReaders)
overdueRouter.get("/:id", getOverdueByReader)

export default overdueRouter
