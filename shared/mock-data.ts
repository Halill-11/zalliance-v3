import type { User, Chat, ChatMessage, Product } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User' },
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'Support Client' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Bienvenue au support ZALLIANCE.', ts: Date.now() },
];
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Le Grand Dakar',
    description: 'Un majestueux ensemble Boubou trois pièces en bleu royal profond, orné de broderies dorées complexes le long de l\'encolure et des poignets. Parfait pour les mariages et les grandes cérémonies.',
    price: 150000,
    category: 'Boubou',
    images: [
      'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523825036634-aab3cce05919?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506634572416-48cdfe530110?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['L', 'XL', 'XXL'],
    inStock: true,
    createdAt: Date.now()
  },
  {
    id: 'p2',
    name: 'Lagos Executive',
    description: 'Costume sénateur moderne taillé sur mesure en gris anthracite avec des motifs géométriques subtils. Conçu pour le leader d\'entreprise africain contemporain.',
    price: 85000,
    category: 'Sénateur',
    images: [
      'https://images.unsplash.com/photo-1507120410856-1f35574c3b45?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['M', 'L', 'XL'],
    inStock: true,
    createdAt: Date.now() - 100000
  },
  {
    id: 'p3',
    name: 'Abidjan Gold',
    description: 'Kaftan luxueux en lin blanc avec broderie au fil d\'or premium. Un tissu respirant rencontrant un design opulent.',
    price: 120000,
    category: 'Kaftan',
    images: [
      'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    createdAt: Date.now() - 200000
  },
  {
    id: 'p4',
    name: 'Accra Night',
    description: 'Agbada noir élégant avec des détails argentés. Une présence imposante pour les galas et les soirées de remise de prix.',
    price: 180000,
    category: 'Agbada',
    images: [
      'https://images.unsplash.com/photo-1550614000-4b9519e02d2c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545959734-642c983e958b?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['L', 'XL', 'XXL', '3XL'],
    inStock: true,
    createdAt: Date.now() - 300000
  },
  {
    id: 'p5',
    name: 'Bamako Earth',
    description: 'Design inspiré du bogolan traditionnel dans des tons terre riches. Un mélange parfait d\'héritage et de coupe moderne.',
    price: 95000,
    category: 'Traditionnel',
    images: [
      'https://images.unsplash.com/photo-1585251390530-269cf906d63d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589465885857-44edb59ef526?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['M', 'L', 'XL'],
    inStock: true,
    createdAt: Date.now() - 400000
  },
  {
    id: 'p6',
    name: 'Nairobi Sky',
    description: 'Costume deux pièces bleu vibrant avec une coupe slim moderne. Idéal pour les vendredis décontractés ou les rassemblements semi-formels.',
    price: 75000,
    category: 'Décontracté',
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L'],
    inStock: false,
    createdAt: Date.now() - 500000
  }
];