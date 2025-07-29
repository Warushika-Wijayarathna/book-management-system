import {NextFunction, Request, Response} from "express"
import {UserModel} from "../models/User"
import {APIError} from "../errors/APIError"
import {logAction} from "../services/auditLogger"
import bcrypt from "bcrypt"

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        await logAction("UPDATE", req.user?.userId, "User", req.params.id)

        if (!user) {
            throw new APIError(404, "User not found")
        }
        res.status(200).json(user)
    } catch (error: any) {
        next(error)
    }
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Update Profile Request Body:", req.body, "User ID:", req.user?.userId)
    try {
        const userId = req.user?.userId
        if (!userId) {
            throw new APIError(401, "User not authenticated")
        }

        const { name, email, bio, phone, address, dateOfBirth, profilePicture, avatarStyle } = req.body

        if (email) {
            const existingUser = await UserModel.findOne({ email, _id: { $ne: userId } })
            if (existingUser) {
                throw new APIError(400, "Email already in use")
            }
        }

        const updateData: any = {}
        if (name) updateData.name = name
        if (email) updateData.email = email
        if (bio !== undefined) updateData.bio = bio
        if (phone !== undefined) updateData.phone = phone
        if (address !== undefined) updateData.address = address
        if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth)
        if (profilePicture !== undefined) updateData.profilePicture = profilePicture
        if (avatarStyle !== undefined) updateData.avatarStyle = avatarStyle

        const user = await UserModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password')

        if (!user) {
            throw new APIError(404, "User not found")
        }

        await logAction("UPDATE", userId, "User", userId)

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            avatarStyle: user.avatarStyle,
            bio: user.bio,
            phone: user.phone,
            address: user.address,
            dateOfBirth: user.dateOfBirth,
            updatedAt: user.updatedAt
        })
    } catch (error: any) {
        next(error)
    }
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Change Password Request Body:", req.body, "User ID:", req.user?.userId)
    try {
        const userId = req.user?.userId
        if (!userId) {
            throw new APIError(401, "User not authenticated")
        }

        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            throw new APIError(400, "Current password and new password are required")
        }

        const user = await UserModel.findById(userId)
        if (!user) {
            throw new APIError(404, "User not found")
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
        if (!isCurrentPasswordValid) {
            throw new APIError(400, "Current password is incorrect")
        }

        const SALT = 10
        const hashedNewPassword = await bcrypt.hash(newPassword, SALT)

        await UserModel.findByIdAndUpdate(userId, { password: hashedNewPassword })

        await logAction("UPDATE", userId, "User", userId)

        res.status(200).json({
            message: "Password changed successfully. Please sign in again with your new password.",
            requiresReauth: true
        })
    } catch (error: any) {
        next(error)
    }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserModel.find()
        res.status(200).json(users)
    } catch (error: any) {
        next(error)
    }
}

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId

        const user = await UserModel.findById(userId).select('-password')
        if (!user) {
            throw new APIError(404, "User not found")
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            avatarStyle: user.avatarStyle,
            bio: user.bio,
            phone: user.phone,
            address: user.address,
            dateOfBirth: user.dateOfBirth,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        })
    } catch (error: any) {
        next(error)
    }
}
