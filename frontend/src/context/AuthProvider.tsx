import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import apiClient, { setHeader } from "../services/apiClient.ts"

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [accessToken, setAccessToken] = useState<string>("")
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)

    const handleToken = (token: string) => {
        console.log("Setting new token in headers:", token.substring(0, 20) + "...");
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
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem("accessToken") || "";

            if (storedToken) {
                setHeader(storedToken);

                try {
                    const result = await apiClient.post("/auth/refresh-token");
                    const newToken = result.data.accessToken;
                    login(newToken);
                } catch (refreshError) {
                    logout();
                }
                setIsAuthenticating(false);
                return;
            }

            // Check if we're on a public path
            const publicPaths = ["/", "/signin", "/signup"]
            const currentPath = window.location.pathname

            if (publicPaths.includes(currentPath)) {
                setIsAuthenticating(false)
                return
            }

            // Try to refresh token for protected routes
            try {
                const result = await apiClient.post("/auth/refresh-token")
                const token = result.data.accessToken
                login(token)
                console.log("Token refreshed successfully")
            } catch (error) {
                console.log("Token refresh failed, redirecting to login")
                logout()
                window.location.href = "/signin"
            } finally {
                setIsAuthenticating(false)
            }
        }

        initializeAuth()
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
