import api from './api'

export const list = (params) => api.get('/api/ventas', { params })

export const create = (data) => api.post('/api/ventas', data)

export const getById = (id) => api.get(`/api/ventas/${id}`)

export const anular = (id) => api.put(`/api/ventas/${id}/anular`)

export const generarPdf = (id) => api.get(`/api/ventas/${id}/pdf`, { responseType: 'blob' })
