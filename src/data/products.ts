import { Product } from '../types';

export const PRODUCTS_DATABASE: Product[] = [
  {
    id: 'aurélia-rose-pivoine',
    name: 'Aurélia Rose & Pivoine',
    tagline: 'Una oda romántica al jardín imperial de Grasse',
    category: 'dama',
    categoryLabel: 'Perfumes Dama',
    olfactoryFamily: 'floral',
    olfactoryFamilyLabel: 'Florales',
    concentration: 'Eau de Parfum',
    sizes: [
      { size: '30 ml', price: 210, inStock: true },
      { size: '50 ml', price: 320, originalPrice: 360, inStock: true },
      { size: '100 ml', price: 460, originalPrice: 510, inStock: true }
    ],
    defaultSizeIndex: 1,
    pyramid: {
      top: ['Lichi cristalizado', 'Bergamota de Calabria', 'Pétalos de peonía matutina'],
      heart: ['Rosa de Damasco', 'Magnolia cremosa', 'Lirio del valle'],
      base: ['Almizcle blanco', 'Madera de cedro rosado', 'Ámbar sedoso']
    },
    description: 'Aurélia Rose & Pivoine encarna la feminidad luminosa y la ternura sofisticada. Elaborado con una infusión concentrada de rosas de mayo recolectadas a mano al amanecer, este bouquet floral despliega una calidez que abraza la piel durante todo el día sin abrumar jamás.',
    poeticNotes: 'Como el primer rayo de sol posándose sobre un capullo cubierto de rocío en la campiña francesa.',
    longevity: '10 - 12 horas',
    sillage: 'Moderada y elegante',
    rating: 4.9,
    reviewCount: 42,
    image: '/images/perfume_dama_floral_1792432937694.jpg',
    featured: true,
    bestSeller: true,
    intensity: 3
  },
  {
    id: 'aeterna-cedar-oud',
    name: 'Aeterna Cedar & Oud Nobilis',
    tagline: 'Nobleza boscosa, humo sagrado y cuero acariciado por el tiempo',
    category: 'caballero',
    categoryLabel: 'Perfumes Caballero',
    olfactoryFamily: 'amaderado',
    olfactoryFamilyLabel: 'Amaderados',
    concentration: 'Extrait de Parfum',
    sizes: [
      { size: '50 ml', price: 380, originalPrice: 420, inStock: true },
      { size: '100 ml', price: 540, originalPrice: 590, inStock: true }
    ],
    defaultSizeIndex: 0,
    pyramid: {
      top: ['Cardamomo negro de Guatemala', 'Pimienta rosa silvestre', 'Corteza de pomelo'],
      heart: ['Madera de agar (Oud real)', 'Cedro del Atlas ahumado', 'Papiro egipcio'],
      base: ['Vetiver de Haití', 'Cuero toscano fino', 'Resina de benjuí', 'Ámbar gris']
    },
    description: 'Una creación regia para caballeros con carácter imponente y distinción innata. El cedro ancestral se entrelaza con maderas de oud maduradas durante doce años, aportando una estela aristocrática que irradia magnetismo y aplomo.',
    poeticNotes: 'La arquitectura de un bosque milenario bajo el crepúsculo dorado.',
    longevity: '14 - 18 horas',
    sillage: 'Potente y memorable',
    rating: 5.0,
    reviewCount: 56,
    image: '/images/perfume_caballero_oud_1792432938651.jpg',
    featured: true,
    bestSeller: true,
    intensity: 5
  },
  {
    id: 'sultan-elixir-attar',
    name: 'Sultán Royale — Attar Concentré',
    tagline: 'Elixir puro sin alcohol macerado con azafrán y miel oriental',
    category: 'unisex_arabe',
    categoryLabel: 'Unisex & Árabes',
    olfactoryFamily: 'oriental',
    olfactoryFamilyLabel: 'Orientales & Especiados',
    concentration: 'Attar Elixir',
    sizes: [
      { size: '12 ml (Gota pura)', price: 290, originalPrice: 330, inStock: true },
      { size: '25 ml (Frasco joya)', price: 490, originalPrice: 550, inStock: true }
    ],
    defaultSizeIndex: 0,
    pyramid: {
      top: ['Hilos de azafrán persa', 'Flores de azahar de Túnez', 'Néctar de dátiles'],
      heart: ['Rosa taif de Arabia', 'Incienso de Omán', 'Miel de acacia pura'],
      base: ['Oud Camboyano dorado', 'Almizcle real vegetal', 'Vainilla Bourbon de Madagascar']
    },
    description: 'Un extracto al óleo ancestral concebido bajo las tradiciones de los maestros perfumistas de Oriente Medio. Al no contener alcohol, el elixir se funde con los aceites naturales de la dermis, proyectando un halo cálido, sensual y eterno que evoluciona con el calor del pulso.',
    poeticNotes: 'Un suspiro de seda bordado con hilos de oro en los palacios de Damasco.',
    longevity: 'Más de 24 horas',
    sillage: 'Íntima pero inextinguible',
    rating: 4.95,
    reviewCount: 38,
    image: '/images/perfume_arabian_attar_1792432938929.jpg',
    featured: true,
    bestSeller: true,
    intensity: 5
  },
  {
    id: 'discovery-box-luxe',
    name: 'Coffret Élite — Set de Descubrimiento 5 Flacons',
    tagline: 'Cinco viajes olfativos en decants de vidrio con atomizador de oro',
    category: 'discovery_decants',
    categoryLabel: 'Sets & Decants',
    olfactoryFamily: 'floral',
    olfactoryFamilyLabel: 'Colección Mixta',
    concentration: 'Eau de Parfum',
    sizes: [
      { size: '5 x 10 ml Decants', price: 240, originalPrice: 280, inStock: true }
    ],
    defaultSizeIndex: 0,
    pyramid: {
      top: ['Aurélia Rose (Floral)', 'Aeterna Oud (Amaderado)'],
      heart: ['Solstice d’Or (Cítrico Soleado)', 'Ambre Impérial (Oriental)'],
      base: ['Velvet Nectar (Frutal Gourmand)']
    },
    description: 'El obsequio sublime para entusiastas de la perfumería de nicho o para quien busca su fragancia insignia. Incluye 5 viales de 10 ml con pulverizador micrométrico, presentados en una caja rígida forrada en terciopelo negro con listón de satén marfil y tarjeta de cata olfativa.',
    poeticNotes: 'La llave de entrada al santuario aromático de Esther Cruz Velásquez.',
    longevity: '10 - 16 horas c/u',
    sillage: 'Versátil según fragancia',
    rating: 5.0,
    reviewCount: 64,
    image: '/images/discovery_gift_set_1792432939216.jpg',
    featured: true,
    bestSeller: true,
    intensity: 4
  },
  {
    id: 'solstice-ambre-dore',
    name: 'Solstice Ambre Doré',
    tagline: 'Luz dorada de atardecer andino, bergamota chispeante y maderas cálidas',
    category: 'autor_nicho',
    categoryLabel: 'Perfumes de Autor y Nicho',
    olfactoryFamily: 'citrico',
    olfactoryFamilyLabel: 'Cítricos & Frescos',
    concentration: 'Eau de Parfum',
    sizes: [
      { size: '50 ml', price: 340, inStock: true },
      { size: '100 ml', price: 490, originalPrice: 530, inStock: true }
    ],
    defaultSizeIndex: 1,
    pyramid: {
      top: ['Bergamota de Calabria', 'Mandarina siciliana', 'Jengibre blanco'],
      heart: ['Flor de neroli', 'Sal marina mineral', 'Cardamomo verde'],
      base: ['Ámbar dorado', 'Madera de sándalo Mysore', 'Almizcle solar']
    },
    description: 'Creado bajo la inspiración de los horizontes dorados del altiplano y la pureza del aire andino. Solstice Ambre Doré combina la vivacidad cítrica más efervescente con un fondo ambarado que retiene el calor del sol en tu piel durante todo el día.',
    poeticNotes: 'La serenidad de un atardecer que tiñe las montañas de oro puro.',
    longevity: '8 - 10 horas',
    sillage: 'Fresco y chispeante',
    rating: 4.85,
    reviewCount: 31,
    image: '/images/hero_luxury_perfume_1792432937692.jpg',
    featured: true,
    isNew: true,
    intensity: 3
  },
  {
    id: 'nuit-velours-noire',
    name: 'Nuit Velours Noire',
    tagline: 'Misterio nocturno, ciruela negra, licor de grosellas y vainilla oscura',
    category: 'dama',
    categoryLabel: 'Perfumes Dama',
    olfactoryFamily: 'frutal',
    olfactoryFamilyLabel: 'Frutales & Dulces',
    concentration: 'Extrait de Parfum',
    sizes: [
      { size: '50 ml', price: 360, inStock: true },
      { size: '100 ml', price: 510, inStock: true }
    ],
    defaultSizeIndex: 0,
    pyramid: {
      top: ['Ciruela damascena madura', 'Cassis salvaje', 'Pimienta negra'],
      heart: ['Orquídea negra', 'Jazmín sambac nocturno', 'Praliné crujiente'],
      base: ['Vainilla de Madagascar ahumada', 'Pachulí indonesio', 'Haba tonka tostada']
    },
    description: 'Sensualidad nocturna en su máxima expresión. Nuit Velours Noire viste a la mujer con un manto opulento de frutas oscuras caramelizadas y orquídeas que florecen en la penumbra. Una fragancia embriagadora e imposible de ignorar.',
    poeticNotes: 'Un vestido de terciopelo negro sobre hombros descubiertos a medianoche.',
    longevity: '12 - 14 horas',
    sillage: 'Embriagadora y sensual',
    rating: 4.9,
    reviewCount: 29,
    image: '/images/perfume_dama_floral_1792432937694.jpg',
    featured: false,
    intensity: 4
  },
  {
    id: 'cuir-sauvage-imperial',
    name: 'Cuir Sauvage Impérial',
    tagline: 'Cuero curtido fino, hojas de tabaco de La Habana y nuez moscada',
    category: 'caballero',
    categoryLabel: 'Perfumes Caballero',
    olfactoryFamily: 'amaderado',
    olfactoryFamilyLabel: 'Amaderados',
    concentration: 'Eau de Parfum',
    sizes: [
      { size: '50 ml', price: 350, inStock: true },
      { size: '100 ml', price: 495, originalPrice: 550, inStock: true }
    ],
    defaultSizeIndex: 1,
    pyramid: {
      top: ['Salvia romana', 'Hojas de abedul', 'Nuez moscada'],
      heart: ['Cuero de montar inglés', 'Flor de tabaco rubio', 'Café moka tostado'],
      base: ['Madera de roble', 'Resina de ládano', 'Almizcle ahumado']
    },
    description: 'El epítome de la elegancia masculina atemporal. Un aroma seco, sobrio y de una virilidad pulida que recuerda a las bibliotecas privadas de maderas nobles, sillones de cuero gastado y conversaciones memorables.',
    poeticNotes: 'La templanza de quien domina el tiempo y las circunstancias.',
    longevity: '12 - 15 horas',
    sillage: 'Robusta y distinguida',
    rating: 4.92,
    reviewCount: 37,
    image: '/images/perfume_caballero_oud_1792432938651.jpg',
    featured: false,
    intensity: 5
  },
  {
    id: 'difusor-santal-blanc',
    name: 'Difusor de Lujo Santal Blanc & Lino',
    tagline: 'Varillas de ratán negro y aceite concentrado para santuarios del hogar',
    category: 'hogar',
    categoryLabel: 'Perfumería de Hogar',
    olfactoryFamily: 'amaderado',
    olfactoryFamilyLabel: 'Amaderados',
    concentration: 'Cera & Aceite',
    sizes: [
      { size: '200 ml + 8 Varillas', price: 185, originalPrice: 210, inStock: true },
      { size: '500 ml Recarga Luxe', price: 310, inStock: true }
    ],
    defaultSizeIndex: 0,
    pyramid: {
      top: ['Hojas de té blanco', 'Eucalipto plateado'],
      heart: ['Lino fresco lavado', 'Flor de algodón', 'Sándalo blanco'],
      base: ['Madera de cedro suave', 'Almizcle limpio']
    },
    description: 'Transforma tu estancia en un remanso de paz y opulencia sutil. Formulado con aceites esenciales de grado cosmético que se difunden de forma constante durante más de 90 días, llenando salones y dormitorios con un velo acogedor.',
    poeticNotes: 'El confort de una suite de cinco estrellas con vista a los Andes.',
    longevity: 'Hasta 90 días de difusión continua',
    sillage: 'Constante y envolvente en 35m²',
    rating: 4.9,
    reviewCount: 22,
    image: '/images/hero_luxury_perfume_1792432937692.jpg',
    featured: false,
    intensity: 2
  },
  {
    id: 'vela-aromatica-ambar-resina',
    name: 'Vela Esculpida Ámbar & Madera Quemada',
    tagline: 'Cera de soja 100% vegetal con mecha de madera crujiente de cerezo',
    category: 'hogar',
    categoryLabel: 'Perfumería de Hogar',
    olfactoryFamily: 'oriental',
    olfactoryFamilyLabel: 'Orientales & Especiados',
    concentration: 'Cera & Aceite',
    sizes: [
      { size: '320 gramos (70 hrs)', price: 145, inStock: true }
    ],
    defaultSizeIndex: 0,
    pyramid: {
      top: ['Corteza de canela', 'Clavo de olor dulce'],
      heart: ['Ámbar báltico fundido', 'Humo de leña aromática'],
      base: ['Vainilla oscura', 'Pachulí terroso']
    },
    description: 'Vertida a mano en un cuenco cerámico artesanal de tono grafito mate. La mecha de madera produce un crepitar relajante al arder, liberando notas densas y balsámicas que calientan las tardes frías de Juliaca.',
    poeticNotes: 'El crepitar del fuego que reúne a los espíritus en torno a la belleza.',
    longevity: '70 horas de combustión limpia',
    sillage: 'Cálida e hipnótica',
    rating: 4.88,
    reviewCount: 19,
    image: '/images/perfume_arabian_attar_1792432938929.jpg',
    featured: false,
    intensity: 4
  },
  {
    id: 'crema-seda-aurélia',
    name: 'Crème Sublime Aurélia — Bálsamo Perfumado',
    tagline: 'Manteca de karité virgen, aceite de jojoba y notas de Aurélia Rose',
    category: 'cuidado_corporal',
    categoryLabel: 'Cuidado Corporal',
    olfactoryFamily: 'floral',
    olfactoryFamilyLabel: 'Florales',
    concentration: 'Bruma Aromática',
    sizes: [
      { size: '250 ml Tarro de Cristal', price: 165, inStock: true }
    ],
    defaultSizeIndex: 0,
    pyramid: {
      top: ['Agua de rosas destilada', 'Flor de azahar'],
      heart: ['Peonía cremosa', 'Leche de almendras dulces'],
      base: ['Almizcle sedoso', 'Mantequilla de cacao']
    },
    description: 'La culminación del ritual olfativo. Esta crema untuosa nutre intensamente la piel mientras fija la fragancia Aurélia Rose por horas. Ideal para aplicar en puntos de pulso antes del perfume para multiplicar su fijación y estela.',
    poeticNotes: 'Una caricia de terciopelo que sella la belleza en cada poro.',
    longevity: '8 horas de hidratación perfumada',
    sillage: 'Suave y cercana',
    rating: 4.96,
    reviewCount: 27,
    image: '/images/perfume_dama_floral_1792432937694.jpg',
    featured: false,
    intensity: 2
  },
  {
    id: 'cofre-aniversario-realeza',
    name: 'Cofre Ceremonial — Dúo de Alta Perfumería',
    tagline: 'Edición de coleccionista numerada con 2 extractos y estuche de cuero',
    category: 'regalos_cofres',
    categoryLabel: 'Sets & Regalos',
    olfactoryFamily: 'oriental',
    olfactoryFamilyLabel: 'Orientales & Especiados',
    concentration: 'Extrait de Parfum',
    sizes: [
      { size: '2 x 50 ml Frascos Joya', price: 620, originalPrice: 700, inStock: true }
    ],
    defaultSizeIndex: 0,
    pyramid: {
      top: ['Aurélia Rose (Extrait)', 'Aeterna Oud (Extrait)'],
      heart: ['Rosa Taif con Azafrán', 'Madera de Oud con Cuero'],
      base: ['Ámbar Real con Vainilla Bourbon']
    },
    description: 'Creado para celebrar ocasiones excepcionales como aniversarios, bodas o hitos de vida. Contiene dos botellas con tapones bañados en oro champagne de 18k, junto con un certificado de autenticidad firmado personalmente por Esther Cruz Velásquez.',
    poeticNotes: 'El testimonio tangible del amor eterno y la distinción absoluta.',
    longevity: '18 horas continuas',
    sillage: 'Inolvidable y aristocrática',
    rating: 5.0,
    reviewCount: 15,
    image: '/images/discovery_gift_set_1792432939216.jpg',
    featured: true,
    bestSeller: false,
    isNew: true,
    intensity: 5
  },
  {
    id: 'frescor-andino-mist',
    name: 'Bruma Capilar & Corporal Cítricos de Altura',
    tagline: 'Velo refrescante enriquecido con provitamina B5 y neroli silvestre',
    category: 'cuidado_corporal',
    categoryLabel: 'Cuidado Corporal',
    olfactoryFamily: 'citrico',
    olfactoryFamilyLabel: 'Cítricos & Frescos',
    concentration: 'Bruma Aromática',
    sizes: [
      { size: '150 ml Pulverizador Seda', price: 125, inStock: true }
    ],
    defaultSizeIndex: 0,
    pyramid: {
      top: ['Lima dulce peruana', 'Menta glaciar', 'Bergamota'],
      heart: ['Neroli verde', 'Semillas de cilantro', 'Té verde sencha'],
      base: ['Cedro blanco', 'Almizcle ligero']
    },
    description: 'Formulado sin aceites grasos ni alcohol secante, perfecto para perfumar tanto el cabello como el escote y brazos en días soleados o tras una ducha relajante. Aporta brillo sedoso y una sensación revitalizante inmediata.',
    poeticNotes: 'La brisa cristalina de una cascada escondida entre valles andinos.',
    longevity: '6 - 7 horas',
    sillage: 'Fresco y chispeante',
    rating: 4.8,
    reviewCount: 21,
    image: '/images/hero_luxury_perfume_1792432937692.jpg',
    featured: false,
    intensity: 2
  }
];

