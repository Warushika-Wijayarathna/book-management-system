import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { EyeCloseIcon, EyeIcon } from "../../icons"
import Label from "../form/Label"
import Input from "../form/input/InputField"
import Button from "../ui/button/Button"
import { useAuth } from "../../context/useAuth.tsx"
import toast from "react-hot-toast"
import apiClient from "../../services/apiClient"
import axios from "axios";

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login: authenticate } = useAuth()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignIn = async (e: React.FormEvent) => {
    console.log("handleSignIn called with formData:", formData)
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      try {
        console.log("Submitting form data:", formData)
        const loginResponse = await apiClient.post("/auth/login", formData)
        console.log("Login response received:", loginResponse.data)
        toast.success(`Welcome, ${loginResponse.data.name}!`)

        const userData = {
          _id: loginResponse.data._id,
          name: loginResponse.data.name,
          email: loginResponse.data.email,
        }

        console.log(
          "Authenticating user with token and userData:",
          loginResponse.data.accessToken,
          userData
        )
        authenticate(loginResponse.data.accessToken, userData)
        navigate("/home")
      } catch (error) {
        console.error("Error during login:", error)
        if (axios.isAxiosError(error)) {
          console.error("Axios error response:", error.response)
          toast.error(error.response?.data?.message || error.message)
        } else {
          toast.error("Something went wrong")
        }
      } finally {
        console.log("Resetting isLoading state to false")
        setIsLoading(false)
      }
    } else {
      console.log("Form validation failed with errors:", errors)
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          {/* Sign-in Form */}
          <form onSubmit={handleSignIn}>
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="info@gmail.com"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              <div>
                <Button className="w-full" size="sm" disabled={isLoading} type={"submit"}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
