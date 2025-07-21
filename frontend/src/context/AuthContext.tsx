import { createContext } from "react"

export interface AuthContextType {
    isLoggedIn: boolean
    isAdmin: boolean
    login: (accessToken: string) => void
    logout: () => void
    isAuthenticating: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
