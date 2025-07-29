import {Router} from "express"
import {createReader, deleteReader, getReaderById, getReaders, updateReader} from "../controllers/reader.controller"
import {authenticateToken} from "../middlewares/authenticateToken"

const readerRouter =  Router()

readerRouter.use(authenticateToken)

readerRouter.post("/", createReader)
readerRouter.get("/", getReaders)
readerRouter.get("/:id", getReaderById)
readerRouter.delete("/:id", deleteReader)
readerRouter.put("/:id", updateReader)

export default readerRouter
