import mongoose, { Types } from "mongoose"

type Lending = {
    readerId: Types.ObjectId
    bookId: Types.ObjectId
    borrowedDate: Date
    dueDate: Date
    returnedDate?: Date
    status: "borrowed" | "returned" | "overdue"
}

const lendingSchema = new mongoose.Schema({
    readerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Readers",
        required: [true, "Reader ID is required"]
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Books",
        required: [true, "Book ID is required"]
    },
    borrowedDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: [true, "Due date is required"]
    },
    returnedDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["borrowed", "returned", "overdue"],
        default: "borrowed"
    }
})

export const LendingModel = mongoose.model<Lending>("Lendings", lendingSchema)
