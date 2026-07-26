import api from './api'

export const consultar = (pregunta) => api.post('/ai/consultar/', { pregunta })
