-- First, check if admin user exists
SELECT 'Checking users...';
SELECT id, email, name FROM users WHERE email = 'admin@timorup.com';
