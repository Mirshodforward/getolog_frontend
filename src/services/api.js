import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
})

// Add JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401/403 responses - redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_username')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Health Check - shorter timeout, won't block
export const checkHealth = () => api.get('/health', { timeout: 5000 })

// Stats
export const getGlobalStats = () => api.get('/stats/global')
export const getDashboardStats = () => api.get('/stats/dashboard')
export const getRecentActivity = (limit = 10) => api.get(`/stats/activity?limit=${limit}`)
export const getComprehensiveStats = () => api.get('/stats/comprehensive')

// Clients
export const getClients = (page = 1, limit = 20) => api.get(`/clients?page=${page}&limit=${limit}`)
export const searchClients = (query) => api.get(`/clients/search?query=${query}`)
export const getClientDetails = (userId) => api.get(`/clients/${userId}`)
export const updateClientBalance = (userId, amount, action) =>
  api.patch(`/clients/${userId}/balance`, { amount, action })

// Bots
export const getBots = (page = 1, limit = 20) => api.get(`/bots?page=${page}&limit=${limit}`)
export const getDeletedBots = (page = 1, limit = 20) => api.get(`/bots/deleted?page=${page}&limit=${limit}`)
export const getBotDetails = (botId) => api.get(`/bots/${botId}`)
export const startBot = (botId) => api.post(`/bots/${botId}/start`)
export const stopBot = (botId) => api.post(`/bots/${botId}/stop`)
export const deleteBot = (botId) => api.delete(`/bots/${botId}`)

// Users
export const getUsers = (page = 1, limit = 20, status = null, search = null, ownerUsername = null, sortBy = null, sortOrder = null) => {
  let url = `/users?page=${page}&limit=${limit}`
  if (status) url += `&status=${status}`
  if (search) url += `&search=${encodeURIComponent(search)}`
  if (ownerUsername) url += `&owner_username=${encodeURIComponent(ownerUsername)}`
  if (sortBy) url += `&sort_by=${sortBy}`
  if (sortOrder) url += `&sort_order=${sortOrder}`
  return api.get(url)
}
export const getUserDetails = (userId) => api.get(`/users/${userId}`)

// Transactions
export const getTransactions = (page = 1, limit = 20, status = null, role = null) => {
  let url = `/transactions?page=${page}&limit=${limit}`
  if (status) url += `&status=${status}`
  if (role) url += `&role=${role}`
  return api.get(url)
}

// Spendings
export const getSpendings = (page = 1, limit = 20, role = null) => {
  let url = `/spendings?page=${page}&limit=${limit}`
  if (role) url += `&role=${role}`
  return api.get(url)
}
export const getSpendingStats = () => api.get('/spendings/stats')

// Export
export const exportAllData = () => window.open(`${API_URL}/export/all`, '_blank')
export const exportClients = () => window.open(`${API_URL}/export/clients`, '_blank')
export const exportUsers = () => window.open(`${API_URL}/export/users`, '_blank')
export const exportBots = () => window.open(`${API_URL}/export/bots`, '_blank')
export const exportDeletedBots = () => window.open(`${API_URL}/export/deleted-bots`, '_blank')
export const exportTransactions = () => window.open(`${API_URL}/export/transactions`, '_blank')
export const exportSpendings = () => window.open(`${API_URL}/export/spendings`, '_blank')

export default api
