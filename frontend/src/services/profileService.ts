import apiClient, { setHeader } from "./apiClient"
import { User } from "../context/AuthContext"

export interface UpdateProfileData {
    name?: string
    email?: string
    bio?: string
    phone?: string
    address?: string
    dateOfBirth?: string
    profilePicture?: string
    avatarStyle?: string
}

export interface ChangePasswordData {
    currentPassword: string
    newPassword: string
}

const ensureTokenInHeaders = () => {
    const token = localStorage.getItem("accessToken")
    console.log("ensureTokenInHeaders - Token exists:", !!token)
    if (token) {
        setHeader(token)
        console.log("Token set in headers for profile API call:", token.substring(0, 20) + "...")
        return true
    } else {
        console.error("No token found for profile API call!")
        return false
    }
}

export const updateProfile = async (profileData: UpdateProfileData): Promise<User> => {
    const tokenSet = ensureTokenInHeaders()
    if (!tokenSet) {
        throw new Error("Authentication token not available")
    }

    console.log("Making profile update request with data:", profileData)
    const response = await apiClient.put("/users/profile", profileData)
    console.log("Profile update response:", response.data)
    return response.data
}

export const changePassword = async (passwordData: ChangePasswordData): Promise<{ message: string; requiresReauth: boolean }> => {
    const tokenSet = ensureTokenInHeaders()
    if (!tokenSet) {
        throw new Error("Authentication token not available")
    }

    console.log("Making password change request")
    const response = await apiClient.put("/users/change-password", passwordData)
    console.log("Password change response:", response.data)

    return {
        message: response.data.message,
        requiresReauth: response.data.requiresReauth || false
    }
}
