import api from './api'

export const list = (params) => api.get('/facturas/', { params })

export const getById = (id) => api.get(`/facturas/${id}/`)

export const generarPdf = (id) => api.get(`/facturas/${id}/pdf/`, { responseType: 'blob' })
