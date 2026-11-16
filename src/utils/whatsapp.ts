import { STORE_INFO } from '../data/extras';
import { CartItem } from '../types';

export interface WhatsAppOrderParams {
  productName: string;
  sizeName: string;
  price: number;
  giftWrap: boolean;
  giftMessage?: string;
  deliveryCity: string;
}

export function generateProductWhatsAppUrl(params: WhatsAppOrderParams): string {
  const message = 
`¡Hola Esther Cruz Velásquez! ✨ Quisiera realizar un pedido de perfumería:
Producto: ${params.productName} (${params.sizeName})
Precio: S/ ${params.price.toFixed(2)}
Empaque de regalo: ${params.giftWrap ? 'Sí' : 'No'}
Mensaje especial: ${params.giftMessage && params.giftMessage.trim() ? params.giftMessage.trim() : 'Sin dedicatoria'}
Ciudad de entrega: ${params.deliveryCity && params.deliveryCity.trim() ? params.deliveryCity.trim() : 'Juliaca'}
¿Podrían confirmarme el stock y métodos de pago?`;

  return `https://wa.me/${STORE_INFO.phoneClean}?text=${encodeURIComponent(message)}`;
}

export function generateCartWhatsAppUrl(items: CartItem[], total: number, deliveryCity: string, notes?: string): string {
  const itemsText = items.map(item => 
    `• ${item.product.name} (${item.selectedSize}) x${item.quantity} = S/ ${(item.price * item.quantity).toFixed(2)}${item.giftWrap ? ' [🎁 Con empaque de regalo]' : ''}`
  ).join('\n');

  const message = 
`¡Hola Esther Cruz Velásquez! ✨ Quisiera realizar un pedido con mi carrito de compras:

${itemsText}

Total estimado: S/ ${total.toFixed(2)}
Ciudad de entrega: ${deliveryCity || 'Juliaca'}
${notes ? `Nota especial: ${notes}\n` : ''}
¿Podrían confirmarme la disponibilidad para coordinar el pago por Yape/Plin/Transferencia y los datos de envío? ¡Muchas gracias!`;

  return `https://wa.me/${STORE_INFO.phoneClean}?text=${encodeURIComponent(message)}`;
}

export function generateInquiryWhatsAppUrl(subject?: string): string {
  const text = subject
    ? `¡Hola Esther Cruz Velásquez! ✨ Deseo recibir asesoría personalizada sobre: ${subject}`
    : `¡Hola Esther Cruz Velásquez! ✨ Me gustaría recibir asesoría olfativa para elegir la fragancia ideal. ¿Podrían orientarme?`;
  return `https://wa.me/${STORE_INFO.phoneClean}?text=${encodeURIComponent(text)}`;
}

export function generateCitaWhatsAppUrl(params: {
  code: string;
  nombre: string;
  telefono: string;
  fecha: string;
  hora: string;
  servicio: string;
  modalidad: string;
  mensaje?: string;
}): string {
  const message =
`¡Hola Esther Cruz Velásquez! ✨ He registrado una Cita Olfativa en la tienda:
Código de Reserva: #${params.code}
Cliente: ${params.nombre}
WhatsApp: ${params.telefono}
Servicio: ${params.servicio}
Modalidad: ${params.modalidad}
Fecha y Hora: ${params.fecha} a las ${params.hora}
${params.mensaje ? `Notas aromáticas: ${params.mensaje}\n` : ''}
¿Podrían confirmarme la agenda en la boutique? ¡Muchas gracias!`;

  return `https://wa.me/${STORE_INFO.phoneClean}?text=${encodeURIComponent(message)}`;
}

export function generatePaymentConfirmationWhatsAppUrl(params: {
  orderId: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  voucherNumber?: string;
  customerName?: string;
  customerPhone?: string;
  deliveryCity?: string;
  address?: string;
}): string {
  const itemsText = params.items.map(it => 
    `• ${it.product.name} (${it.selectedSize}) x${it.quantity} — S/ ${(it.price * it.quantity).toFixed(2)}`
  ).join('\n');

  const message = 
`¡Hola Esther Cruz Velásquez! ✨ Acabo de realizar el pago de mi pedido:
📦 Orden: #${params.orderId}
👤 Cliente: ${params.customerName || 'Cliente Esther Cruz Velásquez'}
📱 WhatsApp: ${params.customerPhone || 'Por coordinar'}
💳 Método de Pago: ${params.paymentMethod.toUpperCase()}
💰 Total Pagado: S/ ${params.total.toFixed(2)}
${params.voucherNumber ? `🔖 N° de Operación / Voucher: ${params.voucherNumber}\n` : ''}📍 Destino: ${params.deliveryCity || 'Juliaca, Puno, Perú'}${params.address ? ` (${params.address})` : ''}

🛍️ Fragancias seleccionadas:
${itemsText}

Adjunto captura/comprobante para iniciar la preparación y empaque de lujo. ¡Muchas gracias!`;

  return `https://wa.me/${STORE_INFO.phoneClean}?text=${encodeURIComponent(message)}`;
}

