import api from './api'

export const list = (params) => api.get('/api/cuentas-cobrar', { params })

export const getById = (id) => api.get(`/api/cuentas-cobrar/${id}`)

export const create = (data) => api.post('/api/cuentas-cobrar', data)

export const porCliente = (id) => api.get(`/api/cuentas-cobrar/cliente/${id}`)
