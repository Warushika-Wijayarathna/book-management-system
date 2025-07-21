import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import apiClient, { setHeader } from "../services/apiClient.ts"

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [accessToken, setAccessToken] = useState<string>(() => localStorage.getItem("accessToken") || "")
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)

    const handleToken = (token: string) => {
        setAccessToken(token)
        setHeader(token)
        localStorage.setItem("accessToken", token)
        setIsAdmin(true)
    }

    const login = (token: string) => {
        setIsLoggedIn(true)
        handleToken(token)
    }

    const logout = () => {
        setIsLoggedIn(false)
        setIsAdmin(false)
        setAccessToken("")
        setHeader("")
        localStorage.removeItem("accessToken")
    }

    useEffect(() => {
        if (accessToken) {
            handleToken(accessToken)
            setIsLoggedIn(true)
        } else {
            setHeader("")
        }
    }, [accessToken])

    useEffect(() => {
        const publicPaths = ["/", "/signin", "/signup"]
        const currentPath = window.location.pathname

        if (publicPaths.includes(currentPath)) {
            setIsAuthenticating(false)
            return
        }

        const tryRefresh = async () => {
            try {
                const result = await apiClient.post("/auth/refresh-token")
                const token = result.data.accessToken
                login(token)
                console.log("Token refreshed successfully")
            } catch (error) {
                logout()
            } finally {
                setIsAuthenticating(false)
            }
        }

        tryRefresh()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                login,
                logout,
                isAuthenticating,
                isAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
