import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies (access_token)
})

// Request interceptor - add auth token or other headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Token is handled via httpOnly cookies, but you can add other headers here
    // Example: config.headers['X-Custom-Header'] = 'value'
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login or refresh token
      console.error('Unauthorized access - please login')
      // You might want to trigger logout here
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden')
    } else if (error.response?.status === 500) {
      // Server error
      console.error('Server error occurred')
    }
    
    return Promise.reject(error)
  }
)

