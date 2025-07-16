import mongoose from "mongoose"

type Reader = {
    name: string
    email?: string
    contactNumber: string
    address: string
    createdAt: Date
}

const readerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [2, "Name must be at least 2 characters long"],
        trim: true
    },
    email: {
        type: String,
        required: false,
        trim: true,
        unique: true,
        index: true,
        lowercase: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"
        ],
    },
    contactNumber: {
        type: String,
        required: [true, "Contact number is required"],
        minlength: [10, "Contact number must be at least 10 characters long"],
        trim: true
    },
    address: {
        type: String,
        required: [true, "Address is required"],
        minlength: [5, "Address must be at least 5 characters long"],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const ReaderModel = mongoose.model<Reader>("Readers", readerSchema)
