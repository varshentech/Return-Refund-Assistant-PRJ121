/**
 * VIRTUAL JSON DATABASE MANAGER
 * Structured to act like a powerful relational database using localStorage.
 */

const DB_KEY = 'PROJECT_DB_JSON';

export const SEED_DATA = {
  products: [
    { id: 1, name: 'Cyber-Nexus Headphones', price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000', rating: 4.8, description: 'Spatial audio with AI noise cancellation.', category: 'Electronics' },
    { id: 2, name: 'Vortex Smart Watch', price: 199.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000', rating: 4.5, description: 'Holographic display and health tracking.', category: 'Wearables' },
    { id: 3, name: 'Echo Buds Pro', price: 149.99, image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1000', rating: 4.2, description: 'Adaptive transparency and deep bass.', category: 'Electronics' },
    { id: 4, name: 'Lumina Gaming Mouse', price: 89.99, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000', rating: 4.9, description: 'Ultra-lightweight with RGB sync.', category: 'Accessories' },
    { id: 5, name: 'Zenith Keyboard', price: 179.99, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1000', rating: 4.7, description: 'Mechanical switches with tactile feedback.', category: 'Electronics' }
  ],
  faq: [
    { q: "return policy", a: "We offer a 30-day hassle-free return policy for all electronics." },
    { q: "refund timing", a: "Refunds are processed within 24 hours of admin approval." },
    { q: "shipping cost", a: "Standard shipping is free; returns may incur a small processing fee." },
    { q: "track order", a: "You can track your order live in the 'My Orders' section." },
    { q: "wallet info", a: "Refunds are added to your virtual wallet for instant use." }
  ],
  users: [{ id: 1, name: 'Varshen A', wallet: 1000.0, role: 'customer' }],
  orders: [],
  refunds: [],
  logs: [],
  learned_ai: [],
  pending_ai: []
};

export const localDb = {
  init: () => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(DB_KEY)) {
      localStorage.setItem(DB_KEY, JSON.stringify(SEED_DATA));
    }
  },

  get: (table: keyof typeof SEED_DATA) => {
    if (typeof window === 'undefined') return SEED_DATA[table];
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    return db[table] || [];
  },

  insert: (table: keyof typeof SEED_DATA, item: any) => {
    if (typeof window === 'undefined') return;
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    db[table] = [item, ...(db[table] || [])];
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return item;
  },

  update: (table: keyof typeof SEED_DATA, id: any, newData: any) => {
    if (typeof window === 'undefined') return;
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    db[table] = db[table].map((item: any) => item.id === id ? { ...item, ...newData } : item);
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  },

  delete: (table: keyof typeof SEED_DATA, id: any) => {
    if (typeof window === 'undefined') return;
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    db[table] = db[table].filter((item: any) => item.id !== id);
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  },

  reset: () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DB_KEY, JSON.stringify(SEED_DATA));
    window.location.reload();
  }
};
