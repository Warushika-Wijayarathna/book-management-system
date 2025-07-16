import express from "express"
import {
    getAllLendings,
    getLendingsByBook,
    getLendingsByReader,
    lendBook,
    returnBook
} from "../controllers/lending.controller"

const lendingRouter = express.Router()

lendingRouter.post("/", lendBook)
lendingRouter.put("/return/:id", returnBook)
lendingRouter.get("/", getAllLendings)
lendingRouter.get("/reader/:readerId", getLendingsByReader)
lendingRouter.get("/book/:bookId", getLendingsByBook)

export default lendingRouter;
