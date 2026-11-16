import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Database, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  Video, 
  MessageCircle, 
  RefreshCw, 
  AlertCircle, 
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { CitaInput, CitaRecord, ModalidadCita } from '../types';
import { 
  SUPABASE_URL, 
  SUPABASE_TABLE, 
  saveCitaToSupabase, 
  fetchCitas 
} from '../lib/supabase';
import { STORE_INFO } from '../data/extras';
import { generateCitaWhatsAppUrl } from '../utils/whatsapp';

const SERVICES = [
  {
    id: 'cata-nicho',
    name: 'Cata Olfativa de Perfumes de Autor & Nicho',
    duration: '45 minutos',
    tag: 'Recomendado',
    description: 'Degustación guiada de acordes florales de Grasse, oud real y maderas nobles seleccionados especialmente para tu perfil.'
  },
  {
    id: 'perfume-insignia',
    name: 'Asesoría para Encontrar tu Perfume Insignia',
    duration: '30 minutos',
    tag: 'Personalizada',
    description: 'Diagnóstico olfativo de tu química dérmica y estilo de vida para elegir la fragancia que se convertirá en tu firma personal.'
  },
  {
    id: 'ritual-attars',
    name: 'Ritual de Attars & Elixires Concentrados Árabes',
    duration: '40 minutos',
    tag: 'Exclusivo',
    description: 'Aplicación sensorial de extractos al óleo sin alcohol, azafrán persa y resinas milenarias de alta longevidad.'
  },
  {
    id: 'novios-aniversario',
    name: 'Sesión VIP para Novios, Bodas & Aniversarios',
    duration: '60 minutos',
    tag: 'Parejas',
    description: 'Curaduría de fragancias complementarias para novios o parejas en fechas conmemorativas memorables.'
  },
  {
    id: 'regalos-corporativos',
    name: 'Diseño de Cofres de Regalo & Presentaciones de Lujo',
    duration: '30 minutos',
    tag: 'Obsequios',
    description: 'Personalización de estuches rígidos, decants de cristal y dedicatorias caligrafiadas para obsequios únicos.'
  }
];

const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '03:00 PM',
  '04:30 PM',
  '06:00 PM',
  '07:15 PM'
];

