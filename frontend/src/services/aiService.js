import api from './api'

export const consultar = (pregunta) => api.post('/api/ai/consultar', { pregunta })
