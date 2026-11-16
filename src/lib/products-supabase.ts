import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase';
import { Product } from '../types';
import { PRODUCTS_DATABASE } from '../data/products';

export interface SupabaseProductRow {
  id?: string | number;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  stock: number;
  categoria?: string;
  familia_olfativa?: string;
  concentracion?: string;
  rating?: number;
  review_count?: number;
  destacado?: boolean;
  created_at?: string;
}

export const PRODUCTS_TABLE = 'productos';
const LOCAL_SUPABASE_CACHE_KEY = 'ecv_supabase_products_cache';

/**
 * Gets cached products from localStorage if offline or while syncing
 */
export function getLocalCachedProducts(): SupabaseProductRow[] {
  try {
    const raw = localStorage.getItem(LOCAL_SUPABASE_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Error reading local supabase products cache:', err);
    return [];
  }
}

/**
 * Saves products to localStorage cache
 */
export function setLocalCachedProducts(rows: SupabaseProductRow[]): void {
  try {
    localStorage.setItem(LOCAL_SUPABASE_CACHE_KEY, JSON.stringify(rows));
  } catch (err) {
    console.warn('Error writing local supabase products cache:', err);
  }
}

/**
 * Maps a single store Product into the Supabase 'productos' row format
 * with fields: nombre, precio, descripcion, imagen, stock
 */
export function mapProductToSupabaseRow(product: Product): SupabaseProductRow {
  const defaultSize = product.sizes[product.defaultSizeIndex] || product.sizes[0];
  const price = defaultSize ? defaultSize.price : 250;
  
  return {
    nombre: product.name,
    precio: price,
    descripcion: product.description || product.tagline || '',
    imagen: product.image,
    stock: 25, // Stock por defecto
    categoria: product.category,
    familia_olfativa: product.olfactoryFamily,
    concentracion: product.concentration,
    rating: product.rating,
    review_count: product.reviewCount,
    destacado: Boolean(product.featured || product.bestSeller)
  };
}

/**
 * Maps a Supabase row back to a rich Product object for the store
 */
export function mapSupabaseRowToProduct(row: SupabaseProductRow, index: number = 0): Product {
  // Check if we have an original template in PRODUCTS_DATABASE to preserve rich notes
  const match = PRODUCTS_DATABASE.find(
    (p) => p.name.trim().toLowerCase() === (row.nombre || '').trim().toLowerCase()
  );

  const parsedPrice = Number(row.precio) || 250;
  const inStock = (Number(row.stock) || 0) > 0;

  if (match) {
    return {
      ...match,
      id: row.id ? `sp-${row.id}` : match.id,
      name: row.nombre || match.name,
      description: row.descripcion || match.description,
      image: row.imagen || match.image,
      sizes: match.sizes.map((s, idx) => {
        if (idx === match.defaultSizeIndex) {
          return { ...s, price: parsedPrice, inStock };
        }
        return { ...s, inStock };
      })
    };
  }

  // If it's a custom or new product in Supabase
  const slug = (row.nombre || `fragancia-${index}`)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const validCategory = (row.categoria as any) || 'autor_nicho';
  const validFamily = (row.familia_olfativa as any) || 'oriental';

  return {
    id: row.id ? `sp-${row.id}` : `sp-${slug}`,
    name: row.nombre || 'Fragancia Exclusiva',
    tagline: 'Edición limitada seleccionada por Esther Cruz Velásquez',
    category: validCategory,
    categoryLabel: row.categoria ? String(row.categoria).toUpperCase() : 'Alta Perfumería',
    olfactoryFamily: validFamily,
    olfactoryFamilyLabel: row.familia_olfativa ? String(row.familia_olfativa) : 'Notas Exclusivas',
    concentration: (row.concentracion as any) || 'Eau de Parfum',
    sizes: [
      { size: '30 ml', price: Math.round(parsedPrice * 0.75), inStock },
      { size: '50 ml', price: parsedPrice, inStock },
      { size: '100 ml', price: Math.round(parsedPrice * 1.45), inStock }
    ],
    defaultSizeIndex: 1,
    pyramid: {
      top: ['Bergamota brillante', 'Notas de Salida Suaves'],
      heart: ['Esencia de Pétalos Nobles', 'Corazón Aromático'],
      base: ['Maderas Preciosas', 'Ámbar Cálido', 'Almizcle']
    },
    description: row.descripcion || 'Creación exclusiva de alta perfumería elaborada con esencias seleccionadas.',
    poeticNotes: 'Un sello aromático irresistible e inolvidable.',
    longevity: '10 - 14 horas',
    sillage: 'Envolvente y sofisticada',
    rating: row.rating || 4.9,
    reviewCount: row.review_count || 15,
    image: row.imagen || '/images/perfume_dama_floral_1792432937694.jpg',
    featured: row.destacado !== undefined ? row.destacado : true,
    intensity: 4
  };
}

/**
 * Saves/Seeds the entire product catalog to Supabase table 'productos'
 */
export async function saveCatalogToSupabase(productsToSave: Product[] = PRODUCTS_DATABASE): Promise<{
  success: boolean;
  insertedCount: number;
  error?: string;
  details?: any;
  savedInCache?: boolean;
}> {
  // Convert all products to row structure
  const rows: SupabaseProductRow[] = productsToSave.map(mapProductToSupabaseRow);

  // Always update local cache first
  setLocalCachedProducts(rows);

  try {
    // 1. Try full insert with extra columns
    let { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .insert(rows)
      .select();

    // 2. If it failed because of missing extra columns, try strictly with the 5 core fields requested:
    // nombre, precio, descripcion, imagen, stock
    if (error) {
      console.warn('Initial insert with full schema had notice. Retrying with strictly 5 core fields:', error.message);
      
      const minimalRows = rows.map((r) => ({
        nombre: r.nombre,
        precio: r.precio,
        descripcion: r.descripcion,
        imagen: r.imagen,
        stock: r.stock
      }));

      const retryResult = await supabase
        .from(PRODUCTS_TABLE)
        .insert(minimalRows)
        .select();

      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) {
      return {
        success: false,
        insertedCount: 0,
        error: error.message || 'Error al insertar en la tabla productos de Supabase',
        details: error,
        savedInCache: true
      };
    }

    return {
      success: true,
      insertedCount: data?.length || rows.length,
      details: data,
      savedInCache: true
    };
  } catch (err: any) {
    console.error('Unexpected error inserting into Supabase productos:', err);
    return {
      success: false,
      insertedCount: 0,
      error: err?.message || 'Error de conexión con Supabase',
      savedInCache: true
    };
  }
}

/**
 * Saves a single new product to the 'productos' table in Supabase
 */
export async function saveSingleProductToSupabase(item: {
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  stock: number;
  categoria?: string;
  familia_olfativa?: string;
}): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    // Strict payload
    const payload = {
      nombre: item.nombre.trim(),
      precio: Number(item.precio),
      descripcion: item.descripcion.trim(),
      imagen: item.imagen.trim(),
      stock: Number(item.stock) || 10
    };

    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .insert([payload])
      .select();

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    // Refresh cache
    const current = getLocalCachedProducts();
    setLocalCachedProducts([payload, ...current]);

    return {
      success: true,
      data
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Error al conectar con Supabase'
    };
  }
}

