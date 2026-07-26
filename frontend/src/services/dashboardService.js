import api from './api'

export const getStats = () => api.get('/api/dashboard')

export const getCharts = () => api.get('/api/dashboard/charts')
