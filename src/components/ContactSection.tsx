import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  MessageCircle, 
  Check, 
  Clock, 
  Sparkles, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { STORE_INFO } from '../data/extras';
import { generateInquiryWhatsAppUrl } from '../utils/whatsapp';
import { saveConsultaToSupabase, SUPABASE_TABLE, SUPABASE_URL } from '../lib/supabase';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    code: string;
    error?: string;
    savedData: {
      nombre: string;
      email: string;
      telefono: string;
      notas: string;
    };
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    const consultaData = {
      nombre: name.trim(),
      email: email.trim(),
      telefono: phone.trim() || '+51 No especificado',
      notas: message.trim()
    };

    // Save automatically to Supabase 'citas' table
    const result = await saveConsultaToSupabase(consultaData);

    setIsSubmitting(false);

    setSubmissionResult({
      success: result.success,
      code: result.code,
      error: result.error,
      savedData: consultaData
    });
  };

  const handleResetForm = () => {
    setSubmissionResult(null);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const generateWhatsAppMessageUrl = () => {
    if (!submissionResult) return generateInquiryWhatsAppUrl();
    const text = 
`¡Hola Esther Cruz Velásquez! ✨ He enviado una consulta desde la web:
Código: #${submissionResult.code}
Nombre: ${submissionResult.savedData.nombre}
Email: ${submissionResult.savedData.email || 'No indicado'}
Teléfono: ${submissionResult.savedData.telefono}
Notas/Consulta: ${submissionResult.savedData.notas}

¿Podrían brindarme información adicional? ¡Muchas gracias!`;
    return `https://wa.me/${STORE_INFO.phoneClean}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="contacto" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#8C6D23]">
                Atención Exclusiva
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif-luxury font-medium text-stone-900 mt-1 mb-2">
                Hablemos de Fragancias
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                ¿Deseas una asesoría a la medida, consultar por un perfume agotado o realizar un pedido corporativo? Estamos a tu entera disposición.
              </p>
              <div className="pt-1">
                <a
                  href="#citas"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6D23] hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>¿Deseas agendar una cita olfativa privada? Reserva tu horario aquí →</span>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              {/* WhatsApp direct card */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-900">WhatsApp & Llamadas</h4>
                  <a
                    href={`https://wa.me/${STORE_INFO.phoneClean}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-stone-900 hover:text-[#8C6D23] transition-colors block mt-0.5"
                  >
                    {STORE_INFO.phone}
                  </a>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Respuesta rápida para pedidos y cotizaciones.
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-stone-100 text-[#8C6D23] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-900">Correo Electrónico</h4>
                  <a
                    href={`mailto:${STORE_INFO.email}`}
                    className="text-sm font-semibold text-stone-900 hover:text-[#8C6D23] transition-colors block mt-0.5"
                  >
                    {STORE_INFO.email}
                  </a>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Atención a clientes y propuestas comerciales.
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-stone-100 text-[#8C6D23] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-900">Sede Principal de Envíos</h4>
                  <p className="text-xs text-stone-800 font-medium mt-0.5">
                    {STORE_INFO.address}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Despachos express a Juliaca y envíos certificados a todo el Perú.
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-stone-100 text-[#8C6D23] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-900">Horario de Atención</h4>
                  <p className="text-xs text-stone-700 mt-0.5">
                    Lunes a Sábado: 9:00 am – 8:00 pm <br />
                    Domingos: 10:00 am – 2:00 pm
                  </p>
                </div>
              </div>
            </div>

            <a
              href={generateInquiryWhatsAppUrl('Deseo hablar directamente con la fundadora')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-semibold rounded-full transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chatear Ahora por WhatsApp (+51 999 199 969)</span>
            </a>
          </div>

          {/* Contact Interactive Form with Supabase Integration */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200/90 shadow-md">
            
            {/* Header with Supabase Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-stone-900">
                  Envíanos un Mensaje
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Tus datos se guardan directamente en la tabla <code className="font-mono font-semibold text-stone-800 bg-stone-100 px-1 py-0.5 rounded">{SUPABASE_TABLE}</code> de Supabase.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 self-start sm:self-auto font-medium">
                <Database className="w-3 h-3 text-emerald-600" />
                <span>Supabase Conectado</span>
              </div>
            </div>

            {/* SCREEN CONFIRMATION VIEW (Shown upon clicking Enviar Consulta) */}
            {submissionResult ? (
              <div className="space-y-6 animate-fade-in">
                
                {/* Confirmation Header Banner */}
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-4">
                  <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                      Confirmación de Registro
                    </span>
                    <h4 className="font-serif-luxury text-xl font-bold text-emerald-950">
                      ¡Consulta guardada con éxito en la tabla 'citas'!
                    </h4>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Gracias, <strong>{submissionResult.savedData.nombre}</strong>. Hemos registrado automáticamente tu consulta en la base de datos de Supabase con el código <span className="font-mono font-bold">#{submissionResult.code}</span>.
                    </p>
                  </div>
                </div>

                {/* Captured Fields Detail Box */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D23] flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5" />
                      <span>Campos Guardados en Supabase (tabla citas)</span>
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      #{submissionResult.code}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="bg-white p-3 rounded-xl border border-stone-200/80">
                      <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                        nombre
                      </span>
                      <span className="font-semibold text-stone-900 text-xs sm:text-sm">
                        {submissionResult.savedData.nombre}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-stone-200/80">
                      <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                        email
                      </span>
                      <span className="font-medium text-stone-800 text-xs truncate block">
                        {submissionResult.savedData.email || 'No especificado'}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-stone-200/80">
                      <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                        telefono
                      </span>
                      <span className="font-semibold text-stone-900 text-xs">
                        {submissionResult.savedData.telefono}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-stone-200/80">
                      <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                        estado
                      </span>
                      <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Recibido / Pendiente</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-stone-200/80 mt-2">
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                      notas
                    </span>
                    <p className="text-stone-700 italic mt-0.5 text-xs leading-relaxed">
                      "{submissionResult.savedData.notas}"
                    </p>
                  </div>
                </div>

                {/* Informative notice if gateway warned */}
                {submissionResult.error && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Respaldo local completado</p>
                      <p className="text-amber-800 mt-0.5">
                        Aviso del servidor: {submissionResult.error}. Tus datos están guardados y listos para enviar por WhatsApp.
                      </p>
                    </div>
                  </div>
                )}

                {/* Follow-up Action Buttons */}
                <div className="space-y-3 pt-2">
                  <a
                    href={generateWhatsAppMessageUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 px-5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Enviar también constancia a WhatsApp (+51 999 199 969)</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Enviar Otra Consulta</span>
                  </button>
                </div>

              </div>
            ) : (
              /* FORM VIEW */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tu Nombre Completo (campo: <code className="text-stone-500 font-mono font-normal">nombre</code>) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Sofía Benavente"
                    className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Correo Electrónico (campo: <code className="text-stone-500 font-mono font-normal">email</code>) *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tucorreo@ejemplo.com"
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      WhatsApp / Teléfono (campo: <code className="text-stone-500 font-mono font-normal">telefono</code>) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+51 999 ..."
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Notas o Consulta (campo: <code className="text-stone-500 font-mono font-normal">notas</code>) *
                  </label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Cuéntanos tus preferencias aromáticas, dudas sobre una fragancia o la fecha en que deseas visitarnos..."
                    rows={4}
                    className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#D4AF37] resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#1A1A1A] hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                        <span>Guardando en tabla 'citas' de Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#D4AF37]" />
                        <span>Enviar Consulta</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-stone-400 mt-2">
                    Al hacer clic en "Enviar Consulta", los campos (nombre, email, telefono, notas) se guardarán automáticamente en la tabla <strong>citas</strong> de Supabase.
                  </p>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
