import { getAuditLogs } from "../controllers/audit.controller"
import {Router} from "express"

const auditRouter = Router()

auditRouter.get("/", getAuditLogs)

export default auditRouter
