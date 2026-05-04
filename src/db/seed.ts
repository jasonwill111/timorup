// Comprehensive seed script for TimorLIST
// Use better-sqlite3 directly (same as getDb() for local dev)
import { drizzle } from 'drizzle-orm/better-sqlite3';
import SQLite from 'better-sqlite3';
import { scrypt, randomBytes } from 'node:crypto';
import * as schema from './schema';

// better-auth uses scrypt with these exact parameters
async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16);  // 16 bytes -> 32 hex chars
    // N=16384, r=16, p=1, dkLen=64 (matches @noble/hashes default)
    scrypt(password.normalize('NFKC'), salt, 64, { N: 16384, r: 16, p: 1, maxmem: 128 * 1024 * 1024 }, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(`${salt.toString('hex')}:${derivedKey.toString('hex')}`);
    });
  });
}

// Use the same DB path as getDb() in src/lib/db.ts
const localDbPath = process.env.LOCAL_DB_PATH || './.wrangler/state/v3/d1/timorlist-db.sqlite';
const sqlite = new SQLite(localDbPath);
const db = drizzle(sqlite, { schema });

// ========================
// CATEGORIES
// ========================
const categories = [
  { id: 'cat-1', name: 'Restaurants & Cafes', slug: 'restaurants-cafes', description: 'Food and beverage establishments', icon: '🍽️' },
  { id: 'cat-2', name: 'Hotels & Accommodation', slug: 'hotels-accommodation', description: 'Hotels, hostels, and lodging', icon: '🏨' },
  { id: 'cat-3', name: 'Shopping', slug: 'shopping', description: 'Retail stores and shops', icon: '🛒' },
  { id: 'cat-4', name: 'Health & Beauty', slug: 'health-beauty', description: 'Healthcare and beauty services', icon: '💆' },
  { id: 'cat-5', name: 'Automotive', slug: 'automotive', description: 'Car dealers, repair shops', icon: '🚗' },
  { id: 'cat-6', name: 'Professional Services', slug: 'professional-services', description: 'Legal, accounting, consulting', icon: '💼' },
  { id: 'cat-7', name: 'Education', slug: 'education', description: 'Schools, tutoring, training', icon: '📚' },
  { id: 'cat-8', name: 'Entertainment', slug: 'entertainment', description: 'Bars, clubs, venues', icon: '🎉' },
  { id: 'cat-9', name: 'Travel & Tours', slug: 'travel-tours', description: 'Tour operators, travel agencies', icon: '✈️' },
  { id: 'cat-10', name: 'Construction', slug: 'construction', description: 'Builders, contractors, hardware', icon: '🏗️' },
  { id: 'cat-11', name: 'Supermarkets', slug: 'supermarkets', description: 'Grocery stores and supermarkets', icon: '🏪' },
  { id: 'cat-12', name: 'Electronics', slug: 'electronics', description: 'Phones, computers, gadgets', icon: '📱' },
];

// ========================
// USERS
// ========================
const users = [
  { id: 'user-1', email: 'joao.silva@cafetimor.tl', name: 'João Silva', role: 'user', phone: '+6707701234' },
  { id: 'user-2', email: 'maria.reis@hoteltimor.tl', name: 'Maria Reis', role: 'user', phone: '+6707705678' },
  { id: 'user-3', email: 'carlos@timortech.tl', name: 'Carlos Almeida', role: 'user', phone: '+6707709999' },
  { id: 'user-4', email: 'admin@timorlist.tl', name: 'Admin User', role: 'admin', phone: '+6707700000' },
  { id: 'user-5', email: 'fernanda@restaurante.tl', name: 'Fernanda Soares', role: 'user', phone: '+6707701111' },
  { id: 'user-6', email: 'pedro@autocare.tl', name: 'Pedro Santos', role: 'user', phone: '+6707702222' },
  { id: 'user-7', email: 'ana@phoneshop.tl', name: 'Ana Martins', role: 'user', phone: '+6707703333' },
  { id: 'user-8', email: 'jose@tourstimetor.tl', name: 'José Sousa', role: 'user', phone: '+6707704444' },
];

// ========================
// ACCOUNTS (for better-auth password login)
// ========================
const TEST_PASSWORD = 'timor123';
let accountsData: Array<{
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}> = [];

