import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface LegalModalProps {
  type: 'privacidad' | 'terminos' | 'envios' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const contentMap = {
    privacidad: {
      title: 'Políticas de Privacidad y Tratamiento de Datos',
      updated: 'Octubre 2026',
      sections: [
        {
          heading: '1. Compromiso con tu Privacidad',
          body: 'En Esther Cruz Velásquez — Alta Perfumería valoramos la confidencialidad de nuestros clientes. Los datos personales que nos proporcionas (nombre, dirección de entrega, número de teléfono y correo electrónico) son utilizados exclusivamente para procesar tus compras, coordinar los envíos y mantenerte informado sobre el estado de tu pedido.'
        },
        {
          heading: '2. Seguridad en las Transacciones',
          body: 'No almacenamos datos sensibles de tarjetas de crédito o débito. Toda la pasarela de pagos cumple con cifrado SSL de 256 bits y los pagos por Yape o transferencias bancarias se validan directamente con comprobante oficial.'
        },
        {
          heading: '3. No Divulgación a Terceros',
          body: 'Bajo ninguna circunstancia comercializamos, alquilamos ni transferimos tus datos a empresas de publicidad de terceros. Tus datos de envío únicamente se comparten con couriers certificados (Olva Courier o Shalom) para efectos estrictos de entrega.'
        }
      ]
    },
    terminos: {
      title: 'Términos y Condiciones del Servicio',
      updated: 'Octubre 2026',
      sections: [
        {
          heading: '1. Autenticidad Garantizada',
          body: 'Garantizamos al 100% que todos los perfumes, extractos, attars y productos de perfumería son originales, importados y almacenados bajo condiciones óptimas de temperatura y penumbra para preservar la frescura de sus aceites esenciales.'
        },
        {
          heading: '2. Precios y Moneda',
          body: 'Todos los precios indicados en la tienda online están expresados en Soles Peruanos (S/) e incluyen los impuestos aplicables. Los precios pueden ser actualizados sin previo aviso, respetando siempre las compras ya confirmadas.'
        },
        {
          heading: '3. Atención al Cliente',
          body: 'Brindamos soporte directo e individualizado vía WhatsApp (+51 999 199 969) y correo (cruzvesther@gmail.com) para resolver cualquier consulta previa o posterior a la compra.'
        }
      ]
    },
    envios: {
      title: 'Políticas de Envíos, Entregas y Devoluciones',
      updated: 'Octubre 2026',
      sections: [
        {
          heading: '1. Envíos Locales (Juliaca y Puno)',
          body: 'En Juliaca y Puno disponemos de servicio express con entregas en 24 horas o el mismo día para pedidos coordinados antes del mediodía. Disponible modalidad contra entrega previa confirmación.'
        },
        {
          heading: '2. Envíos Nacionales a Todo el Perú',
          body: 'Despachamos hacia Arequipa, Cusco, Lima, Trujillo, Chiclayo y todas las provincias del país mediante agencias certificadas (Olva Courier y Shalom) con código de seguimiento en línea. El tiempo de tránsito habitual oscila entre 24 y 48 horas hábiles.'
        },
        {
          heading: '3. Envoltura de Regalo de Cortesía',
          body: 'Si solicitas empaque para regalo, preparamos tu pedido en caja rígida protegida, con papel de seda, lazo satinado y tarjeta con la dedicatoria que indiques en la tienda sin costo adicional.'
        },
        {
          heading: '4. Garantía de Entrega Intacta',
          body: 'Cada frasco viaja con triple capa de protección antigolpes. En el caso improbable de que un paquete sufra avería durante el traslado, gestionamos el reemplazo inmediato sin coste para el cliente previa fotografía del empaque.'
        }
      ]
    }
  };

  const current = contentMap[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto border border-stone-200 z-10 p-6 sm:p-8 text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D23] mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Información Legal · Actualizado {current.updated}</span>
        </div>

        <h3 className="font-serif-luxury text-2xl font-bold text-stone-900 mb-6">
          {current.title}
        </h3>

        <div className="space-y-5 text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
          {current.sections.map((sec, idx) => (
            <div key={idx} className="bg-stone-50 p-4 rounded-xl border border-stone-200">
              <h4 className="font-semibold text-stone-900 text-xs sm:text-sm mb-1.5">
                {sec.heading}
              </h4>
              <p className="text-stone-600">{sec.body}</p>
            </div>
          ))}
        </div>

        <div className="pt-6 mt-6 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Entendido y Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
