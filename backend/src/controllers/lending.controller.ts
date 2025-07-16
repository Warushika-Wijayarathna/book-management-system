import { Request, Response, NextFunction } from "express"
import { LendingModel } from "../models/Lending"
import { BookModel } from "../models/Book"
import { APIError } from "../errors/APIError"

export const lendBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { readerId, bookId, days = 14 } = req.body

        const book = await BookModel.findById(bookId)
        if (!book || book.availableCopies <= 0) {
            throw new APIError(400, "Book is not available for lending")
        }

        const borrowedDate = new Date()
        const dueDate = new Date(borrowedDate)
        dueDate.setDate(dueDate.getDate() + days)

        const lending = await LendingModel.create({
            readerId,
            bookId,
            borrowedDate,
            dueDate,
            status: "borrowed",
        })

        book.availableCopies -= 1
        await book.save()

        res.status(201).json({ message: "Book successfully lent", lending })
    } catch (error) {
        next(error)
    }
}

export const returnBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lending = await LendingModel.findById(req.params.id)
        if (!lending || lending.status === "returned") {
            throw new APIError(404, "Lending record not found or already returned")
        }

        lending.status = "returned"
        lending.returnedDate = new Date()
        await lending.save()

        const book = await BookModel.findById(lending.bookId)
        if (book) {
            book.availableCopies += 1
            await book.save()
        }

        res.json({ message: "Book returned successfully", lending })
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
