// Seed script for sample data
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../db/schema';

const client = createClient({
  url: 'file:local.db',
});

const db = drizzle(client, { schema });

// Sample categories
const categories = [
  { id: 'cat-1', name: 'Restaurants & Cafes', slug: 'restaurants-cafes', description: 'Food and beverage establishments' },
  { id: 'cat-2', name: 'Hotels & Accommodation', slug: 'hotels-accommodation', description: 'Hotels, hostels, and lodging' },
  { id: 'cat-3', name: 'Shopping', slug: 'shopping', description: 'Retail stores and shops' },
  { id: 'cat-4', name: 'Health & Beauty', slug: 'health-beauty', description: 'Healthcare and beauty services' },
  { id: 'cat-5', name: 'Automotive', slug: 'automotive', description: 'Car dealers, repair shops' },
  { id: 'cat-6', name: 'Professional Services', slug: 'professional-services', description: 'Legal, accounting, consulting' },
  { id: 'cat-7', name: 'Education', slug: 'education', description: 'Schools, tutoring, training' },
  { id: 'cat-8', name: 'Entertainment', slug: 'entertainment', description: 'Bars, clubs, venues' },
];

// Sample users
const users = [
  { id: 'user-1', email: 'john@example.com', name: 'John Smith', role: 'user' },
  { id: 'user-2', email: 'maria@example.com', name: 'Maria Santos', role: 'user' },
  { id: 'user-3', email: 'carlos@example.com', name: 'Carlos Oliveira', role: 'user' },
];

// Sample business pages
const businesses = [
  {
    id: 'biz-1',
    title: 'Café Timor',
    slug: 'cafe-timor',
    ownerId: 'user-1',
    categoryId: 'cat-1',
    status: 'live',
    contactName: 'João Silva',
    contactNumber: '77001234',
    countryCode: '+670',
    email: 'info@cafetimor.tl',
    address: 'Avenida de绍兴, Dili',
    locationLat: -8.5569,
    locationLng: 125.5603,
    openingHours: JSON.stringify({
      monday: { open: '07:00', close: '22:00' },
      tuesday: { open: '07:00', close: '22:00' },
      wednesday: { open: '07:00', close: '22:00' },
      thursday: { open: '07:00', close: '22:00' },
      friday: { open: '07:00', close: '23:00' },
      saturday: { open: '08:00', close: '23:00' },
      sunday: { open: '08:00', close: '20:00' },
    }),
    aboutUs: 'Café Timor is the premier coffee destination in Dili, serving the finest Timor-Leste coffee beans since 2010. Our beans are sourced directly from local farmers in the highlands, ensuring authentic flavor and supporting local communities.',
    tags: JSON.stringify(['coffee', 'cafe', 'wifi', 'meeting place']),
    likes: 156,
    saves: 42,
    ratingAverage: 4.5,
    ratingCount: 28,
    views: 1250,
    planType: 'pro',
  },
  {
    id: 'biz-2',
    title: 'Hotel Timor',
    slug: 'hotel-timor',
    ownerId: 'user-2',
    categoryId: 'cat-2',
    status: 'live',
    contactName: 'Maria Reis',
    contactNumber: '77005678',
    countryCode: '+670',
    email: 'reservations@hoteltimor.tl',
    address: ' beach road, Dili',
    locationLat: -8.4833,
    locationLng: 125.5856,
    openingHours: JSON.stringify({
      monday: { open: '00:00', close: '00:00' },
      tuesday: { open: '00:00', close: '00:00' },
      wednesday: { open: '00:00', close: '00:00' },
      thursday: { open: '00:00', close: '00:00' },
      friday: { open: '00:00', close: '00:00' },
      saturday: { open: '00:00', close: '00:00' },
      sunday: { open: '00:00', close: '00:00' },
    }),
    aboutUs: 'Hotel Timor offers luxury accommodation with stunning ocean views. Our rooms feature modern amenities, and our restaurant serves both local and international cuisine. Perfect for business travelers and tourists alike.',
    tags: JSON.stringify(['hotel', 'luxury', 'pool', 'wifi', 'restaurant']),
    likes: 289,
    saves: 78,
    ratingAverage: 4.8,
    ratingCount: 52,
    views: 3420,
    planType: 'max',
  },
  {
    id: 'biz-3',
    title: 'Timor Tech Solutions',
    slug: 'timor-tech-solutions',
    ownerId: 'user-3',
    categoryId: 'cat-6',
    status: 'live',
    contactName: 'Carlos Almeida',
    contactNumber: '77009999',
    countryCode: '+670',
    email: 'carlos@timortech.tl',
    address: 'Building Trade, Dili',
    locationLat: -8.5569,
    locationLng: 125.5603,
    openingHours: JSON.stringify({
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: '09:00', close: '13:00' },
      sunday: { open: 'closed', close: 'closed' },
    }),
    aboutUs: 'Timor Tech Solutions provides IT consulting, web development, and digital transformation services to businesses across Timor-Leste. We help local companies embrace technology to grow and compete in the global market.',
    tags: JSON.stringify(['it', 'consulting', 'web development', 'software']),
    likes: 87,
    saves: 23,
    ratingAverage: 4.2,
    ratingCount: 15,
    views: 890,
    planType: 'pro',
  },
  {
    id: 'biz-4',
    title: 'Beach Shop Dili',
    slug: 'beach-shop-dili',
    ownerId: 'user-1',
    categoryId: 'cat-3',
    status: 'live',
    contactName: 'Ana Pereira',
    contactNumber: '77005555',
    countryCode: '+670',
    email: 'ana@beachshop.tl',
    address: 'Coastal Road, Dili',
    locationLat: -8.4833,
    locationLng: 125.5856,
    openingHours: JSON.stringify({
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '09:00', close: '17:00' },
      sunday: { open: '10:00', close: '14:00' },
    }),
    aboutUs: 'Your one-stop shop for beachwear, surfboards, and vacation essentials. We import quality products from around the world and offer competitive prices.',
    tags: JSON.stringify(['beachwear', 'surf', 'swimwear', 'souvenirs']),
    likes: 45,
    saves: 12,
    ratingAverage: 4.0,
    ratingCount: 8,
    views: 456,
    planType: 'basic',
  },
  {
    id: 'biz-5',
    title: 'Timor Dental Clinic',
    slug: 'timor-dental-clinic',
    ownerId: 'user-2',
    categoryId: 'cat-4',
    status: 'live',
    contactName: 'Dr. Sofia Belo',
    contactNumber: '77003333',
    countryCode: '+670',
    email: 'dr.belo@timordental.tl',
    address: 'Medical Center, Dili',
    locationLat: -8.5569,
    locationLng: 125.5603,
    openingHours: JSON.stringify({
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '15:00' },
      saturday: { open: 'closed', close: 'closed' },
      sunday: { open: 'closed', close: 'closed' },
    }),
    aboutUs: 'Professional dental care for the whole family. Our clinic offers general dentistry, orthodontics, and cosmetic procedures using modern equipment and techniques.',
    tags: JSON.stringify(['dentist', 'dental', 'health', 'medical']),
    likes: 123,
    saves: 34,
    ratingAverage: 4.9,
    ratingCount: 41,
    views: 2100,
    planType: 'pro',
  },
];

