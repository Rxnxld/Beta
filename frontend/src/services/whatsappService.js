import api from './api'

export const enviar = (data) => api.post('/api/whatsapp/enviar', data)

export const enviarFactura = (data) => api.post('/api/whatsapp/enviar-factura', data)

export const enviarRecordatorio = (data) => api.post('/api/whatsapp/recordatorio', data)

export const enviarPromocion = (data) => api.post('/api/whatsapp/promocion', data)
