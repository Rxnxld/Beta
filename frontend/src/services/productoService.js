import api from './api'

export const list = (params) => api.get('/productos/', { params })

export const getById = (id) => api.get(`/productos/${id}/`)

export const create = (data) => api.post('/productos/', data)

export const update = (id, data) => api.put(`/productos/${id}/`, data)

export const remove = (id) => api.delete(`/productos/${id}/`)

export const bajoStock = () => api.get('/productos/bajo-stock/')

export const movimientos = (id) => api.get(`/productos/${id}/movimientos/`)
