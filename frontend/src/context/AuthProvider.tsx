import { useEffect, useState } from "react"
import { AuthContext, User } from "./AuthContext"
import apiClient, { setHeader } from "../services/apiClient.ts"

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [user, setUser] = useState<User | null>(null)

    const handleToken = (token: string) => {
        console.log("Setting new token in headers:", token.substring(0, 20) + "...");
        setHeader(token)
        localStorage.setItem("accessToken", token)
        setIsAdmin(true)
    }

    const fetchUserProfile = async () => {
        try {
            const response = await apiClient.get("/user/me")
            const userData = response.data
            setUser(userData)
            localStorage.setItem("userData", JSON.stringify(userData))
        } catch (error) {
            console.error("Error fetching user profile:", error)
        }
    }

    const login = (token: string, userData?: User) => {
        setIsLoggedIn(true)
        handleToken(token)
        if (userData) {
            setUser(userData)
            localStorage.setItem("userData", JSON.stringify(userData))
        } else {
            // Fetch user data if not provided
            fetchUserProfile()
        }
    }

    const logout = () => {
        setIsLoggedIn(false)
        setIsAdmin(false)
        setUser(null)
        setHeader("")
        localStorage.removeItem("accessToken")
        localStorage.removeItem("userData")
    }

    const updateUser = (userData: User) => {
        setUser(userData)
        localStorage.setItem("userData", JSON.stringify(userData))
    }

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem("accessToken") || "";
            const storedUserData = localStorage.getItem("userData");

            if (storedUserData) {
                try {
                    const userData = JSON.parse(storedUserData);
                    setUser(userData);
                } catch (error) {
                    console.error("Error parsing stored user data:", error);
                    localStorage.removeItem("userData");
                }
            }

            if (storedToken) {
                setHeader(storedToken);

                try {
                    const result = await apiClient.post("/auth/refresh-token");
                    const newToken = result.data.accessToken;

                    // Set the new token
                    handleToken(newToken);
                    setIsLoggedIn(true);

                    // Fetch fresh user data
                    await fetchUserProfile();
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
            } catch (error) {
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
                user,
                updateUser,
                fetchUserProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
