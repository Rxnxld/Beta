import api from './api'

export const getStats = () => api.get('/dashboard/stats/')

export const getCharts = () => api.get('/dashboard/charts/')
