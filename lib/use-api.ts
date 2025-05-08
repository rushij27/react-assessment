"use client"

import { useState } from "react"
import axios, { type AxiosRequestConfig } from "axios"

// API base URL
const API_BASE_URL = "https://second-brain-web.onrender.com/api"

// Custom hook for API calls
export function useApi<T = any>() {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // GET request
  const get = async (endpoint: string, config?: AxiosRequestConfig) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.get<T>(`${API_BASE_URL}${endpoint}`, config)
      setData(response.data)
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "An error occurred"
      const error = new Error(errorMessage)
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // POST request
  const post = async (endpoint: string, body: any, config?: AxiosRequestConfig) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post<T>(`${API_BASE_URL}${endpoint}`, body, config)
      setData(response.data)
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "An error occurred"
      const error = new Error(errorMessage)
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // PUT request
  const put = async (endpoint: string, body: any, config?: AxiosRequestConfig) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.put<T>(`${API_BASE_URL}${endpoint}`, body, config)
      setData(response.data)
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "An error occurred"
      const error = new Error(errorMessage)
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // DELETE request
  const del = async (endpoint: string, config?: AxiosRequestConfig) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.delete<T>(`${API_BASE_URL}${endpoint}`, config)
      setData(response.data)
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "An error occurred"
      const error = new Error(errorMessage)
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { data, error, isLoading, get, post, put, del }
}
