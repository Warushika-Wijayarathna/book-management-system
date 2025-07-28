import { getAuditLogs } from "../controllers/audit.controller"
import {Router} from "express"
import {authenticateToken} from "../middlewares/authenticateToken";

const auditRouter = Router()

auditRouter.use(authenticateToken)

auditRouter.get("/", getAuditLogs)

export default auditRouter
