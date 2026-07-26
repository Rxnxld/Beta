import api from './api'

export const list = (params) => api.get('/clientes/', { params })

export const getById = (id) => api.get(`/clientes/${id}/`)

export const create = (data) => api.post('/clientes/', data)

export const update = (id, data) => api.put(`/clientes/${id}/`, data)

export const remove = (id) => api.delete(`/clientes/${id}/`)

export const historialCompras = (id) => api.get(`/clientes/${id}/compras/`)

export const historialPagos = (id) => api.get(`/clientes/${id}/pagos/`)

export const historialDeudas = (id) => api.get(`/clientes/${id}/deudas/`)
