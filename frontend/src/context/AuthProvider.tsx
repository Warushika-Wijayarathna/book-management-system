import { useEffect, useState } from "react"
import { AuthContext, User } from "./AuthContext"
import apiClient, { setHeader } from "../services/apiClient.ts"
import axios from "axios"

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
            const token = localStorage.getItem("accessToken")
            console.log("fetchUserProfile - Token exists:", !!token)

            if (!token) {
                console.error("No access token found")
                return
            }

            // Ensure token is set in headers before making request
            setHeader(token)
            console.log("fetchUserProfile - Token set in headers:", token.substring(0, 20) + "...")

            const response = await apiClient.get("/users/me")
            console.log("fetchUserProfile - Success:", response.data)
            const userData = response.data
            setUser(userData)
            localStorage.setItem("userData", JSON.stringify(userData))
        } catch (error) {
            console.error("Error fetching user profile:", error)
            if (axios.isAxiosError(error)) {
                console.error("Response status:", error.response?.status)
                console.error("Response data:", error.response?.data)
            }

        }
    }

    const login = (token: string, userData?: User) => {
        console.log("Logging in with token:", token.substring(0, 20) + "...");
        setIsLoggedIn(true)
        handleToken(token)
        if (userData) {
            setUser(userData)
            localStorage.setItem("userData", JSON.stringify(userData))
        } else {
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
            console.log("=== Auth Init Start ===");
            setIsAuthenticating(true);

            const storedToken = localStorage.getItem("accessToken");
            const storedUserData = localStorage.getItem("userData");

            console.log("Has token:", !!storedToken);
            console.log("Has user data:", !!storedUserData);

            // Ensure keys are reset in localStorage with default values if not found or invalid
            if (!storedToken) {
                console.log("accessToken not found. Resetting in localStorage...");
                localStorage.setItem("accessToken", "");
            }
            if (!storedUserData || storedUserData === "null") {
                console.log("userData not found or invalid. Resetting in localStorage...");
                localStorage.setItem("userData", JSON.stringify(null));
            }

            // If we have both token and user data, set user as logged in immediately
            if (storedToken && storedUserData) {
                try {
                    const userData = JSON.parse(storedUserData);
                    console.log("Setting user and logged in state");

                    // Set all authentication states immediately
                    setUser(userData);
                    setIsLoggedIn(true);
                    setIsAdmin(true);
                    setHeader(storedToken);

                    console.log("User is now logged in with token set in headers");
                } catch (error) {
                    console.error("Error parsing user data:", error);
                    // Clear bad data
                    localStorage.removeItem("userData");
                    localStorage.removeItem("accessToken");
                    setHeader("");
                }
            }

            // Added fallback to fetch user profile if token exists but user data is missing
            if (storedToken && !storedUserData) {
                console.log("Token exists but no user data. Fetching user profile...");
                try {
                    setHeader(storedToken);
                    await fetchUserProfile();
                    setIsLoggedIn(true);
                    setIsAdmin(true);
                } catch (error) {
                    console.error("Error fetching user profile during auth init:", error);
                    localStorage.removeItem("accessToken");
                    setHeader("");
                }
            }

            setIsAuthenticating(false);
            console.log("=== Auth Init Complete ===");
        };

        initializeAuth();
    }, [])

    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        const userData = localStorage.getItem("userData")

        if (!token) {
            console.warn("No access token found. Resetting local storage.")
            localStorage.setItem("accessToken", "")
        }

        if (!userData) {
            console.warn("No user data found. Resetting local storage.")
            localStorage.setItem("userData", JSON.stringify(null))
        }
    }, [])

    useEffect(() => {
        if (!isAuthenticating && !isLoggedIn && window.location.pathname !== "/signin") {
            console.log("User is not logged in. Redirecting to sign-in page.");
            window.location.href = "/signin";
        }
    }, [isLoggedIn, isAuthenticating]);

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
