import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token')
    }
    return Promise.reject(err)
  }
)

export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
}

export const labsAPI = {
  getAll: (params) => api.get('/labs', { params }),
  create: (data) => api.post('/labs', data),
  update: (id, data) => api.put(`/labs/${id}`, data),
  delete: (id) => api.delete(`/labs/${id}`),
}

export const certsAPI = {
  getAll: () => api.get('/certifications'),
  create: (data) => api.post('/certifications', data),
  update: (id, data) => api.put(`/certifications/${id}`, data),
}

export const contactAPI = {
  send: (data) => api.post('/contact', data),
}

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
}

export const adminAPI = {
  getMessages: () => api.get('/admin/messages'),
  markRead: (id) => api.put(`/admin/messages/${id}/read`),
  getStats: () => api.get('/stats'),
}

export default api
