import { Request, Response, NextFunction } from "express"
import { LendingModel } from "../models/Lending"
import { sendOverdueNotification } from "../services/emailService"

export const notifyAllOverdue = async (_req: Request, res: Response, next: NextFunction) => {

    try {
        const today = new Date()

        const overdueLendings = await LendingModel.find({
            $or: [
                { dueDate: { $lt: today }, status: "borrowed" },
                { status: "overdue" }
            ]
        })

        const uniqueReaderIds = [...new Set(overdueLendings.map(l => l.readerId.toString()))]

        for (const readerId of uniqueReaderIds) {
            try {
                await sendOverdueNotification(readerId)
            } catch (emailError) {
                console.error(`Failed to send email to reader ${readerId}:`, emailError)
            }
        }

        const responseMessage = `Email sent to ${uniqueReaderIds.length} overdue reader(s)`
        res.json({ message: responseMessage })
    } catch (err) {
        console.error(`Error in notifyAllOverdue:`, err)
        next(err)
    }
}
