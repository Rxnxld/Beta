import api from './api'

export const list = (params) => api.get('/api/categorias', { params })
export const create = (data) => api.post('/api/categorias', data)
export const update = (id, data) => api.put(`/api/categorias/${id}`, data)
export const remove = (id) => api.delete(`/api/categorias/${id}`)
