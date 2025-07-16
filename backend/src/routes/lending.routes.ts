import {Router} from "express"
import {
    getAllLendings,
    getLendingsByBook,
    getLendingsByReader,
    lendBook,
    returnBook
} from "../controllers/lending.controller"
import {authenticateToken} from "../middlewares/authenticateToken";

const lendingRouter = Router()

// add authenticateToken middleware to all routes
lendingRouter.use(authenticateToken)

lendingRouter.post("/", lendBook)
lendingRouter.put("/return/:id", returnBook)
lendingRouter.get("/", getAllLendings)
lendingRouter.get("/reader/:readerId", getLendingsByReader)
lendingRouter.get("/book/:bookId", getLendingsByBook)

export default lendingRouter
