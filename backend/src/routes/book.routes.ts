import {Router} from "express";
import {createBook, deleteBook, getBookById, getBooks, updateBook} from "../controllers/book.controller";

const bookRouter = Router()

bookRouter.post("/", createBook)
bookRouter.get("/", getBooks)
bookRouter.get("/:id", getBookById)
bookRouter.delete("/:id", deleteBook);
bookRouter.put("/:id", updateBook);

export default bookRouter;
