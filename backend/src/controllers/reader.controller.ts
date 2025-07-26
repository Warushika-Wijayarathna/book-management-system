import {NextFunction, Request, Response} from "express"
import {ReaderModel} from "../models/Reader"
import {APIError} from "../errors/APIError"
import {logAction} from "../services/auditLogger"

export const createReader = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Creating reader with data//////////////////////:", req.body, "Request user:", req.user)
    try{
        console.log("Reader : ", req.body)
        const reader = new ReaderModel(req.body)
        await reader.save()
        console.log("Reader created successfully:", reader)
        console.log(" successfully**********:", req.user)
        const userId = req.user?.userId || "unknown"
        console.log("User ID from request:", userId)
        await logAction("CREATE", req.user?.userId, "Reader", reader._id.toString())
        res.status(201).json({
            message: "Reader created successfully",
            reader: reader
        })
    } catch (error) {
        next(error)
    }
}

export const getReaders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const readers = await ReaderModel.find()
        res.status(200).json(readers)
    } catch (error) {
        next(error)
    }
}

export const getReaderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reader = await ReaderModel.findById(req.params.id)
        if (!reader) {
            throw new APIError(404, "Reader not found")
        }
        res.status(200).json(reader)
    } catch (error) {
        next(error)
    }
}

export const deleteReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reader = await ReaderModel.findByIdAndDelete(req.params.id)
        await logAction("DELETE", req.user?.id, "Reader", req.params.id)

        if (!reader) {
            throw new APIError(404, "Reader not found")
        }
        res.status(200).json({
            message: "Reader deleted successfully",
            reader: reader
        })
    } catch (error) {
        next(error)
    }
}

export const updateReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reader = await ReaderModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        await logAction("UPDATE", req.user?.id, "Reader", req.params.id)

        if (!reader) {
            throw new APIError(404, "Reader not found")
        }
        res.status(200).json({
            message: "Reader updated successfully",
            reader: reader
        })
    } catch (error) {
        next(error)
    }
}
