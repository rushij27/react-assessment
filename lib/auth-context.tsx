"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"

// API base URL
const API_BASE_URL = "https://second-brain-web.onrender.com/api"

// User type definition
interface User {
  firstName: string
  lastName: string
  email: string
  token?: string
}

// Auth context type
interface AuthContextType {
  user: User | null
  isLoading: boolean
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)

        // Set axios default headers with token
        if (parsedUser.token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`
        }
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  // Register function
  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        firstName,
        lastName,
        email,
        password,
      })

      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed"
      throw new Error(message)
    }
  }

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      })

      const userData = response.data

      // Create user object with token
      const userWithToken = {
        firstName: userData.firstName || userData.user?.firstName || "User",
        lastName: userData.lastName || userData.user?.lastName || "",
        email: userData.email || userData.user?.email || email,
        token: userData.token,
      }

      // Save user to state and localStorage
      setUser(userWithToken)
      localStorage.setItem("user", JSON.stringify(userWithToken))

      // Set axios default headers with token
      axios.defaults.headers.common["Authorization"] = `Bearer ${userWithToken.token}`

      return userData
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed"
      throw new Error(message)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    delete axios.defaults.headers.common["Authorization"]

    // Redirect to login page
    window.location.href = "/auth/login"
  }

  // Forgot password function
  const forgotPassword = async (email: string) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email })

      // This API will fail as per requirements
      // We'll never reach this point, but we'll handle it anyway
      toast({
        title: "Success",
        description: "Password reset instructions sent to your email",
      })
    } catch (error: any) {
      // Show toast error as per requirements
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset password. Please try again later.",
      })

      throw new Error("Failed to reset password")
    }
  }

  // Auth context value
  const value = {
    user,
    isLoading,
    register,
    login,
    logout,
    forgotPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
