import api from './api'

export const list = (params) => api.get('/cuentas/', { params })

export const getById = (id) => api.get(`/cuentas/${id}/`)

export const create = (data) => api.post('/cuentas/', data)

export const porCliente = (id) => api.get(`/cuentas/por-cliente/${id}/`)