// ========================
// BUSINESSES (Regular businesses)
// ========================
const businesses = [
  // CAT-1: Restaurants & Cafes (5 businesses)
  {
    id: 'biz-1',
    title: 'Café Timor',
    slug: 'cafe-timor',
    ownerId: 'user-1',
    categoryId: 'cat-1',
    entityType: 'business',
    status: 'live',
    contactName: 'João Silva',
    contactNumber: '77012345',
    countryCode: '+670',
    email: 'info@cafetimor.tl',
    address: 'Avenida President Xanana Gusmão, Dili',
    locationLat: -8.5569,
    locationLng: 125.5603,
    openingHours: JSON.stringify({ monday: { open: '07:00', close: '22:00' }, tuesday: { open: '07:00', close: '22:00' }, wednesday: { open: '07:00', close: '22:00' }, thursday: { open: '07:00', close: '22:00' }, friday: { open: '07:00', close: '23:00' }, saturday: { open: '08:00', close: '23:00' }, sunday: { open: '08:00', close: '20:00' } }),
    aboutUs: 'Café Timor is the premier coffee destination in Dili, serving the finest Timor-Leste coffee beans since 2010. Our beans are sourced directly from local farmers in the highlands.',
    tags: JSON.stringify(['coffee', 'cafe', 'wifi', 'meeting place', 'local coffee']),
    likes: 156,
    saves: 42,
    ratingAverage: 4.5,
    ratingCount: 28,
    views: 1250,
    planType: 'pro',
    yearOfEstablishment: 2010,
    socialLinks: JSON.stringify({
      facebook: 'https://facebook.com/cafetimordili',
      instagram: 'https://instagram.com/cafetimordili',
      tiktok: null,
    }),
    latestUpdate: '☕ Now serving breakfast menu! Try our new avocado toast with Timor coffee.',
    latestUpdateDate: new Date('2026-04-25'),
  },
  {
    id: 'biz-6',
    title: 'Restaurante Lospalos',
    slug: 'restaurante-lospalos',
    ownerId: 'user-5',
    categoryId: 'cat-1',
    entityType: 'business',
    status: 'live',
    contactName: 'Fernanda Soares',
    contactNumber: '77011111',
    countryCode: '+670',
    email: 'reservas@lospalos.tl',
    address: 'Rua de Lospalos, Dili',
    locationLat: -8.5500,
    locationLng: 125.5750,
    openingHours: JSON.stringify({ monday: { open: '11:00', close: '22:00' }, tuesday: { open: '11:00', close: '22:00' }, wednesday: { open: '11:00', close: '22:00' }, thursday: { open: '11:00', close: '22:00' }, friday: { open: '11:00', close: '23:00' }, saturday: { open: '11:00', close: '23:00' }, sunday: { open: '11:00', close: '21:00' } }),
    aboutUs: 'Traditional Timorese cuisine with modern touches. Our menu features authentic dishes like Batar Daan (corn and beans),鲜鱼咖喱, and fresh seafood from local fishermen.',
    tags: JSON.stringify(['timorese', 'local food', 'seafood', 'traditional', 'family restaurant']),
    likes: 234,
    saves: 67,
    ratingAverage: 4.6,
    ratingCount: 45,
    views: 1890,
    planType: 'pro',
  },
  {
    id: 'biz-7',
    title: 'Pizza Palace Dili',
    slug: 'pizza-palace-dili',
    ownerId: 'user-5',
    categoryId: 'cat-1',
    entityType: 'business',
    status: 'live',
    contactName: 'Marco Rossi',
    contactNumber: '77022223',
    countryCode: '+670',
    email: 'order@pizzapalace.tl',
    address: 'Coastal Road, Dili',
    locationLat: -8.4833,
    locationLng: 125.5856,
    openingHours: JSON.stringify({ monday: { open: '11:00', close: '22:00' }, tuesday: { open: '11:00', close: '22:00' }, wednesday: { open: '11:00', close: '22:00' }, thursday: { open: '11:00', close: '22:00' }, friday: { open: '11:00', close: '23:00' }, saturday: { open: '11:00', close: '23:00' }, sunday: { open: '12:00', close: '21:00' } }),
    aboutUs: 'Authentic Italian pizzas made with imported flour and local fresh ingredients. Wood-fired oven for that perfect crispy crust.',
    tags: JSON.stringify(['pizza', 'italian', 'delivery', 'family', 'pasta']),
    likes: 189,
    saves: 45,
    ratingAverage: 4.3,
    ratingCount: 32,
    views: 1450,
    planType: 'basic',
  },
  {
    id: 'biz-8',
    title: 'Nerima Japanese Restaurant',
    slug: 'nerima-japanese-restaurant',
    ownerId: 'user-5',
    categoryId: 'cat-1',
    entityType: 'business',
    status: 'live',
    contactName: 'Yuki Tanaka',
    contactNumber: '77033334',
    countryCode: '+670',
    email: 'info@nerima.tl',
    address: 'Comoro Road, Dili',
    locationLat: -8.5500,
    locationLng: 125.5700,
    openingHours: JSON.stringify({ monday: { open: '11:30', close: '14:30' }, tuesday: { open: '11:30', close: '14:30' }, wednesday: { open: '11:30', close: '14:30' }, thursday: { open: '11:30', close: '14:30' }, friday: { open: '11:30', close: '14:30' }, saturday: { open: '11:30', close: '15:00' }, sunday: { open: 'closed', close: 'closed' } }),
    aboutUs: 'Traditional Japanese cuisine with fresh fish flown in weekly from Japan. Sushi, sashimi, ramen, and bento boxes available.',
    tags: JSON.stringify(['japanese', 'sushi', 'sashimi', 'ramen', 'bento']),
    likes: 312,
    saves: 89,
    ratingAverage: 4.8,
    ratingCount: 67,
    views: 2340,
    planType: 'pro',
  },
  {
    id: 'biz-9',
    title: 'Bee Bar & Grill',
    slug: 'bee-bar-grill',
    ownerId: 'user-5',
    categoryId: 'cat-1',
    entityType: 'business',
    status: 'live',
    contactName: 'Bruno Costa',
    contactNumber: '77044445',
    countryCode: '+670',
    email: 'events@beebar.tl',
    address: 'Avenida Marginal, Dili',
    locationLat: -8.4833,
    locationLng: 125.5900,
    openingHours: JSON.stringify({ monday: { open: '17:00', close: '00:00' }, tuesday: { open: '17:00', close: '00:00' }, wednesday: { open: '17:00', close: '00:00' }, thursday: { open: '17:00', close: '01:00' }, friday: { open: '17:00', close: '02:00' }, saturday: { open: '12:00', close: '02:00' }, sunday: { open: '12:00', close: '23:00' } }),
    aboutUs: 'The best steakhouse in Dili with premium cuts imported from Australia. Full bar with cocktails, wines, and local beers.',
    tags: JSON.stringify(['steakhouse', 'bar', 'grill', 'cocktails', 'live music']),
    likes: 278,
    saves: 56,
    ratingAverage: 4.4,
    ratingCount: 38,
    views: 1890,
    planType: 'pro',
  },

  // CAT-2: Hotels & Accommodation (3 businesses)
  {
    id: 'biz-2',
    title: 'Hotel Timor',
    slug: 'hotel-timor',
    ownerId: 'user-2',
    categoryId: 'cat-2',
    entityType: 'business',
    status: 'live',
    contactName: 'Maria Reis',
    contactNumber: '77056789',
    countryCode: '+670',
    email: 'reservations@hoteltimor.tl',
    address: 'Beach Road, Dili',
    locationLat: -8.4833,
    locationLng: 125.5856,
    openingHours: JSON.stringify({ monday: { open: '00:00', close: '23:59' }, tuesday: { open: '00:00', close: '23:59' }, wednesday: { open: '00:00', close: '23:59' }, thursday: { open: '00:00', close: '23:59' }, friday: { open: '00:00', close: '23:59' }, saturday: { open: '00:00', close: '23:59' }, sunday: { open: '00:00', close: '23:59' } }),
    aboutUs: 'Hotel Timor offers luxury accommodation with stunning ocean views. Our rooms feature modern amenities, and our restaurant serves both local and international cuisine.',
    tags: JSON.stringify(['hotel', 'luxury', 'pool', 'wifi', 'restaurant', 'ocean view']),
    likes: 289,
    saves: 78,
    ratingAverage: 4.8,
    ratingCount: 52,
    views: 3420,
    planType: 'max',
    yearOfEstablishment: 2015,
    socialLinks: JSON.stringify({
      facebook: 'https://facebook.com/hoteltimordili',
      instagram: 'https://instagram.com/hoteltimordili',
      tiktok: 'https://tiktok.com/@hoteltimorleste',
    }),
    latestUpdate: '🎉 Summer special! Book 3 nights, get 1 free. Valid until end of May!',
    latestUpdateDate: new Date('2026-04-20'),
  },
  {
    id: 'biz-10',
    title: 'Stay Inn Hostel',
    slug: 'stay-inn-hostel',
    ownerId: 'user-2',
    categoryId: 'cat-2',
    entityType: 'business',
    status: 'live',
    contactName: 'Rita Fernandes',
    contactNumber: '77066666',
    countryCode: '+670',
    email: 'booking@stayinn.tl',
    address: 'Largo de Lahane, Dili',
    locationLat: -8.5450,
    locationLng: 125.5650,
    openingHours: JSON.stringify({ monday: { open: '07:00', close: '22:00' }, tuesday: { open: '07:00', close: '22:00' }, wednesday: { open: '07:00', close: '22:00' }, thursday: { open: '07:00', close: '22:00' }, friday: { open: '07:00', close: '22:00' }, saturday: { open: '07:00', close: '22:00' }, sunday: { open: '07:00', close: '22:00' } }),
    aboutUs: 'Budget-friendly hostel perfect for backpackers and digital nomads. Dorm beds, private rooms, and co-working space available. Free WiFi and breakfast included.',
    tags: JSON.stringify(['hostel', 'backpacker', 'budget', 'coworking', 'dorms']),
    likes: 156,
    saves: 89,
    ratingAverage: 4.2,
    ratingCount: 78,
    views: 2100,
    planType: 'basic',
  },
  {
    id: 'biz-11',
    title: 'Beachfront Villa Rental',
    slug: 'beachfront-villa-rental',
    ownerId: 'user-2',
    categoryId: 'cat-2',
    entityType: 'business',
    status: 'live',
    contactName: 'Paulo Soares',
    contactNumber: '77077777',
    countryCode: '+670',
    email: 'rentals@villadili.tl',
    address: 'Christo Rei Beach, Dili',
    locationLat: -8.4700,
    locationLng: 125.6000,
    openingHours: JSON.stringify({ monday: { open: '08:00', close: '20:00' }, tuesday: { open: '08:00', close: '20:00' }, wednesday: { open: '08:00', close: '20:00' }, thursday: { open: '08:00', close: '20:00' }, friday: { open: '08:00', close: '20:00' }, saturday: { open: '08:00', close: '20:00' }, sunday: { open: '08:00', close: '20:00' } }),
    aboutUs: 'Luxury beachfront villas available for short and long-term rental. Each villa features private pool, full kitchen, and stunning ocean views. Perfect for families and groups.',
    tags: JSON.stringify(['villa', 'beachfront', 'luxury', 'private pool', 'family']),
    likes: 198,
    saves: 112,
    ratingAverage: 4.9,
    ratingCount: 34,
    views: 1560,
    planType: 'max',
  },

  // CAT-3: Shopping (3 businesses)
  {
    id: 'biz-4',
    title: 'Beach Shop Dili',
    slug: 'beach-shop-dili',
    ownerId: 'user-1',
    categoryId: 'cat-3',
    entityType: 'business',
    status: 'live',
    contactName: 'Ana Pereira',
    contactNumber: '77055555',
    countryCode: '+670',
    email: 'ana@beachshop.tl',
    address: 'Coastal Road, Dili',
    locationLat: -8.4833,
    locationLng: 125.5856,
    openingHours: JSON.stringify({ monday: { open: '09:00', close: '18:00' }, tuesday: { open: '09:00', close: '18:00' }, wednesday: { open: '09:00', close: '18:00' }, thursday: { open: '09:00', close: '18:00' }, friday: { open: '09:00', close: '18:00' }, saturday: { open: '09:00', close: '17:00' }, sunday: { open: '10:00', close: '14:00' } }),
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
    id: 'biz-12',
    title: 'Toko Modern Dili',
    slug: 'toko-modern-dili',
    ownerId: 'user-7',
    categoryId: 'cat-3',
    entityType: 'business',
    status: 'live',
    contactName: 'Siti Rahman',
    contactNumber: '77088888',
    countryCode: '+670',
    email: 'info@tokomodern.tl',
    address: 'Avenida 20 de Maio, Dili',
    locationLat: -8.5569,
    locationLng: 125.5603,
    openingHours: JSON.stringify({ monday: { open: '08:00', close: '21:00' }, tuesday: { open: '08:00', close: '21:00' }, wednesday: { open: '08:00', close: '21:00' }, thursday: { open: '08:00', close: '21:00' }, friday: { open: '08:00', close: '21:00' }, saturday: { open: '08:00', close: '21:00' }, sunday: { open: '09:00', close: '18:00' } }),
    aboutUs: 'General store offering household items, clothing, electronics, and daily essentials. Known for quality products at fair prices.',
    tags: JSON.stringify(['general store', 'household', 'clothing', 'electronics']),
    likes: 234,
    saves: 45,
    ratingAverage: 4.1,
    ratingCount: 56,
    views: 3450,
    planType: 'basic',
  },
  {
    id: 'biz-13',
    title: 'Sandal Workshop',
    slug: 'sandal-workshop',
    ownerId: 'user-1',
    categoryId: 'cat-3',
    entityType: 'business',
    status: 'live',
    contactName: 'Francisco Xavier',
    contactNumber: '77099990',
    countryCode: '+670',
    email: 'orders@sandalworkshop.tl',
    address: 'Bairro Pite, Dili',
    locationLat: -8.5400,
    locationLng: 125.5550,
    openingHours: JSON.stringify({ monday: { open: '08:00', close: '17:00' }, tuesday: { open: '08:00', close: '17:00' }, wednesday: { open: '08:00', close: '17:00' }, thursday: { open: '08:00', close: '17:00' }, friday: { open: '08:00', close: '17:00' }, saturday: { open: '09:00', close: '14:00' }, sunday: { open: 'closed', close: 'closed' } }),
    aboutUs: 'Handcrafted Timorese sandals made from local materials. Custom designs available for weddings, traditional ceremonies, and everyday wear. Each pair is unique and made to order.',
    tags: JSON.stringify(['sandals', 'handmade', 'traditional', 'custom', 'leather']),
    likes: 167,
    saves: 89,
    ratingAverage: 4.7,
    ratingCount: 43,
    views: 1230,
    planType: 'basic',
  },

  // CAT-4: Health & Beauty (2 businesses)
  {
    id: 'biz-5',
    title: 'Timor Dental Clinic',
    slug: 'timor-dental-clinic',
    ownerId: 'user-2',
    categoryId: 'cat-4',
    entityType: 'business',
    status: 'live',
    contactName: 'Dr. Sofia Belo',
    contactNumber: '77033333',
    countryCode: '+670',
    email: 'dr.belo@timordental.tl',
    address: 'Medical Center Building, Dili',
    locationLat: -8.5569,
    locationLng: 125.5603,
    openingHours: JSON.stringify({ monday: { open: '08:00', close: '17:00' }, tuesday: { open: '08:00', close: '17:00' }, wednesday: { open: '08:00', close: '17:00' }, thursday: { open: '08:00', close: '17:00' }, friday: { open: '08:00', close: '15:00' }, saturday: { open: 'closed', close: 'closed' }, sunday: { open: 'closed', close: 'closed' } }),
    aboutUs: 'Professional dental care for the whole family. Our clinic offers general dentistry, orthodontics, and cosmetic procedures using modern equipment and techniques.',
    tags: JSON.stringify(['dentist', 'dental', 'health', 'medical']),
    likes: 123,
    saves: 34,
    ratingAverage: 4.9,
    ratingCount: 41,
    views: 2100,
    planType: 'pro',
  },
  {
    id: 'biz-14',
    title: 'Spa Serenity Timor',
    slug: 'spa-serenity-timor',
    ownerId: 'user-2',
    categoryId: 'cat-4',
    entityType: 'business',
    status: 'live',
    contactName: 'Maya Singh',
    contactNumber: '77010101',
    countryCode: '+670',
    email: 'bookings@spaserenity.tl',
    address: 'Hotel Timor Complex, Dili',
    locationLat: -8.4833,
    locationLng: 125.5856,
    openingHours: JSON.stringify({ monday: { open: '10:00', close: '20:00' }, tuesday: { open: '10:00', close: '20:00' }, wednesday: { open: '10:00', close: '20:00' }, thursday: { open: '10:00', close: '20:00' }, friday: { open: '10:00', close: '21:00' }, saturday: { open: '10:00', close: '21:00' }, sunday: { open: '11:00', close: '18:00' } }),
    aboutUs: 'Luxury spa offering traditional Timorese and Asian massage therapies. Services include hot stone massage, aromatherapy, facials, and body treatments.',
    tags: JSON.stringify(['spa', 'massage', 'wellness', 'relaxation', 'aromatherapy']),
    likes: 289,
    saves: 156,
    ratingAverage: 4.8,
    ratingCount: 67,
    views: 2340,
    planType: 'pro',
  },

  // CAT-5: Automotive (2 businesses)
  {
    id: 'biz-15',
    title: 'Timor Auto Service',
    slug: 'timor-auto-service',
    ownerId: 'user-6',
    categoryId: 'cat-5',
    entityType: 'business',
    status: 'live',
    contactName: 'Pedro Santos',
    contactNumber: '77022222',
    countryCode: '+670',
    email: 'service@timorauto.tl',
    address: 'Tasi Tolu Industrial Area, Dili',
    locationLat: -8.5200,
    locationLng: 125.5450,
    openingHours: JSON.stringify({ monday: { open: '07:30', close: '17:30' }, tuesday: { open: '07:30', close: '17:30' }, wednesday: { open: '07:30', close: '17:30' }, thursday: { open: '07:30', close: '17:30' }, friday: { open: '07:30', close: '17:30' }, saturday: { open: '08:00', close: '12:00' }, sunday: { open: 'closed', close: 'closed' } }),
    aboutUs: 'Full-service auto repair shop specializing in Japanese and Korean vehicles. Services include oil changes, brake repairs, engine diagnostics, and general maintenance.',
    tags: JSON.stringify(['auto repair', 'mechanic', 'oil change', 'brakes', 'diagnostics']),
    likes: 178,
    saves: 67,
    ratingAverage: 4.5,
    ratingCount: 89,
    views: 2890,
    planType: 'basic',
  },
  {
    id: 'biz-16',
    title: 'Dili Car Sales',
    slug: 'dili-car-sales',
    ownerId: 'user-6',
    categoryId: 'cat-5',
    entityType: 'business',
    status: 'live',
    contactName: 'Luis Gonzaga',
    contactNumber: '77030303',
    countryCode: '+670',
    email: 'sales@dilcarsales.tl',
    address: 'Avenida dos Heroes, Dili',
    locationLat: -8.5500,
    locationLng: 125.5750,
    openingHours: JSON.stringify({ monday: { open: '08:00', close: '17:00' }, tuesday: { open: '08:00', close: '17:00' }, wednesday: { open: '08:00', close: '17:00' }, thursday: { open: '08:00', close: '17:00' }, friday: { open: '08:00', close: '17:00' }, saturday: { open: '09:00', close: '14:00' }, sunday: { open: 'closed', close: 'closed' } }),
    aboutUs: 'Pre-owned vehicle dealership offering quality cars, SUVs, and commercial vehicles. All vehicles inspected and serviced. Financing available.',
    tags: JSON.stringify(['car dealership', 'used cars', 'suv', 'financing', 'trade-in']),
    likes: 234,
    saves: 89,
    ratingAverage: 4.3,
    ratingCount: 45,
    views: 3450,
    planType: 'pro',
  },

  // CAT-6: Professional Services (2 businesses)
  {
    id: 'biz-3',
    title: 'Timor Tech Solutions',
    slug: 'timor-tech-solutions',
    ownerId: 'user-3',
    categoryId: 'cat-6',
    entityType: 'business',
    status: 'live',
    contactName: 'Carlos Almeida',
    contactNumber: '77099999',
    countryCode: '+670',
    email: 'carlos@timortech.tl',
    address: 'Building Trade Timor, Dili',
    locationLat: -8.5569,
    locationLng: 125.5603,
    openingHours: JSON.stringify({ monday: { open: '08:00', close: '17:00' }, tuesday: { open: '08:00', close: '17:00' }, wednesday: { open: '08:00', close: '17:00' }, thursday: { open: '08:00', close: '17:00' }, friday: { open: '08:00', close: '17:00' }, saturday: { open: '09:00', close: '13:00' }, sunday: { open: 'closed', close: 'closed' } }),
    aboutUs: 'IT consulting, web development, and digital transformation services to businesses across Timor-Leste. We help local companies embrace technology.',
    tags: JSON.stringify(['it', 'consulting', 'web development', 'software', 'digital']),
    likes: 87,
    saves: 23,
    ratingAverage: 4.2,
    ratingCount: 15,
    views: 890,
    planType: 'pro',
    yearOfEstablishment: 2020,
    socialLinks: JSON.stringify({
      facebook: 'https://facebook.com/timortechsolutions',
      instagram: 'https://instagram.com/timortechsolutions',
      tiktok: 'https://tiktok.com/@timortechsolutions',
    }),
    latestUpdate: '💻 New service: AI integration for businesses. Contact us for a free consultation!',
    latestUpdateDate: new Date('2026-04-26'),
  },
  {
    id: 'biz-17',
    title: 'Timor Law Partners',
    slug: 'timor-law-partners',
    ownerId: 'user-3',
    categoryId: 'cat-6',
    entityType: 'business',
    status: 'live',
    contactName: 'Dr. Antonio Freitas',
    contactNumber: '77040404',
    countryCode: '+670',
    email: 'consult@timorlaw.tl',
    address: 'Edificio Mandarin, Dili',
    locationLat: -8.5569,
    locationLng: 125.5603,
    openingHours: JSON.stringify({ monday: { open: '08:30', close: '17:30' }, tuesday: { open: '08:30', close: '17:30' }, wednesday: { open: '08:30', close: '17:30' }, thursday: { open: '08:30', close: '17:30' }, friday: { open: '08:30', close: '17:30' }, saturday: { open: 'closed', close: 'closed' }, sunday: { open: 'closed', close: 'closed' } }),
    aboutUs: 'Full-service law firm providing legal counsel in corporate law, property transactions, employment law, and civil litigation.',
    tags: JSON.stringify(['lawyer', 'legal', 'corporate', 'property', 'consultation']),
    likes: 56,
    saves: 12,
    ratingAverage: 4.6,
    ratingCount: 18,
    views: 780,
    planType: 'basic',
  },

  // CAT-7: Education (2 businesses)
  {
    id: 'biz-18',
    title: 'English First Language School',
    slug: 'english-first-language-school',
    ownerId: 'user-7',
    categoryId: 'cat-7',
    entityType: 'business',
    status: 'live',
    contactName: 'Sarah Mitchell',
    contactNumber: '77050505',
    countryCode: '+670',
    email: 'admissions@eflschool.tl',
    address: 'Kelapa Square, Dili',
    locationLat: -8.5500,
    locationLng: 125.5700,
    openingHours: JSON.stringify({ monday: { open: '07:00', close: '17:00' }, tuesday: { open: '07:00', close: '17:00' }, wednesday: { open: '07:00', close: '17:00' }, thursday: { open: '07:00', close: '17:00' }, friday: { open: '07:00', close: '17:00' }, saturday: { open: '08:00', close: '12:00' }, sunday: { open: 'closed', close: 'closed' } }),
    aboutUs: 'International standard primary school offering English-medium education from Kindergarten to Grade 6. Small class sizes and experienced teachers.',
    tags: JSON.stringify(['school', 'education', 'english', 'primary', 'kindergarten']),
    likes: 345,
    saves: 123,
    ratingAverage: 4.9,
    ratingCount: 56,
    views: 4560,
    planType: 'max',
    yearOfEstablishment: 2012,
    socialLinks: JSON.stringify({
      facebook: 'https://facebook.com/eflschooltimor',
      instagram: 'https://instagram.com/eflschooltimor',
      tiktok: null,
    }),
    latestUpdate: '📚 Enrollment now open for 2026-2027 school year! Limited spots available.',
    latestUpdateDate: new Date('2026-04-15'),
  },
  {
    id: 'biz-19',
    title: 'Digital Skills Academy',
    slug: 'digital-skills-academy',
    ownerId: 'user-3',
    categoryId: 'cat-7',
    entityType: 'business',
    status: 'live',
    contactName: 'Manuel Gomes',
    contactNumber: '77060606',
    countryCode: '+670',
    email: 'courses@digiskills.tl',
    address: 'Innovation Hub, Dili',
    locationLat: -8.5569,
    locationLng: 125.5603,
    openingHours: JSON.stringify({ monday: { open: '09:00', close: '19:00' }, tuesday: { open: '09:00', close: '19:00' }, wednesday: { open: '09:00', close: '19:00' }, thursday: { open: '09:00', close: '19:00' }, friday: { open: '09:00', close: '19:00' }, saturday: { open: '10:00', close: '16:00' }, sunday: { open: 'closed', close: 'closed' } }),
    aboutUs: 'Technology training institute offering courses in web development, graphic design, digital marketing, and office productivity. Job placement assistance included.',
    tags: JSON.stringify(['training', 'coding', 'web development', 'digital marketing', 'certification']),
    likes: 234,
    saves: 178,
    ratingAverage: 4.7,
    ratingCount: 89,
    views: 3450,
    planType: 'pro',
  },

  // CAT-9: Travel & Tours (2 businesses)
  {
    id: 'biz-20',
    title: 'Tours Time Timor',
    slug: 'tours-time-timor',
    ownerId: 'user-8',
    categoryId: 'cat-9',
    entityType: 'business',
    status: 'live',
    contactName: 'José Sousa',
    contactNumber: '77044444',
    countryCode: '+670',
    email: 'tours@timetor.tl',
    address: 'Gds Building, Dili',
    locationLat: -8.5569,
    locationLng: 125.5603,
    openingHours: JSON.stringify({ monday: { open: '08:00', close: '18:00' }, tuesday: { open: '08:00', close: '18:00' }, wednesday: { open: '08:00', close: '18:00' }, thursday: { open: '08:00', close: '18:00' }, friday: { open: '08:00', close: '18:00' }, saturday: { open: '09:00', close: '16:00' }, sunday: { open: '09:00', close: '16:00' } }),
    aboutUs: 'Award-winning tour operator offering day trips, multi-day adventures, and customized itineraries. Explore waterfalls, mountains, beaches, and cultural villages.',
    tags: JSON.stringify(['tours', 'adventure', 'nature', 'culture', 'customized']),
    likes: 567,
    saves: 234,
    ratingAverage: 4.9,
    ratingCount: 234,
    views: 8900,
    planType: 'max',
    yearOfEstablishment: 2018,
    socialLinks: JSON.stringify({
      facebook: 'https://facebook.com/tourstimetor',
      instagram: 'https://instagram.com/tourstimetor',
      tiktok: 'https://tiktok.com/@tourstimetor',
    }),
    latestUpdate: '🏔️ New adventure! Mountain sunrise tours now available. Limited spots!',
    latestUpdateDate: new Date('2026-04-24'),
  },
  {
    id: 'biz-21',
    title: 'Timor Dive Center',
    slug: 'timor-dive-center',
    ownerId: 'user-8',
    categoryId: 'cat-9',
    entityType: 'business',
    status: 'live',
    contactName: 'Lisa Chen',
    contactNumber: '77070707',
    countryCode: '+670',
    email: 'dive@timordive.tl',
    address: 'Aqua Marina Complex, Dili',
    locationLat: -8.4833,
    locationLng: 125.5856,
    openingHours: JSON.stringify({ monday: { open: '07:00', close: '18:00' }, tuesday: { open: '07:00', close: '18:00' }, wednesday: { open: '07:00', close: '18:00' }, thursday: { open: '07:00', close: '18:00' }, friday: { open: '07:00', close: '18:00' }, saturday: { open: '07:00', close: '18:00' }, sunday: { open: '07:00', close: '18:00' } }),
    aboutUs: 'PADI-certified dive center offering scuba diving, snorkeling, and diving courses. Explore pristine reefs, WWII wrecks, and swim with mantas.',
    tags: JSON.stringify(['diving', 'scuba', 'snorkeling', 'padi', 'marine']),
    likes: 456,
    saves: 234,
    ratingAverage: 4.9,
    ratingCount: 156,
    views: 5670,
    planType: 'max',
    yearOfEstablishment: 2019,
    socialLinks: JSON.stringify({
      facebook: 'https://facebook.com/timordivecenter',
      instagram: 'https://instagram.com/timordivecenter',
      tiktok: 'https://tiktok.com/@timordivecenter',
    }),
    latestUpdate: '🤿 Manta season is here! Book your dive now and swim with majestic mantas.',
    latestUpdateDate: new Date('2026-04-22'),
  },

  // CAT-12: Electronics (2 businesses)
  {
    id: 'biz-22',
    title: 'Phone World Dili',
    slug: 'phone-world-dili',
    ownerId: 'user-7',
    categoryId: 'cat-12',
    entityType: 'business',
    status: 'live',
    contactName: 'Ana Martins',
    contactNumber: '77033333',
    countryCode: '+670',
    email: 'sales@phoneworld.tl',
    address: 'Largo de Lecidere, Dili',
    locationLat: -8.5569,
    locationLng: 125.5603,
    openingHours: JSON.stringify({ monday: { open: '09:00', close: '19:00' }, tuesday: { open: '09:00', close: '19:00' }, wednesday: { open: '09:00', close: '19:00' }, thursday: { open: '09:00', close: '19:00' }, friday: { open: '09:00', close: '19:00' }, saturday: { open: '09:00', close: '19:00' }, sunday: { open: '10:00', close: '16:00' } }),
    aboutUs: 'Authorized dealer for Samsung, iPhone, and Xiaomi phones. Also offering accessories, repairs, and prepaid plans from all carriers.',
    tags: JSON.stringify(['phones', 'electronics', 'samsung', 'iphone', 'repairs']),
    likes: 345,
    saves: 89,
    ratingAverage: 4.3,
    ratingCount: 123,
    views: 4560,
    planType: 'pro',
  },
  {
    id: 'biz-23',
    title: 'TechFix Computer Services',
    slug: 'techfix-computer-services',
    ownerId: 'user-3',
    categoryId: 'cat-12',
    entityType: 'business',
    status: 'live',
    contactName: 'David Huang',
    contactNumber: '77080808',
    countryCode: '+670',
    email: 'help@techfix.tl',
    address: 'Avenida 20 de Maio, Dili',
    locationLat: -8.5569,
    locationLng: 125.5603,
    openingHours: JSON.stringify({ monday: { open: '08:30', close: '18:00' }, tuesday: { open: '08:30', close: '18:00' }, wednesday: { open: '08:30', close: '18:00' }, thursday: { open: '08:30', close: '18:00' }, friday: { open: '08:30', close: '18:00' }, saturday: { open: '09:00', close: '14:00' }, sunday: { open: 'closed', close: 'closed' } }),
    aboutUs: 'Computer repair, laptop service, and IT support. Virus removal, data recovery, network setup, and custom PC builds.',
    tags: JSON.stringify(['computer repair', 'laptop', 'virus removal', 'data recovery', 'networking']),
    likes: 234,
    saves: 67,
    ratingAverage: 4.5,
    ratingCount: 89,
    views: 2890,
    planType: 'basic',
  },
];

