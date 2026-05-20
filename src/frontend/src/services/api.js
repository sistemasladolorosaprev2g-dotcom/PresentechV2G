import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('presentech_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export function getApiErrorMessage(error) {
  if (error.response?.data?.message) return error.response.data.message
  if (error.response?.data?.Message) return error.response.data.Message
  if (error.message) return error.message
  return 'No se pudo completar la solicitud.'
}

export function getApiData(response) {
  return response?.data ?? response?.Data ?? null
}
