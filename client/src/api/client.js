import axios from 'axios'

const resolveApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL

  if (!apiUrl) {
    return 'http://localhost:4000/api'
  }

  const normalizedUrl = apiUrl.replace(/\/$/, '')
  return normalizedUrl.endsWith('/api') ? normalizedUrl : `${normalizedUrl}/api`
}

export const apiClient = axios.create({
  baseURL: resolveApiUrl(),
})

export const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

export const getErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message ?? fallbackMessage