// ========================
// ORGANIZATIONS (Government, NGO, Nonprofit, Foundation)
// ========================
const organizations = [
  // Government Agencies
  {
    id: 'org-1',
    title: 'Timor-Leste Government Portal',
    slug: 'gov-portal',
    ownerId: 'user-4',
    categoryId: null,
    entityType: 'organization',
    organizationType: 'government',
    status: 'live',
    verifiedBadge: true,
    contactName: 'Government Information Service',
    contactNumber: '77000000',
    countryCode: '+670',
    email: 'info@timor-leste.gov.tl',
    address: 'Government Palace, Dili',
    locationLat: -8.5569,
    locationLng: 125.5603,
    openingHours: JSON.stringify({
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: 'closed', close: 'closed' },
      sunday: { open: 'closed', close: 'closed' },
    }),
    aboutUs: 'Official government portal providing public services, information, and citizen engagement platforms for Timor-Leste.',
    registrationUrl: 'https://timor-leste.gov.tl',
    likes: 456,
    saves: 89,
    ratingAverage: 3.8,
    ratingCount: 23,
    views: 5600,
    planType: null,
  },
  {
    id: 'org-2',
    title: 'Ministry of Tourism',
    slug: 'ministry-tourism',
    ownerId: 'user-4',
    categoryId: null,
    entityType: 'organization',
    organizationType: 'government',
    status: 'live',
    verifiedBadge: true,
    contactName: 'Tourism Ministry',
    contactNumber: '77011111',
    countryCode: '+670',
    email: 'tourism@timor-leste.gov.tl',
    address: 'Ministry Complex, Dili',
    locationLat: -8.5569,
    locationLng: 125.5603,
    openingHours: JSON.stringify({
      monday: { open: '08:00', close: '16:30' },
      tuesday: { open: '08:00', close: '16:30' },
      wednesday: { open: '08:00', close: '16:30' },
      thursday: { open: '08:00', close: '16:30' },
      friday: { open: '08:00', close: '16:30' },
      saturday: { open: 'closed', close: 'closed' },
      sunday: { open: 'closed', close: 'closed' },
    }),
    aboutUs: 'Promoting Timor-Leste as a premier tourist destination. We support local tourism businesses and showcase our beautiful country.',
    registrationUrl: 'https://tourism.gov.tl',
    likes: 234,
    saves: 56,
    ratingAverage: 4.1,
    ratingCount: 12,
    views: 3200,
    planType: null,
  },
  // NGOs
  {
    id: 'org-3',
    title: 'Fundasaun Haburas',
    slug: 'fundasaun-haburas',
    ownerId: 'user-4',
    categoryId: null,
    entityType: 'organization',
    organizationType: 'ngo',
    status: 'live',
    verifiedBadge: false,
    contactName: 'Executive Director',
    contactNumber: '77022222',
    countryCode: '+670',
    email: 'info@haburas.org.tl',
    address: 'Casa de Jose, Dili',
    locationLat: -8.5569,
    locationLng: 125.5603,
    openingHours: JSON.stringify({
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: 'closed', close: 'closed' },
      sunday: { open: 'closed', close: 'closed' },
    }),
    aboutUs: 'Environmental conservation and sustainable development NGO working to protect Timor-Leste natural resources and promote eco-tourism.',
    registrationUrl: 'https://haburas.org.tl',
    likes: 178,
    saves: 45,
    ratingAverage: 4.6,
    ratingCount: 18,
    views: 2100,
    planType: null,
  },
  {
    id: 'org-4',
    title: 'Care Timor-Leste',
    slug: 'care-timor',
    ownerId: 'user-4',
    categoryId: null,
    entityType: 'organization',
    organizationType: 'ngo',
    status: 'live',
    verifiedBadge: false,
    contactName: 'Country Director',
    contactNumber: '77033333',
    countryCode: '+670',
    email: 'timor@care.org',
    address: 'Comoro, Dili',
    locationLat: -8.5500,
    locationLng: 125.5700,
    openingHours: JSON.stringify({
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: 'closed', close: 'closed' },
      sunday: { open: 'closed', close: 'closed' },
    }),
    aboutUs: 'International NGO working to end global poverty. We support community development, education, and healthcare programs.',
    registrationUrl: 'https://caretimorleste.org',
    likes: 234,
    saves: 67,
    ratingAverage: 4.4,
    ratingCount: 21,
    views: 2800,
    planType: null,
  },
  // Nonprofits
  {
    id: 'org-5',
    title: 'Casa de Esperança',
    slug: 'casa-esperanca',
    ownerId: 'user-4',
    categoryId: null,
    entityType: 'organization',
    organizationType: 'nonprofit',
    status: 'live',
    verifiedBadge: false,
    contactName: 'Sister Maria',
    contactNumber: '77044444',
    countryCode: '+670',
    email: 'contact@casaesperanca.tl',
    address: 'Lospalos, Timor-Leste',
    locationLat: -8.5200,
    locationLng: 126.9800,
    openingHours: JSON.stringify({
      monday: { open: '07:00', close: '18:00' },
      tuesday: { open: '07:00', close: '18:00' },
      wednesday: { open: '07:00', close: '18:00' },
      thursday: { open: '07:00', close: '18:00' },
      friday: { open: '07:00', close: '18:00' },
      saturday: { open: '07:00', close: '12:00' },
      sunday: { open: '07:00', close: '12:00' },
    }),
    aboutUs: 'Children\'s home providing education, healthcare, and shelter to orphaned and vulnerable children across Timor-Leste.',
    likes: 345,
    saves: 89,
    ratingAverage: 4.9,
    ratingCount: 34,
    views: 4100,
    planType: null,
  },
  // Foundations
  {
    id: 'org-6',
    title: 'Alola Foundation',
    slug: 'alola-foundation',
    ownerId: 'user-4',
    categoryId: null,
    entityType: 'organization',
    organizationType: 'foundation',
    status: 'live',
    verifiedBadge: true,
    contactName: 'President',
    contactNumber: '77055555',
    countryCode: '+670',
    email: 'info@alola.org.tl',
    address: 'Dili, Timor-Leste',
    locationLat: -8.5569,
    locationLng: 125.5603,
    openingHours: JSON.stringify({
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: 'closed', close: 'closed' },
      sunday: { open: 'closed', close: 'closed' },
    }),
    aboutUs: 'Women\'s foundation supporting economic empowerment, education, and social justice for women and families in Timor-Leste.',
    registrationUrl: 'https://alola.org.tl',
    likes: 267,
    saves: 78,
    ratingAverage: 4.7,
    ratingCount: 28,
    views: 3500,
    planType: null,
  },
];

