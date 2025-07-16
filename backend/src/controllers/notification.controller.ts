import { Request, Response, NextFunction } from "express"
import { LendingModel } from "../models/Lending"
import { sendOverdueNotification } from "../services/emailService"

export const notifyAllOverdue = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const today = new Date()

        const overdueLendings = await LendingModel.find({
            dueDate: { $lt: today },
            status: "borrowed"
        })

        const uniqueReaderIds = [...new Set(overdueLendings.map(l => l.readerId.toString()))]

        for (const readerId of uniqueReaderIds) {
            await sendOverdueNotification(readerId)
        }

        res.json({ message: `Notifications sent to ${uniqueReaderIds.length} readers.` })
    } catch (err) {
        next(err)
    }
}
