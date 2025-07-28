import {Router} from "express"
import {createBook, deleteBook, getBookById, getBooks, updateBook} from "../controllers/book.controller"
import {authenticateToken} from "../middlewares/authenticateToken"

const bookRouter = Router()

bookRouter.use(authenticateToken)

bookRouter.post("/", createBook)
bookRouter.get("/", getBooks)
bookRouter.get("/:id", getBookById)
bookRouter.delete("/:id", deleteBook)
bookRouter.put("/:id", updateBook)

export default bookRouter