// ========================
// PRODUCTS/SERVICES (SKUs)
// ========================
const products = [
  // ====================
  // CAT-1: RESTAURANTS & CAFES
  // ====================
  // Café Timor (biz-1) - 5 products
  { id: 'prod-001', title: 'Timor Gold Coffee Beans (500g)', price: '$15.00', description: 'Premium roasted coffee beans from Ermera highlands', businessPageId: 'biz-1' },
  { id: 'prod-002', title: 'Espresso Special', price: '$4.00', description: 'Double shot espresso with signature Timor beans', businessPageId: 'biz-1' },
  { id: 'prod-003', title: 'Café Latte', price: '$5.00', description: 'Smooth latte with steamed milk', businessPageId: 'biz-1' },
  { id: 'prod-004', title: 'Cappuccino', price: '$5.00', description: 'Classic Italian-style cappuccino', businessPageId: 'biz-1' },
  { id: 'prod-005', title: 'Meeting Room Rental (2hrs)', price: '$40.00', description: 'Private room with WiFi, projector, and coffee service', businessPageId: 'biz-1' },

  // Restaurante Lospalos (biz-6) - 6 products
  { id: 'prod-006', title: 'Batar Daan Set', price: '$12.00', description: 'Traditional corn and bean stew with rice', businessPageId: 'biz-6' },
  { id: 'prod-007', title: 'Fresh Fish Curry', price: '$18.00', description: 'Daily catch in traditional Timorese curry sauce', businessPageId: 'biz-6' },
  { id: 'prod-008', title: 'Grilled Prawns', price: '$22.00', description: 'Large tiger prawns with garlic butter', businessPageId: 'biz-6' },
  { id: 'prod-009', title: 'Chicken Satay (6 pcs)', price: '$10.00', description: 'Marinated chicken skewers with peanut sauce', businessPageId: 'biz-6' },
  { id: 'prod-010', title: 'Vegetable Stir Fry', price: '$8.00', description: 'Seasonal vegetables with local herbs', businessPageId: 'biz-6' },
  { id: 'prod-011', title: 'Family Feast Package', price: '$65.00', description: 'Feed 4 people - 2 mains, 2 sides, rice, drinks', businessPageId: 'biz-6' },

  // Pizza Palace (biz-7) - 6 products
  { id: 'prod-012', title: 'Margherita Pizza (12")', price: '$14.00', description: 'Tomato sauce, mozzarella, fresh basil', businessPageId: 'biz-7' },
  { id: 'prod-013', title: 'Pepperoni Pizza (12")', price: '$16.00', description: 'Classic pepperoni with mozzarella', businessPageId: 'biz-7' },
  { id: 'prod-014', title: 'Seafood Pizza (12")', price: '$19.00', description: 'Shrimp, squid, and fish with garlic sauce', businessPageId: 'biz-7' },
  { id: 'prod-015', title: 'Pasta Carbonara', price: '$13.00', description: 'Creamy bacon and egg pasta', businessPageId: 'biz-7' },
  { id: 'prod-016', title: 'Garlic Bread', price: '$5.00', description: 'Crusty bread with garlic butter', businessPageId: 'biz-7' },
  { id: 'prod-017', title: 'Family Pizza Combo', price: '$35.00', description: '2 large pizzas + garlic bread + 2L drink', businessPageId: 'biz-7' },

  // Nerima Japanese (biz-8) - 7 products
  { id: 'prod-018', title: 'Salmon Sashimi (8 pcs)', price: '$18.00', description: 'Fresh Atlantic salmon', businessPageId: 'biz-8' },
  { id: 'prod-019', title: 'Mixed Sushi Platter (12 pcs)', price: '$25.00', description: 'Chef selection of nigiri and maki', businessPageId: 'biz-8' },
  { id: 'prod-020', title: 'Chicken Teriyaki Bento', price: '$15.00', description: 'Grilled chicken with teriyaki sauce, rice, salad', businessPageId: 'biz-8' },
  { id: 'prod-021', title: 'Pork Ramen', price: '$14.00', description: 'Rich pork broth, chashu, soft egg, nori', businessPageId: 'biz-8' },
  { id: 'prod-022', title: 'Vegetable Tempura', price: '$12.00', description: 'Seasonal vegetables in light batter', businessPageId: 'biz-8' },
  { id: 'prod-023', title: 'Edamame', price: '$5.00', description: 'Steamed soybeans with sea salt', businessPageId: 'biz-8' },
  { id: 'prod-024', title: 'Miso Soup', price: '$4.00', description: 'Traditional Japanese soup with tofu', businessPageId: 'biz-8' },

  // Bee Bar & Grill (biz-9) - 6 products
  { id: 'prod-025', title: 'Ribeye Steak (300g)', price: '$35.00', description: 'Australian grain-fed, grilled to perfection', businessPageId: 'biz-9' },
  { id: 'prod-026', title: 'BBQ Ribs Full Rack', price: '$28.00', description: 'Slow-cooked pork ribs with BBQ sauce', businessPageId: 'biz-9' },
  { id: 'prod-027', title: 'Grilled Fish of the Day', price: '$26.00', description: 'Fresh local fish with herbs and lemon', businessPageId: 'biz-9' },
  { id: 'prod-028', title: 'Classic Burger', price: '$15.00', description: '200g beef patty, cheese, bacon, fries', businessPageId: 'biz-9' },
  { id: 'prod-029', title: 'Cocktail (House)', price: '$8.00', description: 'Mojito, Margarita, or Daiquiri', businessPageId: 'biz-9' },
  { id: 'prod-030', title: 'Beer Tower (2L)', price: '$20.00', description: 'Local beer on tap', businessPageId: 'biz-9' },

  // ====================
  // CAT-2: HOTELS & ACCOMMODATION
  // ====================
  // Hotel Timor (biz-2) - 6 products
  { id: 'prod-031', title: 'Standard Room', price: '$80/night', description: 'City view, queen bed, AC, WiFi', businessPageId: 'biz-2' },
  { id: 'prod-032', title: 'Deluxe Ocean View', price: '$120/night', description: 'Sea view, king bed, balcony, minibar', businessPageId: 'biz-2' },
  { id: 'prod-033', title: 'Executive Suite', price: '$180/night', description: 'Ocean view, separate lounge, jacuzzi', businessPageId: 'biz-2' },
  { id: 'prod-034', title: 'Airport Transfer', price: '$25.00', description: 'One-way transfer to Dili airport', businessPageId: 'biz-2' },
  { id: 'prod-035', title: 'Breakfast Buffet', price: '$15/person', description: 'International breakfast at Ocean Restaurant', businessPageId: 'biz-2' },
  { id: 'prod-036', title: 'Day Use Room', price: '$45.00', description: '4-hour room access with shower', businessPageId: 'biz-2' },

  // Stay Inn Hostel (biz-10) - 5 products
  { id: 'prod-037', title: 'Dorm Bed (Mixed)', price: '$15/night', description: '6-bed mixed dorm, locker, linens included', businessPageId: 'biz-10' },
  { id: 'prod-038', title: 'Female Dorm (4 bed)', price: '$18/night', description: 'Female-only room with shared bathroom', businessPageId: 'biz-10' },
  { id: 'prod-039', title: 'Private Room (Twin)', price: '$40/night', description: 'Private twin room with shared bathroom', businessPageId: 'biz-10' },
  { id: 'prod-040', title: 'Co-working Day Pass', price: '$10/day', description: 'Hot desk, fast WiFi, coffee included', businessPageId: 'biz-10' },
  { id: 'prod-041', title: 'Laundry Service', price: '$5.00', description: 'Washing and drying service', businessPageId: 'biz-10' },

  // Beachfront Villa (biz-11) - 4 products
  { id: 'prod-042', title: '1-Bedroom Villa (3 nights min)', price: '$150/night', description: 'Private pool, full kitchen, ocean view', businessPageId: 'biz-11' },
  { id: 'prod-043', title: '2-Bedroom Villa (3 nights min)', price: '$220/night', description: 'Private pool, full kitchen, beach access', businessPageId: 'biz-11' },
  { id: 'prod-044', title: 'Chef Service', price: '$80/day', description: 'Private chef for breakfast, lunch, dinner', businessPageId: 'biz-11' },
  { id: 'prod-045', title: 'Kayak Rental', price: '$25/day', description: 'Single or double kayak', businessPageId: 'biz-11' },

  // ====================
  // CAT-3: SHOPPING
  // ====================
  // Beach Shop (biz-4) - 6 products
  { id: 'prod-046', title: 'Surfboard Rental', price: '$20/day', description: 'Quality boards for all skill levels', businessPageId: 'biz-4' },
  { id: 'prod-047', title: 'Snorkeling Set', price: '$15/day', description: 'Mask, snorkel, fins included', businessPageId: 'biz-4' },
  { id: 'prod-048', title: 'Beach Umbrella', price: '$5/day', description: 'Large beach umbrella with stand', businessPageId: 'biz-4' },
  { id: 'prod-049', title: 'Rash Guard (S/M/L/XL)', price: '$25.00', description: 'UV protection swim shirt', businessPageId: 'biz-4' },
  { id: 'prod-050', title: 'Timor Coffee Bag (200g)', price: '$8.00', description: 'Local coffee beans gift pack', businessPageId: 'biz-4' },
  { id: 'prod-051', title: 'Souvenir T-Shirt', price: '$12.00', description: 'Timor-Leste designs, cotton', businessPageId: 'biz-4' },

  // Toko Modern (biz-12) - 6 products
  { id: 'prod-052', title: 'Bed Sheet Set (Queen)', price: '$35.00', description: 'Cotton, various colors available', businessPageId: 'biz-12' },
  { id: 'prod-053', title: 'Kitchen Pot Set', price: '$45.00', description: '6-piece stainless steel', businessPageId: 'biz-12' },
  { id: 'prod-054', title: 'LED Bulb (9W)', price: '$5.00', description: 'Energy saving, daylight white', businessPageId: 'biz-12' },
  { id: 'prod-055', title: 'Extension Cord (3m)', price: '$8.00', description: '3-outlet with switch', businessPageId: 'biz-12' },
  { id: 'prod-056', title: 'Umbrella (Auto)', price: '$12.00', description: 'Compact, windproof', businessPageId: 'biz-12' },
  { id: 'prod-057', title: 'Bath Towel Set', price: '$15.00', description: 'Set of 2, various colors', businessPageId: 'biz-12' },

  // Sandal Workshop (biz-13) - 5 products
  { id: 'prod-058', title: 'Classic Timor Sandals', price: '$25.00', description: 'Handmade leather, traditional design', businessPageId: 'biz-13' },
  { id: 'prod-059', title: 'Custom Wedding Sandals', price: '$65.00', description: 'Bespoke design for ceremonies', businessPageId: 'biz-13' },
  { id: 'prod-060', title: 'Beaded Sandals', price: '$40.00', description: 'Traditional beadwork, colorful', businessPageId: 'biz-13' },
  { id: 'prod-061', title: 'Kids Sandals', price: '$18.00', description: 'Mini versions of classic style', businessPageId: 'biz-13' },
  { id: 'prod-062', title: 'Leather Repair Service', price: '$15.00', description: 'Resole and refresh existing sandals', businessPageId: 'biz-13' },

  // ====================
  // CAT-4: HEALTH & BEAUTY
  // ====================
  // Timor Dental (biz-5) - 6 products
  { id: 'prod-063', title: 'Dental Checkup', price: '$30.00', description: 'Complete examination and consultation', businessPageId: 'biz-5' },
  { id: 'prod-064', title: 'Teeth Cleaning', price: '$50.00', description: 'Professional hygiene treatment', businessPageId: 'biz-5' },
  { id: 'prod-065', title: 'Composite Filling', price: '$80/tooth', description: 'Tooth-colored filling', businessPageId: 'biz-5' },
  { id: 'prod-066', title: 'Teeth Whitening', price: '$150.00', description: 'Professional LED whitening', businessPageId: 'biz-5' },
  { id: 'prod-067', title: 'Tooth Extraction', price: '$60.00', description: 'Simple extraction by dentist', businessPageId: 'biz-5' },
  { id: 'prod-068', title: 'Dental Crown', price: '$300.00', description: 'Porcelain crown per tooth', businessPageId: 'biz-5' },

  // Spa Serenity (biz-14) - 6 products
  { id: 'prod-069', title: 'Balinese Massage (60min)', price: '$45.00', description: 'Traditional full body massage', businessPageId: 'biz-14' },
  { id: 'prod-070', title: 'Hot Stone Therapy', price: '$65.00', description: 'Deep relaxation with heated stones', businessPageId: 'biz-14' },
  { id: 'prod-071', title: 'Aromatherapy Facial', price: '$55.00', description: 'Essential oil facial treatment', businessPageId: 'biz-14' },
  { id: 'prod-072', title: 'Manicure & Pedicure', price: '$35.00', description: 'Nail care and polish', businessPageId: 'biz-14' },
  { id: 'prod-073', title: 'Body Scrub Treatment', price: '$50.00', description: 'Full body exfoliation', businessPageId: 'biz-14' },
  { id: 'prod-074', title: 'Couple Massage Package', price: '$160.00', description: '2 people, 90min massage + champagne', businessPageId: 'biz-14' },

  // ====================
  // CAT-5: AUTOMOTIVE
  // ====================
  // Timor Auto Service (biz-15) - 6 products
  { id: 'prod-075', title: 'Oil Change (Sedan)', price: '$35.00', description: 'Synthetic oil, filter included', businessPageId: 'biz-15' },
  { id: 'prod-076', title: 'Brake Pad Replacement', price: '$80.00', description: 'Front or rear axle', businessPageId: 'biz-15' },
  { id: 'prod-077', title: 'Tire Rotation & Balance', price: '$25.00', description: '4-wheel rotation and balance', businessPageId: 'biz-15' },
  { id: 'prod-078', title: 'Engine Diagnostic', price: '$40.00', description: 'Full computer scan report', businessPageId: 'biz-15' },
  { id: 'prod-079', title: 'AC Service', price: '$60.00', description: 'Gas refill and system check', businessPageId: 'biz-15' },
  { id: 'prod-080', title: 'Full Service (Sedan)', price: '$120.00', description: 'Oil, filters, fluids, 50-point inspection', businessPageId: 'biz-15' },

  // Dili Car Sales (biz-16) - 5 products
  { id: 'prod-081', title: 'Pre-Owned Sedan', price: '$8,500', description: '2018 Toyota Camry, low mileage', businessPageId: 'biz-16' },
  { id: 'prod-082', title: 'SUV - Toyota Fortuner', price: '$18,000', description: '2019 model, 4x4, low km', businessPageId: 'biz-16' },
  { id: 'prod-083', title: 'Commercial Van', price: '$12,000', description: '2017 Toyota HiAce, 12-seater', businessPageId: 'biz-16' },
  { id: 'prod-084', title: 'Vehicle Inspection', price: '$50.00', description: 'Pre-purchase 50-point check', businessPageId: 'biz-16' },
  { id: 'prod-085', title: 'Car Financing (12mo)', price: '12% APR', description: 'Subject to approval, requires 30% down', businessPageId: 'biz-16' },

  // ====================
  // CAT-6: PROFESSIONAL SERVICES
  // ====================
  // Timor Tech Solutions (biz-3) - 5 products
  { id: 'prod-086', title: 'Website Development', price: '$500+', description: 'Custom responsive website', businessPageId: 'biz-3' },
  { id: 'prod-087', title: 'IT Consultation', price: '$50/hr', description: 'Expert technology advice', businessPageId: 'biz-3' },
  { id: 'prod-088', title: 'Social Media Package', price: '$200/mo', description: 'Content creation + posting', businessPageId: 'biz-3' },
  { id: 'prod-089', title: 'Cloud Setup (Office 365)', price: '$300', description: 'Installation and training', businessPageId: 'biz-3' },
  { id: 'prod-090', title: 'Monthly IT Support', price: '$150/mo', description: 'Remote support, 10hrs included', businessPageId: 'biz-3' },

  // Timor Law Partners (biz-17) - 4 products
  { id: 'prod-091', title: 'Legal Consultation', price: '$100/hr', description: 'Initial case review', businessPageId: 'biz-17' },
  { id: 'prod-092', title: 'Contract Drafting', price: '$300', description: 'Standard business contract', businessPageId: 'biz-17' },
  { id: 'prod-093', title: 'Property Registration', price: '$500', description: 'Land title assistance', businessPageId: 'biz-17' },
  { id: 'prod-094', title: 'Company Incorporation', price: '$800', description: 'Full incorporation service', businessPageId: 'biz-17' },

  // ====================
  // CAT-7: EDUCATION
  // ====================
  // English First Language School (biz-18) - 4 products
  { id: 'prod-095', title: 'Kindergarten (per month)', price: '$350', description: 'Full-day program, ages 3-5', businessPageId: 'biz-18' },
  { id: 'prod-096', title: 'Primary School (per month)', price: '$500', description: 'Grade 1-6, full curriculum', businessPageId: 'biz-18' },
  { id: 'prod-097', title: 'After School Program', price: '$150/mo', description: 'Homework help + activities', businessPageId: 'biz-18' },
  { id: 'prod-098', title: 'Uniform Set', price: '$80.00', description: 'Complete school uniform', businessPageId: 'biz-18' },

  // Digital Skills Academy (biz-19) - 6 products
  { id: 'prod-099', title: 'Web Development Bootcamp', price: '$800', description: '12-week intensive course', businessPageId: 'biz-19' },
  { id: 'prod-100', title: 'Graphic Design Course', price: '$400', description: '6-week Adobe Creative Suite', businessPageId: 'biz-19' },
  { id: 'prod-101', title: 'Digital Marketing 101', price: '$300', description: '4-week fundamentals', businessPageId: 'biz-19' },
  { id: 'prod-102', title: 'Excel & Office Suite', price: '$150', description: '3-week productivity course', businessPageId: 'biz-19' },
  { id: 'prod-103', title: '1-on-1 Tutoring', price: '$30/hr', description: 'Personalized instruction', businessPageId: 'biz-19' },
  { id: 'prod-104', title: 'Job Placement Service', price: '$200', description: 'Resume + interview prep + referral', businessPageId: 'biz-19' },

  // ====================
  // CAT-9: TRAVEL & TOURS
  // ====================
  // Tours Time Timor (biz-20) - 7 products
  { id: 'prod-105', title: 'Day Trip - Cristo Rei', price: '$45/person', description: 'Beach, statue, swimming, lunch', businessPageId: 'biz-20' },
  { id: 'prod-106', title: 'Adventure - Matebian Mountain', price: '$65/person', description: 'Hiking, waterfalls, picnic lunch', businessPageId: 'biz-20' },
  { id: 'prod-107', title: 'Cultural Village Tour', price: '$55/person', description: 'Traditional weaving, coffee ceremony', businessPageId: 'biz-20' },
  { id: 'prod-108', title: '3-Day Timor Loop', price: '$350/person', description: 'Coastal and mountain villages', businessPageId: 'biz-20' },
  { id: 'prod-109', title: 'Airport Transfer', price: '$20/person', description: 'Dili airport round trip', businessPageId: 'biz-20' },
  { id: 'prod-110', title: 'Custom Private Tour', price: '$150/day', description: 'Your itinerary, private guide', businessPageId: 'biz-20' },
  { id: 'prod-111', title: 'Photography Tour', price: '$75/person', description: 'Sunrise, landscapes, culture', businessPageId: 'biz-20' },

  // Timor Dive Center (biz-21) - 6 products
  { id: 'prod-112', title: 'Discover Scuba Diving', price: '$95/person', description: 'Pool session + open water dive', businessPageId: 'biz-21' },
  { id: 'prod-113', title: 'Fun Dive (2 tanks)', price: '$85/person', description: 'Two-tank boat dive', businessPageId: 'biz-21' },
  { id: 'prod-114', title: 'Open Water Course', price: '$550/person', description: 'PADI certification, 4 days', businessPageId: 'biz-21' },
  { id: 'prod-115', title: 'Advanced Open Water', price: '$400/person', description: 'PADI AOW, 2 days', businessPageId: 'biz-21' },
  { id: 'prod-116', title: 'Snorkeling Trip', price: '$40/person', description: 'Reef snorkeling with boat', businessPageId: 'biz-21' },
  { id: 'prod-117', title: 'Gear Rental (Full)', price: '$35/day', description: 'BCD, regulator, mask, fins, wetsuit', businessPageId: 'biz-21' },

  // ====================
  // CAT-12: ELECTRONICS
  // ====================
  // Phone World (biz-22) - 6 products
  { id: 'prod-118', title: 'Samsung Galaxy A54', price: '$299', description: '128GB, 6-month warranty', businessPageId: 'biz-22' },
  { id: 'prod-119', title: 'iPhone 14 (128GB)', price: '$699', description: 'Apple warranty, unlocked', businessPageId: 'biz-22' },
  { id: 'prod-120', title: 'Xiaomi Redmi Note 12', price: '$179', description: '128GB, budget powerhouse', businessPageId: 'biz-22' },
  { id: 'prod-121', title: 'Phone Screen Repair', price: '$40+', description: 'All models, 1-hour service', businessPageId: 'biz-22' },
  { id: 'prod-122', title: 'Phone Case (Universal)', price: '$15.00', description: 'Shockproof, various models', businessPageId: 'biz-22' },
  { id: 'prod-123', title: 'Power Bank 10000mAh', price: '$25.00', description: 'Fast charging, 2 USB ports', businessPageId: 'biz-22' },

  // TechFix Computer (biz-23) - 5 products
  { id: 'prod-124', title: 'Laptop Screen Repair', price: '$80+', description: 'All brands, parts included', businessPageId: 'biz-23' },
  { id: 'prod-125', title: 'Virus Removal', price: '$40.00', description: 'Full system clean + security', businessPageId: 'biz-23' },
  { id: 'prod-126', title: 'Data Recovery', price: '$100+', description: 'HDD/SSD, depends on complexity', businessPageId: 'biz-23' },
  { id: 'prod-127', title: 'Windows Installation', price: '$50.00', description: 'OS install + drivers + updates', businessPageId: 'biz-23' },
  { id: 'prod-128', title: 'Network Setup (Home)', price: '$75.00', description: 'Router config, WiFi optimization', businessPageId: 'biz-23' },
];

