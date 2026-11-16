import { Review, Article } from '../types';

export const STORE_INFO = {
  name: 'Esther Cruz Velásquez — Alta Perfumería',
  founder: 'Esther Cruz Velásquez',
  phone: '+51 999 199 969',
  phoneClean: '51999199969',
  email: 'cruzvesther@gmail.com',
  city: 'Juliaca, Puno',
  country: 'Perú',
  address: 'Jr. Mariano Núñez 412, Centro Histórico, Juliaca — Puno, Perú',
  shippingScope: 'Envíos rápidos a Juliaca, Puno, Arequipa, Cusco, Lima y todo el territorio peruano.',
  currency: 'S/',
  freeShippingThreshold: 250
};

export const REVIEWS_DATABASE: Review[] = [
  {
    id: 'rev-1',
    author: 'Dra. Valeria Mendoza',
    location: 'Arequipa, Perú',
    rating: 5,
    date: '14 de Octubre, 2026',
    title: 'Fijación insuperable y presentación de ensueño',
    comment: 'Pedí el perfume Aurélia Rose & Pivoine junto con la muestra de cortesía. Llegó a mi consultorio en Arequipa en 48 horas en un empaque impecable con sello de cera y tarjeta personalizada escrita a mano. El aroma dura más de 12 horas en mi abrigo; mis pacientes siempre me preguntan por la fragancia.',
    productName: 'Aurélia Rose & Pivoine (Eau de Parfum)',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Ing. Carlos Zambrano',
    location: 'Juliaca, Puno',
    rating: 5,
    date: '28 de Septiembre, 2026',
    title: 'El mejor Oud que he probado en Perú',
    comment: 'Compré Aeterna Cedar & Oud directamente en la boutique de Juliaca con entrega contra entrega el mismo día. La concentración del aceite es de nivel nicho internacional, nada que envidiar a las casas de París. La atención de Esther por WhatsApp fue muy amable y experta.',
    productName: 'Aeterna Cedar & Oud Nobilis (Extrait de Parfum)',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Luciana Paredes',
    location: 'Miraflores, Lima',
    rating: 5,
    date: '02 de Octubre, 2026',
    title: 'El Coffret Élite de 5 decants es una joya',
    comment: 'Estaba indecisa entre dos perfumes y opté por el set de descubrimiento de 5 decants. Es perfecto: atomizan de maravilla y me permitieron probar cada aroma en mi piel durante una semana completa. Pagué cómodamente por Yape y me enviaron el código de seguimiento de Shalom al instante.',
    productName: 'Coffret Élite — Set de Descubrimiento',
    verified: true
  },
  {
    id: 'rev-4',
    author: 'Renzo Aguilar',
    location: 'Cusco, Perú',
    rating: 5,
    date: '19 de Septiembre, 2026',
    title: 'Elixir puro Sultán Royale: adictivo y duradero',
    comment: 'El Attar Royale concentrado sin alcohol es simplemente majestuoso. Apenas unas gotas en el cuello y muñecas bastan para todo el día y la noche, resistiendo el frío del Cusco sin perder intensidad. Esther Cruz Velásquez ofrece una calidad que no se encuentra en tiendas comerciales.',
    productName: 'Sultán Royale — Attar Concentré',
    verified: true
  }
];

