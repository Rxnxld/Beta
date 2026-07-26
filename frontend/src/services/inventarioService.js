import api from './api'

export const entrada = (data) => api.post('/inventario/entrada/', data)

export const salida = (data) => api.post('/inventario/salida/', data)

export const historial = (params) => api.get('/inventario/historial/', { params })
