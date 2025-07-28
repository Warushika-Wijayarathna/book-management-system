import { Request, Response, NextFunction } from "express"
import { LendingModel } from "../models/Lending"
import { BookModel } from "../models/Book"
import { APIError } from "../errors/APIError"
import {logAction} from "../services/auditLogger"

export const lendBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Unauthorized: User not found in request." });
        }

        console.log("lendBook called with body:", req.body)
        const { readerId, bookId, days = 14 } = req.body

        const book = await BookModel.findById(bookId)
        console.log("Book found:", book)
        if (!book || book.availableCopies <= 0) {
            console.log("Book not available for lending")
            throw new APIError(400, "Book is not available for lending")
        }

        const borrowedDate = new Date()
        const dueDate = new Date(borrowedDate)
        dueDate.setDate(dueDate.getDate() + days)
        console.log("Borrowed date:", borrowedDate, "Due date:", dueDate)

        const lending = await LendingModel.create({
            readerId,
            bookId,
            borrowedDate,
            dueDate,
            status: "borrowed",
        })
        console.log("Lending record created:", lending)

        book.availableCopies -= 1
        await book.save()
        console.log("Book availableCopies decremented and saved:", book.availableCopies)

        await logAction("LEND", req.user.userId, "Book", bookId)

        res.status(201).json({ message: "Book successfully lent", lending })
    } catch (error) {
        console.error("Error in lendBook:", error)
        next(error)
    }
}

export const returnBook = async (req: Request, res: Response, next: NextFunction) => {
    console.log("returnBook called with params:", req.params)
    try {
        const lending = await LendingModel.findById(req.params.id)
        if (!lending || lending.status === "returned" || lending.status === "returnedLate") {
            throw new APIError(404, "Lending record not found or already returned")
        }

        // Check if lending is overdue
        const currentDate = new Date()
        const isOverdue = currentDate > lending.dueDate

        // Determine the appropriate return status
        const returnStatus = isOverdue ? "returnedLate" : "returned"

        lending.status = returnStatus
        lending.returnedDate = new Date()
        await lending.save()

        const book = await BookModel.findById(lending.bookId)
        if (book) {
            book.availableCopies += 1
            await book.save()
            await logAction("RETURN", req.user.userId, "Lending", lending._id.toString())
        }

        const message = isOverdue
            ? "Book returned successfully (marked as late return)"
            : "Book returned successfully"

        res.json({
            message,
            lending,
            wasOverdue: isOverdue
        })
    } catch (error) {
        next(error)
    }
}

export const getAllLendings = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const lendings = await LendingModel.find()
            .populate("readerId")
            .populate("bookId")
        res.json(lendings)
    } catch (error) {
        next(error)
    }
}

export const getLendingsByReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lendings = await LendingModel.find({ readerId: req.params.readerId })
            .populate("bookId")
        res.json(lendings)
    } catch (error) {
        next(error)
    }
}

export const getLendingsByBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lendings = await LendingModel.find({ bookId: req.params.bookId })
            .populate("readerId")
        res.json(lendings)
    } catch (error) {
        next(error)
    }
}
