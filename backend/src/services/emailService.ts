import sgMail from "@sendgrid/mail"
import { LendingModel } from "../models/Lending"
import { ReaderModel } from "../models/Reader"

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export const sendOverdueNotification = async (readerId: string): Promise<void> => {
    const reader = await ReaderModel.findById(readerId)
    if (!reader || !reader.email) return

    const today = new Date()
    const overdueBooks = await LendingModel.find({
        readerId,
        dueDate: { $lt: today },
        status: "borrowed"
    }).populate("bookId")

    if (!overdueBooks.length) return

    const bookList = overdueBooks.map((l: any) => {
        const book = l.bookId
        return `<li><strong>${book.title}</strong> (Due: ${new Date(l.dueDate).toDateString()})</li>`
    }).join("")

    const emailBody = `
    <h3>Dear ${reader.name},</h3>
    <p>You have the following overdue books:</p>
    <ul>${bookList}</ul>
    <p>Please return them as soon as possible to avoid penalties.</p>
    <p>– Book Club Library</p>
  `

    await sgMail.send({
        to: reader.email,
        from: process.env.EMAIL_FROM!,
        subject: "Overdue Books Reminder – Book Club",
        html: emailBody,
    })
}
