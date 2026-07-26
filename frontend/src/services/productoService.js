import api from './api'

export const list = (params) => api.get('/api/productos', { params })

export const getById = (id) => api.get(`/api/productos/${id}`)

export const create = (data) => api.post('/api/productos', data)

export const update = (id, data) => api.put(`/api/productos/${id}`, data)

export const remove = (id) => api.delete(`/api/productos/${id}`)

export const bajoStock = () => api.get('/api/productos/bajo-stock')

export const movimientos = (id) => api.get(`/api/productos/${id}/movimientos`)
