import api from './api'

export const login = (credentials) => api.post('/api/login', credentials)

export const logout = () => api.post('/api/logout')

export const getUser = () => api.get('/api/user')
