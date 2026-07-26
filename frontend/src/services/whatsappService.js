import api from './api'

export const enviar = (data) => api.post('/whatsapp/enviar/', data)

export const enviarFactura = (data) => api.post('/whatsapp/enviar-factura/', data)

export const enviarRecordatorio = (data) => api.post('/whatsapp/enviar-recordatorio/', data)

export const enviarPromocion = (data) => api.post('/whatsapp/enviar-promocion/', data)
