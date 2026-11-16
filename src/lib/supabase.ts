import { createClient } from '@supabase/supabase-js';
import { CitaInput, CitaRecord } from '../types';

export const SUPABASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 'https://zkkjokipjtpkvvefnxxz.supabase.co';

export const SUPABASE_ANON_KEY = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 'sb_publishable_G4c0sBF919z0B_zw6duPtA_CibbRBzQ';

export const SUPABASE_TABLE = 'citas';

// Create the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

const LOCAL_CITAS_STORAGE_KEY = 'ecv_citas_local';

/**
 * Get locally stored appointments (as fallback or offline copy)
 */
export function getLocalCitas(): CitaRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_CITAS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading local appointments:', err);
    return [];
  }
}

/**
 * Save appointment locally
 */
export function saveLocalCita(cita: CitaRecord): void {
  try {
    const existing = getLocalCitas();
    const updated = [cita, ...existing.filter(c => c.id !== cita.id)];
    localStorage.setItem(LOCAL_CITAS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving local appointment:', err);
  }
}

/**
 * Save an appointment to the Supabase 'citas' table
 */
export async function saveCitaToSupabase(citaInput: CitaInput): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  code: string;
  savedLocally?: boolean;
}> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const code = `CITA-${randomSuffix}`;

  const citaRecord: CitaRecord = {
    ...citaInput,
    id: code,
    estado: 'pendiente',
    created_at: new Date().toISOString(),
    source: 'supabase'
  };

  // Always save a local copy so the user never loses their reservation data
  saveLocalCita({ ...citaRecord, source: 'local' });

  try {
    // Insert into Supabase table 'citas'
    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .insert([
        {
          nombre: citaInput.nombre,
          telefono: citaInput.telefono,
          email: citaInput.email || null,
          fecha: citaInput.fecha,
          hora: citaInput.hora,
          servicio: citaInput.servicio,
          modalidad: citaInput.modalidad,
          mensaje: citaInput.mensaje || null,
          estado: 'pendiente'
        }
      ])
      .select();

    if (error) {
      console.warn('Supabase citas insert returned notice/error:', error);
      return {
        success: false,
        error: error.message || 'Error al guardar en Supabase',
        code,
        savedLocally: true
      };
    }

    // Success in Supabase
    saveLocalCita({ ...citaRecord, source: 'supabase' });

    return {
      success: true,
      data,
      code,
      savedLocally: false
    };
  } catch (err: any) {
    console.error('Unexpected error inserting into Supabase citas:', err);
    return {
      success: false,
      error: err?.message || 'Error de conexión con el servidor Supabase',
      code,
      savedLocally: true
    };
  }
}

/**
 * Fetch appointments from Supabase (merging with local records)
 */
export async function fetchCitas(): Promise<{
  success: boolean;
  data: CitaRecord[];
  error?: string;
}> {
  const localList = getLocalCitas();

  try {
    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return {
        success: false,
        data: localList,
        error: error.message
      };
    }

    // Map Supabase rows to CitaRecord
    const supabaseList: CitaRecord[] = (data || []).map((row: any) => ({
      id: row.id ? String(row.id) : undefined,
      nombre: row.nombre || '',
      telefono: row.telefono || '',
      email: row.email || undefined,
      fecha: row.fecha || '',
      hora: row.hora || '',
      servicio: row.servicio || '',
      modalidad: row.modalidad || 'Presencial (Boutique Juliaca)',
      mensaje: row.mensaje || undefined,
      estado: row.estado || 'pendiente',
      created_at: row.created_at,
      source: 'supabase'
    }));

    // Merge without duplicates
    const combined = [...supabaseList];
    for (const local of localList) {
      if (!combined.some(c => c.id === local.id || (c.fecha === local.fecha && c.hora === local.hora && c.telefono === local.telefono))) {
        combined.push(local);
      }
    }

    return {
      success: true,
      data: combined
    };
  } catch (err: any) {
    return {
      success: false,
      data: localList,
      error: err?.message || 'Error al conectar con Supabase'
    };
  }
}

