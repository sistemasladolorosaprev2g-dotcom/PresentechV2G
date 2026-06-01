import { api } from './api'

export async function obtenerDashboardAdmin() {
  const response = await api.get('/dashboard')
  return response.data
}

export async function obtenerDashboardProfesor() {
  const response = await api.get('/dashboard')
  return response.data
}
