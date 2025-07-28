import nodemailer from "nodemailer"
import { ReaderModel } from "../models/Reader"
import { LendingModel } from "../models/Lending"

export const sendOverdueNotification = async (readerId: string) => {

    try {
        const reader = await ReaderModel.findById(readerId)

        if (!reader) {
            throw new Error(`Reader not found with ID: ${readerId}`)
        }


        if (!reader.email) {
            return { success: false, message: `Reader has no email address` }
        }

        const today = new Date()

        const overdueLendings = await LendingModel.find({
            readerId,
            $or: [
                { dueDate: { $lt: today }, status: "borrowed" },
                { status: "overdue" }
            ]
        }).populate("bookId")


        if (!overdueLendings.length) {
            return { success: false, message: `No overdue lendings found for reader` }
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {

            return {
                success: true,
                message: `Email simulated for ${reader.name} (${reader.email}) - ${overdueLendings.length} overdue books`,
                simulated: true
            }
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS.replace(/\s/g, ''), // Remove any spaces from app password
            },
        })

        const bookList = overdueLendings.map((l: any) => {
            const book = l.bookId
            return `<li>${book?.title || 'Unknown Book'} (Due: ${new Date(l.dueDate).toDateString()})</li>`
        }).join("")

        const emailHTML = `
            <p>Dear ${reader.name},</p>
            <p>You have the following <strong>overdue books</strong>:</p>
            <ul>${bookList}</ul>
            <p>Please return them to avoid penalties.</p>
            <p>– Book Club Library</p>
        `


        const result = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: reader.email,
            subject: "⏰ Overdue Book Reminder",
            html: emailHTML,
        })


        return {
            success: true,
            message: `Email sent to ${reader.name} (${reader.email})`,
            result: result
        }

    } catch (error) {
        throw error
    }
}
