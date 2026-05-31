/**
 * Admin User Creator Script
 * 
 * Run this script to create or reset admin user:
 * 
 * 1. First, start the dev server:
 *    cd dist/server && wrangler dev entry.mjs --port 4321 --local
 * 
 * 2. Then run this script in another terminal:
 *    node scripts/create-admin.js
 */

import { D1Database } from '@cloudflare/workers-types';
import crypto from 'crypto';

// Better-auth uses bcrypt-like hashing via argon2
// This is a simplified approach - for production, use the signup flow

const ADMIN_EMAIL = 'admin@timorup.com';
const ADMIN_PASSWORD = 'Timorup123!';
const ADMIN_NAME = 'Admin User';

// Generate user ID
const userId = crypto.randomUUID();
const now = Math.floor(Date.now() / 1000);

console.log('Admin User Creation');
console.log('===================');
console.log('Email:', ADMIN_EMAIL);
console.log('Name:', ADMIN_NAME);
console.log('User ID:', userId);
console.log('');
console.log('To create this admin user:');
console.log('1. Register a new account at http://127.0.0.1:4321/register');
console.log('2. Use email: admin@timorup.com');
console.log('3. Use password: Timorup123!');
console.log('');
console.log('Or use wrangler to insert directly (password must be hashed by better-auth)');
console.log('');
console.log('The better-auth library handles password hashing internally.');
console.log('You cannot manually insert a hashed password - use the app signup flow instead.');

// Instructions for manual creation
console.log('');
console.log('Alternatively, to create via API:');
console.log('curl -X POST http://127.0.0.1:4321/api/auth/signup \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"email":"admin@timorup.com","password":"Timorup123!","name":"Admin User"}\'');