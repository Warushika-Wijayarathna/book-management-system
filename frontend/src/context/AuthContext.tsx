import { createContext } from "react"

export interface User {
    _id: string
    name: string
    email: string
    profilePicture?: string
    bio?: string
    phone?: string
    address?: string
    dateOfBirth?: string
    createdAt?: string
    updatedAt?: string
    role?: string
}

export interface AuthContextType {
    isLoggedIn: boolean
    isAdmin: boolean
    user: User | null
    login: (accessToken: string, userData?: User) => void
    logout: () => void
    isAuthenticating: boolean
    updateUser: (userData: User) => void
    fetchUserProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
