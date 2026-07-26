import api from './api'

export const list = () => api.get('/notificaciones/')

export const marcarLeido = (id) => api.post(`/notificaciones/${id}/leer/`)

export const marcarTodasLeidas = () => api.post('/notificaciones/leer-todas/')
