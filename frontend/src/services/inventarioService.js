import api from './api'

export const entrada = (data) => api.post('/api/inventario/entrada', data)

export const salida = (data) => api.post('/api/inventario/salida', data)

export const historial = (params) => api.get('/api/inventario/historial', { params })