export const CitasSection: React.FC = () => {
  // Form State
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [fecha, setFecha] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [hora, setHora] = useState(TIME_SLOTS[1]);
  const [servicio, setServicio] = useState(SERVICES[0].name);
  const [modalidad, setModalidad] = useState<ModalidadCita>('Presencial (Boutique Juliaca)');
  const [mensaje, setMensaje] = useState('');

  // UI / Submission state
  const [isLoading, setIsLoading] = useState(false);
  const [submittedCita, setSubmittedCita] = useState<{
    code: string;
    record: CitaInput;
    savedInSupabase: boolean;
    errorMsg?: string;
  } | null>(null);

  // Appointments List View
  const [showAppointmentsList, setShowAppointmentsList] = useState(false);
  const [appointmentsList, setAppointmentsList] = useState<CitaRecord[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // Load appointments from Supabase on mount
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoadingList(true);
    const res = await fetchCitas();
    setAppointmentsList(res.data);
    setLoadingList(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim() || !fecha || !hora) {
      return;
    }

    setIsLoading(true);

    const citaInput: CitaInput = {
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      email: email.trim() || undefined,
      fecha,
      hora,
      servicio,
      modalidad,
      mensaje: mensaje.trim() || undefined
    };

    // Save to Supabase 'citas' table
    const result = await saveCitaToSupabase(citaInput);

    setIsLoading(false);

    setSubmittedCita({
      code: result.code,
      record: citaInput,
      savedInSupabase: result.success,
      errorMsg: result.error
    });

    // Refresh list
    loadAppointments();
  };

  const handleResetForm = () => {
    setSubmittedCita(null);
    setMensaje('');
  };

  // Min date is today
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <section id="citas" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-stone-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#8C6D23] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atención Privada & Asesoría Olfativa</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-medium text-stone-900 leading-tight">
            Reserva tu Cita en la <span className="italic text-[#8C6D23]">Boutique</span>
          </h2>

          <p className="text-stone-600 text-xs sm:text-sm mt-3 leading-relaxed">
            Vive una experiencia sensorial exclusiva con Esther Cruz Velásquez. Descubre las notas que armonizan con tu esencia en una sesión privada presencial en Juliaca o virtual.
          </p>

          {/* Supabase Integration Live Badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-[11px] text-stone-600 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <Database className="w-3.5 h-3.5 text-[#8C6D23]" />
            <span>Conectado a <strong>Supabase</strong> · Tabla: <code className="bg-stone-100 text-stone-800 px-1 py-0.5 rounded font-mono font-semibold">{SUPABASE_TABLE}</code></span>
          </div>
        </div>

        {/* Success Confirmation Card */}
        {submittedCita ? (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-xl text-left space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-emerald-700 block">
                  {submittedCita.savedInSupabase 
                    ? '¡Reserva Guardada con Éxito en Supabase!' 
                    : '¡Cita Registrada en Agenda!'}
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-stone-900">
                  Cita Confirmada #{submittedCita.code}
                </h3>
              </div>
            </div>

            {/* Supabase status notice */}
            {submittedCita.savedInSupabase ? (
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  Los datos de tu reserva han sido insertados correctamente en la tabla <strong>{SUPABASE_TABLE}</strong> de Supabase (<code className="text-[10px]">zkkjokipjtpkvvefnxxz.supabase.co</code>).
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Reserva guardada localmente con código #{submittedCita.code}</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Notificación del servidor: {submittedCita.errorMsg || 'Pendiente de sincronización'}. Tu cita no se ha perdido; presiona el botón inferior para enviarla directo a Esther por WhatsApp.
                  </p>
                </div>
              </div>
            )}

            {/* Appointment Details Summary */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200 text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <span className="text-stone-500">Cliente:</span>
                <span className="font-bold text-stone-900">{submittedCita.record.nombre}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-500">WhatsApp / Teléfono:</span>
                <span className="font-medium text-stone-800">{submittedCita.record.telefono}</span>
              </div>

              {submittedCita.record.email && (
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Correo Electrónico:</span>
                  <span className="font-medium text-stone-800">{submittedCita.record.email}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-stone-500">Servicio Seleccionado:</span>
                <span className="font-semibold text-[#8C6D23]">{submittedCita.record.servicio}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-500">Modalidad:</span>
                <span className="font-medium text-stone-800">{submittedCita.record.modalidad}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                <span className="text-stone-500">Fecha y Horario:</span>
                <span className="font-bold text-stone-900 text-sm">
                  📅 {submittedCita.record.fecha} — ⏰ {submittedCita.record.hora}
                </span>
              </div>

              {submittedCita.record.mensaje && (
                <div className="pt-2 border-t border-stone-200 text-stone-600">
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Notas aromáticas:</span>
                  <p className="italic mt-0.5">"{submittedCita.record.mensaje}"</p>
                </div>
              )}
            </div>

            {/* Direct WhatsApp Confirmation Button */}
            <div className="space-y-3 pt-2">
              <a
                href={generateCitaWhatsAppUrl({
                  code: submittedCita.code,
                  nombre: submittedCita.record.nombre,
                  telefono: submittedCita.record.telefono,
                  fecha: submittedCita.record.fecha,
                  hora: submittedCita.record.hora,
                  servicio: submittedCita.record.servicio,
                  modalidad: submittedCita.record.modalidad,
                  mensaje: submittedCita.record.mensaje
                })}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Confirmar esta Cita por WhatsApp (+51 999 199 969)</span>
              </a>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full sm:flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors"
                >
                  Agendar Otra Cita
                </button>

                <button
                  type="button"
                  onClick={() => setShowAppointmentsList(true)}
                  className="w-full sm:flex-1 py-2.5 px-4 border border-stone-300 hover:border-stone-400 text-stone-700 text-xs font-medium rounded-xl transition-colors"
                >
                  Ver Citas Registradas ({appointmentsList.length})
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Main Interactive Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start text-left">
            
            {/* Left Column: Experience Details & Modality */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8C6D23] block">
                  Experiencias Olfativas
                </span>
                <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
                  ¿En qué consiste tu cita privada?
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  A diferencia de una tienda convencional, en nuestra boutique te recibimos con una cata privada donde podrás degustar extractos puros sin prisa, aprender sobre las familias olfativas y descubrir la fragancia que se adapta a tu química dérmica.
                </p>

                <div className="pt-2 space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                    <MapPin className="w-5 h-5 text-[#8C6D23] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">Modalidad Presencial</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        En nuestra boutique de Juliaca: {STORE_INFO.address}. Copas de cata y muestras en piel.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                    <Video className="w-5 h-5 text-[#8C6D23] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">Modalidad Virtual</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Por videollamada de WhatsApp o Google Meet para clientes en Lima, Cusco, Arequipa o todo el Perú.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Sin costo de reserva</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAppointmentsList(!showAppointmentsList)}
                    className="text-[#8C6D23] hover:underline font-semibold"
                  >
                    {showAppointmentsList ? 'Ocultar Citas' : `Ver Citas (${appointmentsList.length})`}
                  </button>
                </div>
              </div>

              {/* Quick Supabase Diagnostics Card */}
              <div className="bg-stone-900 text-stone-300 p-5 rounded-3xl border border-stone-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-[#D4AF37]" />
                    <span>Integración Supabase</span>
                  </span>
                  <span className="text-[10px] bg-stone-800 text-[#D4AF37] px-2 py-0.5 rounded-full font-mono">
                    Activa
                  </span>
                </div>
                <div className="text-[11px] space-y-1 text-stone-400 font-mono">
                  <p className="truncate">URL: {SUPABASE_URL}</p>
                  <p>Tabla: {SUPABASE_TABLE}</p>
                </div>
                <p className="text-[10px] text-stone-400 font-sans pt-1 border-t border-stone-800">
                  Cada cita completada se guarda de manera segura en tu base de datos Supabase y genera un respaldo en WhatsApp.
                </p>
              </div>

            </div>

            {/* Right Column: Appointment Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200/90 shadow-md">
              
              <div className="mb-6">
                <h3 className="font-serif-luxury text-2xl font-bold text-stone-900">
                  Formulario de Reserva de Cita
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Completa los datos para agendar tu horario en la tabla <span className="font-semibold text-stone-700">citas</span> de Supabase.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* 1. Modalidad */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                    1. Modalidad de la Cita *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setModalidad('Presencial (Boutique Juliaca)')}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        modalidad === 'Presencial (Boutique Juliaca)'
                          ? 'border-[#D4AF37] bg-amber-50/40 ring-1 ring-[#D4AF37]'
                          : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-700'
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-[#8C6D23] shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">Presencial en Juliaca</span>
                        <span className="text-[10px] text-stone-500">Jr. Mariano Núñez 412</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalidad('Virtual (Videollamada / WhatsApp)')}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        modalidad === 'Virtual (Videollamada / WhatsApp)'
                          ? 'border-[#D4AF37] bg-amber-50/40 ring-1 ring-[#D4AF37]'
                          : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-700'
                      }`}
                    >
                      <Video className="w-4 h-4 text-[#8C6D23] shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">Virtual (Nacional)</span>
                        <span className="text-[10px] text-stone-500">Videollamada guiada</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Servicio */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                    2. Experiencia o Servicio *
                  </label>
                  <div className="space-y-2">
                    {SERVICES.map((s) => (
                      <label
                        key={s.id}
                        className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                          servicio === s.name
                            ? 'border-[#D4AF37] bg-[#FAF8F5] ring-1 ring-[#D4AF37]'
                            : 'border-stone-200 bg-stone-50 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="servicio"
                              value={s.name}
                              checked={servicio === s.name}
                              onChange={() => setServicio(s.name)}
                              className="text-[#D4AF37] focus:ring-[#D4AF37]"
                            />
                            <span className="text-xs font-bold text-stone-900">
                              {s.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-500 font-mono">
                            {s.duration}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1 pl-6">
                          {s.description}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 3. Fecha y Hora */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#8C6D23]" />
                      <span>3. Fecha Deseada *</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8C6D23]" />
                      <span>Horario Disponible *</span>
                    </label>
                    <select
                      value={hora}
                      onChange={(e) => setHora(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. Datos del Cliente */}
                <div className="space-y-3 pt-1">
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider">
                    4. Tus Datos de Contacto *
                  </label>

                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombres y Apellidos Completos *"
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                      />
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="WhatsApp / Teléfono (+51) *"
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                      />
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>

                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo Electrónico (Opcional)"
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                      />
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <textarea
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      placeholder="Preferencias olfativas previas o notas especiales (ej. 'Busco un aroma amaderado con oud para uso nocturno')..."
                      rows={2}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37] resize-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white text-xs sm:text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                        <span>Guardando reserva en Supabase (tabla citas)...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#D4AF37]" />
                        <span>Confirmar Reserva de Cita en Supabase</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-stone-400 mt-2">
                    Tus datos se transmiten con cifrado seguro a Supabase.
                  </p>
                </div>

              </form>

            </div>

          </div>
        )}

        {/* View / Manage Appointments Drawer / List */}
        {showAppointmentsList && (
          <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-left">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-[#8C6D23]" />
                <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
                  Citas Registradas en la Boutique
                </h3>
                <span className="text-xs bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full font-medium">
                  {appointmentsList.length} en total
                </span>
              </div>

              <button
                type="button"
                onClick={loadAppointments}
                disabled={loadingList}
                className="flex items-center gap-1.5 text-xs text-[#8C6D23] hover:underline font-medium"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingList ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
            </div>

            {appointmentsList.length === 0 ? (
              <div className="py-10 text-center text-xs text-stone-400">
                No hay citas agendadas todavía. Sé el primero en reservar una sesión olfativa.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
                {appointmentsList.map((c, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 font-serif-luxury text-sm">
                        {c.nombre}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-semibold uppercase">
                        {c.estado || 'Pendiente'}
                      </span>
                    </div>

                    <div className="text-stone-600 space-y-1">
                      <p className="font-semibold text-[#8C6D23]">{c.servicio}</p>
                      <p className="text-[11px] text-stone-500">
                        📅 {c.fecha} — ⏰ {c.hora}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        📍 {c.modalidad}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        📱 {c.telefono} {c.email ? `· ${c.email}` : ''}
                      </p>
                    </div>

                    {c.mensaje && (
                      <p className="text-[11px] text-stone-500 italic pt-1 border-t border-stone-200">
                        "{c.mensaje}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
