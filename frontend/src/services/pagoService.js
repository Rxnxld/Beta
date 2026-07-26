import api from './api'

export const list = (params) => api.get('/api/pagos', { params })

export const create = (data) => api.post('/api/pagos', data)

export const porCuenta = (id) => api.get(`/api/pagos/cuenta/${id}`)
