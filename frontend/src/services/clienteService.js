import api from './api'

export const list = (params) => api.get('/api/clientes', { params })

export const getById = (id) => api.get(`/api/clientes/${id}`)

export const create = (data) => api.post('/api/clientes', data)

export const update = (id, data) => api.put(`/api/clientes/${id}`, data)

export const remove = (id) => api.delete(`/api/clientes/${id}`)

export const historialCompras = (id) => api.get(`/api/clientes/${id}/historial-compras`)

export const historialPagos = (id) => api.get(`/api/clientes/${id}/historial-pagos`)

export const historialDeudas = (id) => api.get(`/api/clientes/${id}/historial-deudas`)
