import apiClient from "./apiClient"
import { User } from "../context/AuthContext"

export interface UpdateProfileData {
    name?: string
    email?: string
    bio?: string
    phone?: string
    address?: string
    dateOfBirth?: string
    profilePicture?: string
}

export interface ChangePasswordData {
    currentPassword: string
    newPassword: string
}

export const updateProfile = async (profileData: UpdateProfileData): Promise<User> => {
    const response = await apiClient.put("/user/profile", profileData)
    return response.data
}

export const changePassword = async (passwordData: ChangePasswordData): Promise<{ message: string }> => {
    const response = await apiClient.put("/user/change-password", passwordData)
    return response.data
}