// ========================
// REVIEWS
// ========================
const reviews = [
  // biz-1: Café Timor
  { id: 'rev-1', businessPageId: 'biz-1', userId: 'user-2', rating: 5, comment: 'Best coffee in Dili! Love the atmosphere.' },
  { id: 'rev-2', businessPageId: 'biz-1', userId: 'user-3', rating: 4, comment: 'Great coffee, but can get crowded on weekends.' },
  { id: 'rev-3', businessPageId: 'biz-1', userId: 'user-4', rating: 5, comment: 'Love the local coffee beans. Great service!' },
  { id: 'rev-4', businessPageId: 'biz-1', userId: 'user-5', rating: 5, comment: 'Perfect place for remote work. Fast WiFi and good coffee.' },
  // biz-2: Hotel Timor
  { id: 'rev-5', businessPageId: 'biz-2', userId: 'user-1', rating: 5, comment: 'Amazing views and excellent service!' },
  { id: 'rev-6', businessPageId: 'biz-2', userId: 'user-3', rating: 5, comment: 'Best hotel in Timor. Will definitely return.' },
  { id: 'rev-7', businessPageId: 'biz-2', userId: 'user-6', rating: 4, comment: 'Great location, friendly staff. Pool was nice.' },
  // biz-3: Timor Tech
  { id: 'rev-8', businessPageId: 'biz-3', userId: 'user-1', rating: 4, comment: 'Very professional team. Helped us modernize our business.' },
  { id: 'rev-9', businessPageId: 'biz-3', userId: 'user-2', rating: 4, comment: 'Great IT support. Responsive and knowledgeable.' },
  // biz-4: Beach Shop
  { id: 'rev-10', businessPageId: 'biz-4', userId: 'user-3', rating: 4, comment: 'Good prices for surf gear. Friendly staff.' },
  // biz-5: Dental Clinic
  { id: 'rev-11', businessPageId: 'biz-5', userId: 'user-1', rating: 5, comment: 'Dr. Belo is fantastic! Painless procedure.' },
  { id: 'rev-12', businessPageId: 'biz-5', userId: 'user-3', rating: 5, comment: 'Modern equipment. Very professional clinic.' },
  // biz-6: Restaurante Lospalos
  { id: 'rev-13', businessPageId: 'biz-6', userId: 'user-4', rating: 5, comment: 'Best Timorese food in Dili! The fish curry was amazing.' },
  { id: 'rev-14', businessPageId: 'biz-6', userId: 'user-7', rating: 4, comment: 'Authentic local cuisine. Family-friendly atmosphere.' },
  // biz-7: Pizza Palace
  { id: 'rev-15', businessPageId: 'biz-7', userId: 'user-8', rating: 4, comment: 'Best pizza in town. Wood-fired makes a difference.' },
  // biz-8: Nerima Japanese
  { id: 'rev-16', businessPageId: 'biz-8', userId: 'user-1', rating: 5, comment: 'Incredible sushi! Fresh fish, beautiful presentation.' },
  { id: 'rev-17', businessPageId: 'biz-8', userId: 'user-5', rating: 5, comment: 'Best Japanese food I have had outside Japan.' },
  // biz-9: Bee Bar
  { id: 'rev-18', businessPageId: 'biz-9', userId: 'user-2', rating: 4, comment: 'Great steaks! Cocktails were well-made.' },
  // biz-10: Stay Inn Hostel
  { id: 'rev-19', businessPageId: 'biz-10', userId: 'user-3', rating: 5, comment: 'Perfect for backpackers. Clean, cheap, social.' },
  // biz-11: Beachfront Villa
  { id: 'rev-20', businessPageId: 'biz-11', userId: 'user-6', rating: 5, comment: 'Amazing villa! Private pool and direct beach access.' },
  // biz-12: Toko Modern
  { id: 'rev-21', businessPageId: 'biz-12', userId: 'user-7', rating: 4, comment: 'Everything you need under one roof. Good prices.' },
  // biz-13: Sandal Workshop
  { id: 'rev-22', businessPageId: 'biz-13', userId: 'user-8', rating: 5, comment: 'Beautiful handcrafted sandals. Perfect souvenir!' },
  // biz-14: Spa Serenity
  { id: 'rev-23', businessPageId: 'biz-14', userId: 'user-1', rating: 5, comment: 'Best spa experience in Timor! So relaxing.' },
  { id: 'rev-24', businessPageId: 'biz-14', userId: 'user-4', rating: 5, comment: 'The hot stone massage was incredible. Will return.' },
  // biz-15: Timor Auto Service
  { id: 'rev-25', businessPageId: 'biz-15', userId: 'user-2', rating: 4, comment: 'Honest mechanics. Fair prices for oil changes.' },
  // biz-16: Dili Car Sales
  { id: 'rev-26', businessPageId: 'biz-16', userId: 'user-5', rating: 4, comment: 'Good selection of cars. Made buying easy.' },
  // biz-17: Timor Law
  { id: 'rev-27', businessPageId: 'biz-17', userId: 'user-6', rating: 5, comment: 'Professional legal advice. Helped with our company setup.' },
  // biz-18: English First School
  { id: 'rev-28', businessPageId: 'biz-18', userId: 'user-7', rating: 5, comment: 'My children love it here. Great teachers!' },
  // biz-19: Digital Skills Academy
  { id: 'rev-29', businessPageId: 'biz-19', userId: 'user-8', rating: 4, comment: 'Great courses. Landed a job after the web dev bootcamp.' },
  // biz-20: Tours Time Timor
  { id: 'rev-30', businessPageId: 'biz-20', userId: 'user-1', rating: 5, comment: 'Best tour company! José knows all the hidden gems.' },
  { id: 'rev-31', businessPageId: 'biz-20', userId: 'user-3', rating: 5, comment: 'Amazing 3-day Timor Loop. Beautiful scenery!' },
  // biz-21: Timor Dive Center
  { id: 'rev-32', businessPageId: 'biz-21', userId: 'user-4', rating: 5, comment: 'Incredible diving! Saw mantas and sea turtles.' },
  { id: 'rev-33', businessPageId: 'biz-21', userId: 'user-5', rating: 5, comment: 'Lisa is an amazing instructor. Did my Open Water here.' },
  // biz-22: Phone World
  { id: 'rev-34', businessPageId: 'biz-22', userId: 'user-6', rating: 4, comment: 'Good prices on phones. Warranty service was quick.' },
  // biz-23: TechFix
  { id: 'rev-35', businessPageId: 'biz-23', userId: 'user-7', rating: 5, comment: 'Fixed my laptop same day. Great service!' },
  // Organization reviews
  { id: 'rev-36', businessPageId: 'org-3', userId: 'user-1', rating: 5, comment: 'Amazing work protecting our environment!' },
  { id: 'rev-37', businessPageId: 'org-5', userId: 'user-2', rating: 5, comment: 'The children are so well cared for. Truly inspiring.' },
];

