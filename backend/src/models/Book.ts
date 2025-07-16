import mongoose from 'mongoose'

type Book = {
    title: string
    author: string
    isbn: string
    publishedYear: number
    category: string
    totalCopies: number
    availableCopies: number
    addedDate: Date
}

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        minlength: [2, "Title must be at least 2 characters long"],
        trim: true
    },
    author: {
        type: String,
        required: [true, "Author is required"],
        trim: true
    },
    isbn: {
        type: String,
        required: [true, "ISBN is required"],
        unique: true,
        trim: true
    },
    publishedYear: {
        type: Number,
        required: [true, "Published year is required"]
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true
    },
    totalCopies: {
        type: Number,
        required: [true, "Total copies is required"],
        min: [1, "There must be at least 1 copy"]
    },
    availableCopies: {
        type: Number,
        required: [true, "Available copies is required"],
        min: [0, "Available copies cannot be negative"]
    },
    addedDate: {
        type: Date,
        default: Date.now
    }
})

export const BookModel = mongoose.model<Book>("Books", bookSchema)
