import {NextFunction, Request, Response} from "express"
import {ReaderModel} from "../models/Reader"
import {APIError} from "../errors/APIError"
import {logAction} from "../services/auditLogger"

export const createReader = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const reader = new ReaderModel(req.body)
        await reader.save()
        const userId = req.user?.userId || "unknown"
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
        const userId = req.user?.userId || "unknown"

        await logAction("DELETE", req.user?.userId, "Reader", req.params.id)

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
        const userId = req.user?.userId || "unknown"

        await logAction("UPDATE", req.user?.userId, "Reader", req.params.id)

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