/**
 * Reads products directly from the 'productos' table in Supabase.
 * Falls back to local cached Supabase rows or PRODUCTS_DATABASE if unreachable.
 */
export async function fetchProductsFromSupabase(): Promise<{
  success: boolean;
  products: Product[];
  count: number;
  source: 'supabase' | 'cache' | 'default';
  error?: string;
  rawRows?: SupabaseProductRow[];
}> {
  try {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.warn('Supabase fetch products error/notice:', error);
      
      // Check if we have cached Supabase rows from a previous sync
      const cached = getLocalCachedProducts();
      if (cached && cached.length > 0) {
        return {
          success: false,
          products: cached.map(mapSupabaseRowToProduct),
          count: cached.length,
          source: 'cache',
          error: error.message,
          rawRows: cached
        };
      }

      // Default catalog fallback
      return {
        success: false,
        products: PRODUCTS_DATABASE,
        count: PRODUCTS_DATABASE.length,
        source: 'default',
        error: error.message,
        rawRows: PRODUCTS_DATABASE.map(mapProductToSupabaseRow)
      };
    }

    if (data && data.length > 0) {
      // Successfully read from Supabase table 'productos'
      setLocalCachedProducts(data as SupabaseProductRow[]);
      const mapped = (data as SupabaseProductRow[]).map(mapSupabaseRowToProduct);
      
      return {
        success: true,
        products: mapped,
        count: mapped.length,
        source: 'supabase',
        rawRows: data as SupabaseProductRow[]
      };
    }

    // Table exists but is currently empty
    const cached = getLocalCachedProducts();
    if (cached && cached.length > 0) {
      return {
        success: true,
        products: cached.map(mapSupabaseRowToProduct),
        count: cached.length,
        source: 'cache',
        rawRows: cached
      };
    }

    return {
      success: true,
      products: PRODUCTS_DATABASE,
      count: 0,
      source: 'default',
      rawRows: []
    };
  } catch (err: any) {
    console.error('Unexpected error fetching from Supabase productos:', err);
    const cached = getLocalCachedProducts();
    if (cached && cached.length > 0) {
      return {
        success: false,
        products: cached.map(mapSupabaseRowToProduct),
        count: cached.length,
        source: 'cache',
        error: err?.message,
        rawRows: cached
      };
    }

    return {
      success: false,
      products: PRODUCTS_DATABASE,
      count: PRODUCTS_DATABASE.length,
      source: 'default',
      error: err?.message,
      rawRows: PRODUCTS_DATABASE.map(mapProductToSupabaseRow)
    };
  }
}
