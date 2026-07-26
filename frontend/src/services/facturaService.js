import api from './api'

export const list = (params) => api.get('/api/facturas', { params })

export const getById = (id) => api.get(`/api/facturas/${id}`)

export const generarPdf = (id) => api.get(`/api/facturas/${id}/pdf`, { responseType: 'blob' })
