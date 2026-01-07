import type { User, Chat, ChatMessage, Product } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User' },
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'Customer Support' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Welcome to ZALLIANCE support.', ts: Date.now() },
];
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Le Grand Dakar',
    description: 'A majestic three-piece Boubou set in deep royal blue, featuring intricate gold embroidery along the neckline and cuffs. Perfect for weddings and grand ceremonies.',
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
    description: 'Modern tailored senator suit in charcoal grey with subtle geometric patterns. Designed for the contemporary African business leader.',
    price: 85000,
    category: 'Senator',
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
    description: 'Luxurious white linen kaftan with premium gold thread embroidery. Breathable fabric meets opulent design.',
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
    description: 'Sleek black Agbada with silver detailing. A commanding presence for evening galas and awards nights.',
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
    description: 'Traditional mud-cloth inspired design in rich earth tones. A perfect blend of heritage and modern cut.',
    price: 95000,
    category: 'Traditional',
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
    description: 'Vibrant blue two-piece suit with a modern slim fit. Ideal for casual Fridays or semi-formal gatherings.',
    price: 75000,
    category: 'Casual',
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L'],
    inStock: false,
    createdAt: Date.now() - 500000
  }
];