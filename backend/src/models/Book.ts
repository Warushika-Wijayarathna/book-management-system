import mongoose from 'mongoose'

type Book = {
    title: string
    author: string
    isbn: string
    publishedYear: number
    genres: string[]
    totalCopies: number
    availableCopies: number
    addedDate: Date
    imageUrl?: string
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
    genres: {
        type: [String],
        required: [true, "At least one genre is required"],
        validate: {
            validator: function(v: string[]) {
                return Array.isArray(v) && v.length > 0;
            },
            message: "Please provide at least one genre"
        }
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
    },
    imageUrl: {
        type: String,
        trim: true
    }
})

export const BookModel = mongoose.model<Book>("Books", bookSchema)
