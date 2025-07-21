import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import apiClient, { setHeader } from "../services/apiClient.tsx"

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [accessToken, setAccessToken] = useState<string>("")
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)

    const login = (token: string) => {
        setIsLoggedIn(true)
        setAccessToken(token)
    }

    const logout = () => setIsLoggedIn(false)

    useEffect(() => {
        setHeader(accessToken)
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
                setAccessToken(result.data.accessToken)
                setIsLoggedIn(true)
            } catch (error) {
                setAccessToken("")
                setIsLoggedIn(false)
            } finally {
                setIsAuthenticating(false)
            }
        }

        tryRefresh()
    }, [])

    return <AuthContext.Provider value={{ isLoggedIn, login, logout, isAuthenticating }}>{children}</AuthContext.Provider>
}