// Sample products
const products = [
  { id: 'prod-1', title: 'Timor Gold Coffee', price: '$15.00', description: 'Premium roasted coffee beans, 500g', businessPageId: 'biz-1' },
  { id: 'prod-2', title: 'Espresso Special', price: '$4.00', description: 'Double shot espresso with Timor beans', businessPageId: 'biz-1' },
  { id: 'prod-3', title: 'Deluxe Suite', price: '$150/night', description: 'Ocean view suite with breakfast included', businessPageId: 'biz-2' },
  { id: 'prod-4', title: 'Standard Room', price: '$80/night', description: 'Comfortable room with city view', businessPageId: 'biz-2' },
  { id: 'prod-5', title: 'Website Development', price: '$500+', description: 'Custom website with responsive design', businessPageId: 'biz-3' },
  { id: 'prod-6', title: 'IT Consultation', price: '$50/hour', description: 'Expert IT advice for your business', businessPageId: 'biz-3' },
  { id: 'prod-7', title: 'Surfboard Rental', price: '$20/day', description: 'Quality surfboards for all levels', businessPageId: 'biz-4' },
  { id: 'prod-8', title: 'Dental Checkup', price: '$30', description: 'Complete dental examination and cleaning', businessPageId: 'biz-5' },
];

// Sample reviews
const reviews = [
  { id: 'rev-1', businessPageId: 'biz-1', userId: 'user-2', rating: 5, comment: 'Best coffee in Dili! Love the atmosphere.' },
  { id: 'rev-2', businessPageId: 'biz-1', userId: 'user-3', rating: 4, comment: 'Great coffee, but can get crowded on weekends.' },
  { id: 'rev-3', businessPageId: 'biz-2', userId: 'user-1', rating: 5, comment: 'Amazing views and excellent service!' },
  { id: 'rev-4', businessPageId: 'biz-2', userId: 'user-3', rating: 5, comment: 'Best hotel in Timor. Will definitely return.' },
  { id: 'rev-5', businessPageId: 'biz-3', userId: 'user-1', rating: 4, comment: 'Very professional team. Helped us modernize our business.' },
  { id: 'rev-6', businessPageId: 'biz-5', userId: 'user-1', rating: 5, comment: 'Dr. Belo is fantastic! Painless procedure.' },
];

async function seed() {
  console.log('🌱 Starting seed...');
  
  // Insert categories
  console.log('📂 Inserting categories...');
  for (const cat of categories) {
    await db.insert(schema.categories).values(cat).onConflictDoNothing();
  }
  
  // Insert users
  console.log('👤 Inserting users...');
  for (const user of users) {
    await db.insert(schema.users).values(user).onConflictDoNothing();
  }
  
  // Insert business pages
  console.log('🏢 Inserting businesses...');
  for (const biz of businesses) {
    await db.insert(schema.businessPages).values(biz).onConflictDoNothing();
  }
  
  // Insert products
  console.log('📦 Inserting products...');
  for (const prod of products) {
    await db.insert(schema.products).values(prod).onConflictDoNothing();
  }
  
  // Insert reviews
  console.log('⭐ Inserting reviews...');
  for (const rev of reviews) {
    await db.insert(schema.reviews).values(rev).onConflictDoNothing();
  }
  
  console.log('✅ Seed completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${users.length} users`);
  console.log(`   - ${businesses.length} businesses`);
  console.log(`   - ${products.length} products`);
  console.log(`   - ${reviews.length} reviews`);
}

seed().catch(console.error);
