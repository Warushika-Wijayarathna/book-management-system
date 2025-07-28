import {Router} from "express"
import authRouter from "./auth.routes"
import bookRouter from "./book.routes"
import readerRouter from "./reader.routes"
import lendingRouter from "./lending.routes"
import notificationRouter from "./notification.routes"
import overdueRouter from "./overdue.routes"
import userRouter from "./user.routes"
import auditRouter from "./audit.routes"

const rootRouter = Router()

console.log(`🛣️  [ROUTES] Setting up root router...`)

rootRouter.use("/audit", auditRouter)
rootRouter.use("/auth", authRouter)
rootRouter.use("/books", bookRouter)
rootRouter.use("/lendings", lendingRouter)
rootRouter.use("/notifications", notificationRouter)
rootRouter.use("/overdue", overdueRouter)
rootRouter.use("/readers", readerRouter)
rootRouter.use("/users", userRouter)

export default rootRouter
