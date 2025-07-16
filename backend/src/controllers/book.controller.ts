import {NextFunction, Request, Response} from "express";
import {BookModel} from "../models/Book";
import {APIError} from "../errors/APIError";

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = new BookModel(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (error: any) {
        next(error);
    }
}

export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await BookModel.find();
        res.status(200).json(books);
    } catch (error: any) {
        next(error);
    }
};

export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookModel.findById(req.params.id);
        if (!book) {
            throw new APIError(404, "Book not found");
        }
        res.status(200).json(book);
    } catch (error: any) {
        next(error);
    }
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookModel.findByIdAndDelete(req.params.id);
        if (!book) {
            throw new APIError(404, "Book not found");
        }
        res.status(200).json(book);
    } catch (error: any) {
        next(error);
    }
};

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookModel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if (!book) {
            throw new APIError(404, "Book not found");
        }
        res.status(200).json(book);
    } catch (error: any) {
        next(error);
    }
}
