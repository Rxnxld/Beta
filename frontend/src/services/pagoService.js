import api from './api'

export const list = (params) => api.get('/pagos/', { params })

export const create = (data) => api.post('/pagos/', data)

export const porCuenta = (id) => api.get(`/pagos/por-cuenta/${id}/`)
