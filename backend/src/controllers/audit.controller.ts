import { Request, Response, NextFunction } from "express"
import { AuditLogModel } from "../models/AuditLog"

export const getAuditLogs = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const logs = await AuditLogModel.find().sort({ timestamp: -1 }).populate("performedBy")
        res.json(logs)
    } catch (error) {
        next(error)
    }
}
