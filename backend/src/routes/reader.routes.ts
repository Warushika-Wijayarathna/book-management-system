import {Router} from "express";
import {createReader, deleteReader, getReaderById, getReaders} from "../controllers/reader.controller";
import {authenticateToken} from "../middlewares/authenticateToken";

const readerRouter =  Router()
// add authenticateToken middleware to all routes
readerRouter.use(authenticateToken);

readerRouter.post("/", createReader)
readerRouter.get("/", getReaders);
readerRouter.get("/:id", getReaderById);
readerRouter.delete("/:id", deleteReader);
readerRouter.put("/:id", getReaderById);

export default readerRouter;
