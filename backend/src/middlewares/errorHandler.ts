import {NextFunction, Request, Response} from "express";
import {APIError} from "../errors/APIError";
import mongoose from "mongoose";

export const errorHandler= (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof mongoose.Error) {
        res.status(400).json({message: error.message})
        return
    }

    if (error instanceof APIError) {
        res.status(error.status).json({message: error.message})
        return
    }

    res.status(500).json({message: "Internal Server Error"})
}
