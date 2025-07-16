import nodemailer from "nodemailer"
import { LendingModel } from "../models/Lending"
import { ReaderModel } from "../models/Reader"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

export const sendOverdueNotification = async (readerId: string) => {
    const reader = await ReaderModel.findById(readerId)
    if (!reader || !reader.email) return

    const today = new Date()
    const overdueLendings = await LendingModel.find({
        readerId,
        dueDate: { $lt: today },
        status: "borrowed",
    }).populate("bookId")

    if (!overdueLendings.length) return

    const bookList = overdueLendings.map((l: any) => {
        const book = l.bookId
        return `<li>${book.title} (Due: ${new Date(l.dueDate).toDateString()})</li>`
    }).join("")

    const emailHTML = `
    <p>Dear ${reader.name},</p>
    <p>You have the following <strong>overdue books</strong>:</p>
    <ul>${bookList}</ul>
    <p>Please return them to avoid penalties.</p>
    <p>– Book Club Library</p>
  `

    await transporter.sendMail({
        from: process.env.EMAIL_FROM!,
        to: reader.email,
        subject: "⏰ Overdue Book Reminder",
        html: emailHTML,
    })
}
