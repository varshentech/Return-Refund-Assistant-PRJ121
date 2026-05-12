import { pgTable, serial, text, timestamp, integer, doublePrecision, boolean, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull().default('customer'), // 'admin' or 'customer'
  walletBalance: doublePrecision('wallet_balance').notNull().default(500.0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: doublePrecision('price').notNull(),
  image: text('image').notNull(),
  rating: doublePrecision('rating').default(0),
  category: text('category').default('Electronics'),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  productId: integer('product_id').references(() => products.id),
  status: text('status').notNull().default('shipping'), // 'shipping', 'delivered', 'returned', 'refunded'
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  trackingNumber: varchar('tracking_number', { length: 50 }).notNull(),
  deliveryTime: timestamp('delivery_time').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const refundRequests = pgTable('refund_requests', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id),
  userId: integer('user_id').references(() => users.id),
  reason: text('reason').notNull(),
  status: text('status').notNull().default('pending'), // 'pending', 'approved', 'rejected'
  refundAmount: doublePrecision('refund_amount'),
  adminDeduction: doublePrecision('admin_deduction').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const aiKnowledge = pgTable('ai_knowledge', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer'),
  isPending: boolean('is_pending').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  details: text('details'),
  timestamp: timestamp('timestamp').defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  productId: integer('product_id').references(() => products.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  adminReaction: text('admin_reaction'),
  createdAt: timestamp('created_at').defaultNow(),
});