export const CATEGORIES_LIST = [
  { id: 'todos', label: 'Todo el Catálogo' },
  { id: 'autor_nicho', label: 'Perfumes de Autor & Nicho' },
  { id: 'dama', label: 'Perfumes para Dama' },
  { id: 'caballero', label: 'Perfumes para Caballero' },
  { id: 'unisex_arabe', label: 'Unisex & Árabes (Attars)' },
  { id: 'discovery_decants', label: 'Sets & Decants' },
  { id: 'regalos_cofres', label: 'Cofres de Regalo' },
  { id: 'hogar', label: 'Perfumería de Hogar' },
  { id: 'cuidado_corporal', label: 'Cremas & Body Mists' }
] as const;

export const OLFACTORY_FAMILIES_LIST = [
  { 
    id: 'floral', 
    name: 'Florales', 
    subtitle: 'Rosas, Jazmín, Peonías & Orquídeas',
    icon: '🌸',
    image: '/images/perfume_dama_floral_1792432937694.jpg',
    description: 'Evocan elegancia, sutileza y romanticismo sublime con esencias florales de Grasse y Damasco.'
  },
  { 
    id: 'amaderado', 
    name: 'Amaderados', 
    subtitle: 'Sándalo, Cedro del Atlas, Oud & Vetiver',
    icon: '🪵',
    image: '/images/perfume_caballero_oud_1792432938651.jpg',
    description: 'Estructuras firmes, profundas y magnéticas que dejan una estela de autoridad serena y nobleza.'
  },
  { 
    id: 'citrico', 
    name: 'Cítricos & Frescos', 
    subtitle: 'Bergamota, Mandarina, Neroli & Sal Marina',
    icon: '🍊',
    image: '/images/hero_luxury_perfume_1792432937692.jpg',
    description: 'Explosión de energía solar, luminosidad revitalizante y pureza cristalina de alta volatilidad.'
  },
  { 
    id: 'oriental', 
    name: 'Orientales & Especiados', 
    subtitle: 'Vainilla Bourbon, Ámbar, Incienso & Azafrán',
    icon: '🌶️',
    image: '/images/perfume_arabian_attar_1792432938929.jpg',
    description: 'Calidez hipnótica, misterio ancestral y acordes balsámicos para ocasiones memorables.'
  },
  { 
    id: 'frutal', 
    name: 'Frutales & Dulces', 
    subtitle: 'Gourmand, Frutos Rojos, Higo & Ciruela',
    icon: '🍏',
    image: '/images/discovery_gift_set_1792432939216.jpg',
    description: 'Dulzura aterciopelada y jugosa que despierta apetito sensorial sin perder sofisticación.'
  }
] as const;