// ========================
// SEED FUNCTION
// ========================
async function seed() {
  console.log('🌱 Starting seed...');

  // Clear existing data to avoid duplicates
  console.log('🧹 Clearing existing data...');
  await db.delete(schema.reviews);
  await db.delete(schema.products);
  await db.delete(schema.businessPages);
  await db.delete(schema.users);
  await db.delete(schema.categories);

  // Batch insert categories (optimized - single query vs N queries)
  console.log('📂 Inserting categories...');
  if (categories.length > 0) {
    await db.insert(schema.categories).values(categories);
  }

  // Delete existing accounts first
  await db.delete(schema.accounts);

  // Batch insert users
  console.log('👤 Inserting users...');
  if (users.length > 0) {
    await db.insert(schema.users).values(users);
  }

  // Hash password and create accounts (required for better-auth password login)
  console.log('🔐 Creating account credentials (using scrypt)...');
  const passwordHash = await hashPassword(TEST_PASSWORD);
  console.log(`🔐 Password hash generated: ${passwordHash.substring(0, 40)}...`);
  const now = new Date();  // Date object for drizzle timestamp mode

  accountsData = users.map((user, i) => ({
    id: `acc-${i + 1}`,
    accountId: user.id,
    providerId: 'credential',  // Email/password provider
    userId: user.id,
    password: passwordHash,
    createdAt: now,
    updatedAt: now,
  }));

  // Batch insert accounts
  console.log('🔑 Inserting accounts...');
  if (accountsData.length > 0) {
    await db.insert(schema.accounts).values(accountsData);
  }

  // Batch insert businesses
  console.log('🏢 Inserting businesses...');
  if (businesses.length > 0) {
    await db.insert(schema.businessPages).values(businesses);
  }

  // Batch insert organizations
  console.log('🏛️ Inserting organizations...');
  if (organizations.length > 0) {
    await db.insert(schema.businessPages).values(organizations);
  }

  // Batch insert products
  console.log('📦 Inserting products...');
  if (products.length > 0) {
    await db.insert(schema.products).values(products);
  }

  // Batch insert reviews
  console.log('⭐ Inserting reviews...');
  if (reviews.length > 0) {
    await db.insert(schema.reviews).values(reviews);
  }

  console.log('✅ Seed completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${users.length} users`);
  console.log(`   - ${accountsData.length} accounts (password: ${TEST_PASSWORD})`);
  console.log(`   - ${businesses.length} businesses`);
  console.log(`   - ${organizations.length} organizations`);
  console.log(`   - ${products.length} products/SKUs`);
  console.log(`   - ${reviews.length} reviews`);
}

seed().catch(console.error);