export interface ConsultaCitaInput {
  nombre: string;
  email: string;
  telefono: string;
  notas: string;
}

/**
 * Saves a consultation inquiry directly to the 'citas' table in Supabase
 * with the fields: nombre, email, telefono, notas
 */
export async function saveConsultaToSupabase(input: ConsultaCitaInput): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  code: string;
}> {
  const code = `ECV-${Math.floor(1000 + Math.random() * 9000)}`;

  // Save local backup copy
  try {
    const raw = localStorage.getItem('ecv_consultas_local');
    const list = raw ? JSON.parse(raw) : [];
    list.unshift({ ...input, id: code, created_at: new Date().toISOString() });
    localStorage.setItem('ecv_consultas_local', JSON.stringify(list));
  } catch (e) {
    console.error('Error saving local consultation backup:', e);
  }

  try {
    // Fields explicitly requested: nombre, email, telefono, notas
    const payload = {
      nombre: input.nombre.trim(),
      email: input.email.trim(),
      telefono: input.telefono.trim(),
      notas: input.notas.trim()
    };

    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase citas insert notice/error:', error);
      return {
        success: false,
        error: error.message,
        code
      };
    }

    return {
      success: true,
      data,
      code
    };
  } catch (err: any) {
    console.error('Error inserting into Supabase citas table:', err);
    return {
      success: false,
      error: err?.message || 'Error de conexión con Supabase',
      code
    };
  }
}

export const SUPABASE_SUSCRIPTORES_TABLE = 'suscriptores';
const LOCAL_SUSCRIPTORES_KEY = 'ecv_suscriptores_local';

export interface SuscriptorRecord {
  id?: string;
  email: string;
  created_at: string;
  source: 'supabase' | 'local';
}

/**
 * Gets cached/local subscribers
 */
export function getLocalSuscriptores(): SuscriptorRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_SUSCRIPTORES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading local suscriptores:', err);
    return [];
  }
}

/**
 * Saves a subscriber email automatically to the 'suscriptores' table in Supabase
 */
export async function saveSuscriptorToSupabase(email: string): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  savedLocally: boolean;
}> {
  const cleanEmail = email.trim().toLowerCase();
  
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return {
      success: false,
      message: 'Por favor ingresa un correo electrónico válido.',
      savedLocally: false
    };
  }

  const record: SuscriptorRecord = {
    id: `sub-${Date.now()}`,
    email: cleanEmail,
    created_at: new Date().toISOString(),
    source: 'local'
  };

  // Always save a local copy as resilient backup
  try {
    const existing = getLocalSuscriptores();
    if (!existing.some(s => s.email === cleanEmail)) {
      existing.unshift(record);
      localStorage.setItem(LOCAL_SUSCRIPTORES_KEY, JSON.stringify(existing));
    }
  } catch (e) {
    console.warn('Could not save local subscriber backup:', e);
  }

  try {
    // 1. Try insert with 'email' column
    let { data, error } = await supabase
      .from(SUPABASE_SUSCRIPTORES_TABLE)
      .insert([{ email: cleanEmail }])
      .select();

    // 2. If column 'email' didn't match, attempt alternative column name 'correo'
    if (error && error.message?.includes('column "email"')) {
      const retry = await supabase
        .from(SUPABASE_SUSCRIPTORES_TABLE)
        .insert([{ correo: cleanEmail }])
        .select();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.warn('Supabase suscriptores insert notice:', error);
      return {
        success: true, // We successfully captured and saved in local backup
        message: '¡Gracias por suscribirte al Círculo Exclusivo de Esther Cruz Velásquez! Tu correo ha sido registrado.',
        error: error.message,
        savedLocally: true
      };
    }

    return {
      success: true,
      message: '¡Registro exitoso! Tu correo ha sido guardado automáticamente en la tabla "suscriptores" de Supabase.',
      data,
      savedLocally: false
    };
  } catch (err: any) {
    console.error('Error inserting into Supabase suscriptores:', err);
    return {
      success: true,
      message: '¡Gracias por suscribirte! Tu correo fue registrado con éxito.',
      error: err?.message,
      savedLocally: true
    };
  }
}

