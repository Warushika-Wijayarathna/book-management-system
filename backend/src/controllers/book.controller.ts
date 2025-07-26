import {NextFunction, Request, Response} from "express"
import {BookModel} from "../models/Book"
import {APIError} from "../errors/APIError"
import {logAction} from "../services/auditLogger"

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Unauthorized: User not found in request." });
        }
        const book = new BookModel(req.body)
        await book.save()

        await logAction("CREATE", req.user.userId, "Book", book._id.toString())

        res.status(201).json(book)
    } catch (error: any) {
        console.error("Error creating book:", error)
        next(error)
    }
}

export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await BookModel.find()
        res.status(200).json(books)
    } catch (error: any) {
        console.error("Error fetching books:", error)
        next(error)
    }
}

export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookModel.findById(req.params.id)
        if (!book) {
            throw new APIError(404, "Book not found")
        }
        res.status(200).json(book)
    } catch (error: any) {
        console.error("Error fetching book by ID:", error)
        next(error)
    }
}

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookModel.findByIdAndDelete(req.params.id)
        await logAction("DELETE", req.user?.userId, "Book", req.params.id)

        if (!book) {
            throw new APIError(404, "Book not found")
        }
        res.status(200).json(book)
    } catch (error: any) {
        console.error("Error deleting book:", error)
        next(error)
    }
}

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookModel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        await logAction("UPDATE", req.user?.userId, "Book", req.params.id)
        if (!book) {
            throw new APIError(404, "Book not found")
        }
        res.status(200).json(book)
    } catch (error: any) {
        console.error("Error updating book:", error)
        next(error)
    }
}
