import mongoose from "mongoose"

type User = {
    name: string
    email: string
    password: string
    profilePicture?: string
    avatarStyle?: string
    bio?: string
    phone?: string
    address?: string
    dateOfBirth?: Date
    createdAt?: Date
    updatedAt?: Date
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
    },
    profilePicture: {
        type: String,
        required: false,
        trim: true
    },
    avatarStyle: {
        type: String,
        enum: ['initials', 'avataaars', 'personas'],
        default: 'avataaars',
        required: false
    },
    bio: {
        type: String,
        maxlength: [500, "Bio must be less than 500 characters"],
        required: false,
        trim: true
    },
    phone: {
        type: String,
        required: false,
        trim: true
    },
    address: {
        type: String,
        required: false,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
})

export const UserModel = mongoose.model<User>("Users", userSchema)
