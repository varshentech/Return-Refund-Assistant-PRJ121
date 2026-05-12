import { db } from '@/db';
import { products, users } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Seed Products
    const existingProducts = await db.select().from(products);
    if (existingProducts.length === 0) {
      await db.insert(products).values([
        {
          name: 'Cyber-Nexus Headphones',
          description: 'Next-gen noise cancellation with spatial audio and RGB lighting.',
          price: 299.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
          rating: 4.8,
          category: 'Electronics'
        },
        {
          name: 'Vortex Smart Watch',
          description: 'Holographic display with health tracking and 14-day battery.',
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
          rating: 4.5,
          category: 'Wearables'
        },
        {
          name: 'Echo Buds Pro',
          description: 'Pure sound with adaptive transparency mode.',
          price: 149.99,
          image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1000&auto=format&fit=crop',
          rating: 4.2,
          category: 'Electronics'
        }
      ]);
    }

    // Seed Default User
    const existingUsers = await db.select().from(users);
    if (existingUsers.length === 0) {
      await db.insert(users).values([
        { id: 1, name: 'Demo Customer', role: 'customer', walletBalance: 500.0 },
        { id: 2, name: 'Admin User', role: 'admin', walletBalance: 0 }
      ]);
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ success: false, error: 'Failed to seed database' }, { status: 500 });
  }
}
