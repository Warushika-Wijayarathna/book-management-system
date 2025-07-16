import mongoose from "mongoose";

type User = {
    name: string;
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [2, "Name must be at least 2 characters long"],
        required: [true, "Name required"],
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"
        ],
    },
    password: {
        type: String,
        required: [true, "Password required"],
        minlength: [6, "Password must be at least 6 characters long"]
    }
})

export const UserModel = mongoose.model<User>("Users", userSchema)
