import api from './api'

export const list = (params) => api.get('/ventas/', { params })

export const create = (data) => api.post('/ventas/', data)

export const getById = (id) => api.get(`/ventas/${id}/`)

export const anular = (id) => api.post(`/ventas/${id}/anular/`)

export const generarPdf = (id) => api.get(`/ventas/${id}/pdf/`, { responseType: 'blob' })
