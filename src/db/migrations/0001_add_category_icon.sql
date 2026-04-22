-- Migration: Add icon field to categories table
-- Supports emoji:🍽️ or lucide:utensils format

ALTER TABLE `categories` ADD COLUMN `icon` text DEFAULT '';