export const BLOG_ARTICLES: Article[] = [
  {
    id: 'duracion-perfume-clima-frio',
    title: 'Cómo potenciar la duración de tu perfume en climas fríos y de altura',
    category: 'Rituales Olfativos',
    readTime: '4 min de lectura',
    date: '10 de Octubre, 2026',
    excerpt: 'En el altiplano andino y ciudades con bajas temperaturas, el aire seco y el frío pueden ralentizar la proyección. Descubre la técnica de capas y puntos de calor corporal para fijar tu estela.',
    image: '/images/perfume_dama_floral_1792432937694.jpg',
    content: [
      'El clima frío tiende a reducir la evaporación de los aceites aromáticos, lo que hace que algunas colonias convencionales parezcan desaparecer. Sin embargo, con perfumes de alta concentración como los Extrait de Parfum y aceites Attar de nuestra boutique, el frío se convierte en un aliado que conserva las notas de fondo por más tiempo.',
      'El secreto primordial es la hidratación previa: aplicar una crema corporal neutra o el bálsamo perfumado en los puntos de pulso antes de rociar el perfume crea una barrera lipídica donde las moléculas odoríferas quedan atrapadas.',
      'No olvides aplicar en zonas que conservan calor: detrás de los lóbulos de las orejas, en la clavícula, la parte interior de los codos y el reverso de bufandas de lana o seda.'
    ]
  },
  {
    id: 'piramide-olfativa-guia-completa',
    title: 'La Pirámide Olfativa: Descifrando la evolución de un perfume',
    category: 'Cultura del Perfume',
    readTime: '5 min de lectura',
    date: '04 de Octubre, 2026',
    excerpt: 'Un perfume de autor no huele igual en el primer minuto que a las cinco horas. Aprende a distinguir las notas de salida, corazón y fondo.',
    image: '/images/perfume_caballero_oud_1792432938651.jpg',
    content: [
      'Al pulverizar un perfume, presencias una sinfonía en tres actos: las Notas de Salida (volátiles, cítricas y frescas que duran de 15 a 30 minutos), las Notas de Corazón (el alma del perfume, dominada por flores, especias y resinas que perduran entre 4 y 6 horas), y las Notas de Fondo (la base amaderada, ambarada o almizclada que se impregna en la piel y tejidos hasta por 24 horas).',
      'En Esther Cruz Velásquez priorizamos fórmulas con una riqueza excepcional en notas de corazón y fondo, garantizando que el perfume evolucione con armonía y madure con elegancia.'
    ]
  },
  {
    id: 'diferencias-edp-extrait-attar',
    title: 'EDP, Extrait de Parfum y Attar: ¿Cuál elegir según tu estilo de vida?',
    category: 'Guía de Compra',
    readTime: '3 min de lectura',
    date: '25 de Septiembre, 2026',
    excerpt: 'Conoce los porcentajes de concentración aromática y por qué un Attar al óleo ofrece una intimidad sensual diferente a un vaporizador Eau de Parfum.',
    image: '/images/perfume_arabian_attar_1792432938929.jpg',
    content: [
      'La diferencia fundamental reside en la proporción de aceites esenciales puros frente al vehículo portador: el Eau de Parfum posee entre 15% y 20% de concentración, el Extrait de Parfum alcanza entre 25% y 40%, y el Attar árabe es un concentrado 100% oleoso libre de alcohol.',
      'Si buscas proyección radiante para eventos sociales, elige Eau de Parfum. Si deseas duración extrema y presencia señorial, el Extrait de Parfum es insuperable. Si buscas una conexión íntima, casi mística, el Attar es la joya definitiva.'
    ]
  }
];

export const FAQ_DATABASE = [
  {
    question: '¿Los perfumes son 100% auténticos y de autor?',
    answer: 'Absolutamente. Todas las fragancias y elixires del catálogo de Esther Cruz Velásquez provienen de importaciones directas de destilerías y casas de perfumería nicho de Francia, España, Dubái y Omán. Cada frasco cuenta con garantía de originalidad, sellado hermético y certificación de lote.'
  },
  {
    question: '¿Cómo se realizan los envíos a Juliaca y al resto del Perú?',
    answer: 'En Juliaca y Puno ciudad disponemos de servicio express con entrega el mismo día o en 24 horas, con opción de pago contra entrega. Para Arequipa, Cusco, Lima y todas las provincias del Perú, despachamos vía Olva Courier o Shalom con guía de seguimiento en tiempo real y seguro de transporte (tiempo estimado: 24 a 48 horas hábiles).'
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos Yape y Plin para transferencias inmediatas sin comisiones, transferencias bancarias a cuentas BCP, BBVA e Interbank, tarjetas de débito/crédito mediante pasarela segura, y pago contra entrega en efectivo o POS para compras en Juliaca.'
  },
  {
    question: '¿Cómo funciona la muestra gratis en cada pedido?',
    answer: 'En toda compra incluimos de obsequio una muestra premium de 2ml de una fragancia complementaria a tu elección o sugerida por nuestra sommelier de fragancias, permitiéndote descubrir nuevos aromas antes de abrirlos.'
  },
  {
    question: '¿Cómo puedo solicitar un pedido con empaque de regalo y dedicatoria?',
    answer: 'En la ficha de producto o en el carrito puedes marcar la casilla "Envoltura de regalo de lujo" e ingresar el texto de tu dedicatoria. Preparamos el paquete en caja rígida con lazo de satén marfil y tarjeta caligrafiada sin costo adicional.'
  }
];
