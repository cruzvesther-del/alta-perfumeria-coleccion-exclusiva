export interface OlfactoryPyramid {
  top: string[];
  heart: string[];
  base: string[];
}

export interface ProductSizeOption {
  size: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

export type CategoryType = 
  | 'autor_nicho'
  | 'dama'
  | 'caballero'
  | 'unisex_arabe'
  | 'discovery_decants'
  | 'regalos_cofres'
  | 'hogar'
  | 'cuidado_corporal';

export type OlfactoryFamilyType = 
  | 'floral'
  | 'amaderado'
  | 'citrico'
  | 'oriental'
  | 'frutal';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: CategoryType;
  categoryLabel: string;
  olfactoryFamily: OlfactoryFamilyType;
  olfactoryFamilyLabel: string;
  concentration: 'Extrait de Parfum' | 'Eau de Parfum' | 'Attar Elixir' | 'Eau de Toilette' | 'Bruma Aromática' | 'Cera & Aceite';
  sizes: ProductSizeOption[];
  defaultSizeIndex: number;
  pyramid: OlfactoryPyramid;
  description: string;
  poeticNotes: string;
  longevity: string; // ej. "10 - 14 horas"
  sillage: string; // ej. "Envolvente y duradera"
  rating: number;
  reviewCount: number;
  image: string;
  secondaryImage?: string;
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  intensity: 1 | 2 | 3 | 4 | 5;
}

export interface CartItem {
  id: string; // cart item unique id
  product: Product;
  selectedSize: string;
  price: number;
  quantity: number;
  giftWrap: boolean;
  giftMessage?: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  productName: string;
  verified: boolean;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  image: string;
  content: string[];
}

export type ModalidadCita = 'Presencial (Boutique Juliaca)' | 'Virtual (Videollamada / WhatsApp)';

export interface CitaInput {
  nombre: string;
  telefono: string;
  email?: string;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:mm
  servicio: string;
  modalidad: ModalidadCita;
  mensaje?: string;
}

export interface CitaRecord extends CitaInput {
  id?: string;
  estado?: 'pendiente' | 'confirmada' | 'cancelada';
  created_at?: string;
  source?: 'supabase' | 'local';
}

