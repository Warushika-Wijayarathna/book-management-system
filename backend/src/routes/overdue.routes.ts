import {Router} from "express"
import {getOverdueByReader, getOverdueReaders} from "../controllers/overdue.controller"

export const overdueRouter = Router()

overdueRouter.get("/", getOverdueReaders)
overdueRouter.get("/:id", getOverdueByReader)

export default overdueRouter
