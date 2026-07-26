import api from './api'

export const list = (params) => api.get('/categorias', { params })
export const create = (data) => api.post('/categorias', data)
export const update = (id, data) => api.put(`/categorias/${id}`, data)
export const remove = (id) => api.delete(`/categorias/${id}`)
