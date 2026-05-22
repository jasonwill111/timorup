// Generate SQL for listing categories seed
// Run: node scripts/generate-listing-categories-sql.js

const fs = require('fs');

const listingCategories = [
  // ========================
  // 1. JOBS (Employment)
  // ========================
  { id: 'lc-1', name: 'Jobs', slug: 'jobs', description: 'Employment opportunities and job postings', icon: '💼', parentId: null, sortOrder: 1, isActive: 1, formFields: JSON.stringify([{ name: 'employmentType', type: 'select', label: 'Employment Type', required: true, options: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', 'Temporary'] }, { name: 'salary', type: 'number', label: 'Salary' }, { name: 'salaryCurrency', type: 'select', label: 'Currency', options: ['USD', 'IDR', 'AUD', 'EUR', 'TLS'] }, { name: 'salaryPeriod', type: 'select', label: 'Salary Period', options: ['month', 'week', 'day', 'hour'] }, { name: 'experienceLevel', type: 'select', label: 'Experience Level', options: ['Entry', 'Mid', 'Senior', 'Executive', 'Manager'] }, { name: 'qualifications', type: 'text', label: 'Qualifications' }, { name: 'benefits', type: 'text', label: 'Benefits' }, { name: 'applicationDeadline', type: 'date', label: 'Application Deadline' }]) },
  { id: 'lc-1-1', name: 'Technology & IT', slug: 'jobs-it', description: 'IT and tech jobs', icon: '💻', parentId: 'lc-1', sortOrder: 11, isActive: 1, formFields: '[]' },
  { id: 'lc-1-2', name: 'Healthcare', slug: 'jobs-healthcare', description: 'Medical and healthcare jobs', icon: '🏥', parentId: 'lc-1', sortOrder: 12, isActive: 1, formFields: '[]' },
  { id: 'lc-1-3', name: 'Education', slug: 'jobs-education', description: 'Teaching and education jobs', icon: '🎓', parentId: 'lc-1', sortOrder: 13, isActive: 1, formFields: '[]' },
  { id: 'lc-1-4', name: 'Finance & Accounting', slug: 'jobs-finance', description: 'Finance and accounting positions', icon: '💰', parentId: 'lc-1', sortOrder: 14, isActive: 1, formFields: '[]' },
  { id: 'lc-1-5', name: 'Hospitality & Tourism', slug: 'jobs-hospitality', description: 'Hotels, restaurants, tourism', icon: '🏨', parentId: 'lc-1', sortOrder: 15, isActive: 1, formFields: '[]' },
  { id: 'lc-1-6', name: 'Construction', slug: 'jobs-construction', description: 'Construction and trades', icon: '🏗️', parentId: 'lc-1', sortOrder: 16, isActive: 1, formFields: '[]' },
  { id: 'lc-1-7', name: 'Retail & Sales', slug: 'jobs-retail', description: 'Retail and sales positions', icon: '🛒', parentId: 'lc-1', sortOrder: 17, isActive: 1, formFields: '[]' },
  { id: 'lc-1-8', name: 'Government & NGO', slug: 'jobs-government', description: 'Government and NGO positions', icon: '🏛️', parentId: 'lc-1', sortOrder: 18, isActive: 1, formFields: '[]' },
  { id: 'lc-1-9', name: 'Agriculture', slug: 'jobs-agriculture', description: 'Farming and agriculture jobs', icon: '🌱', parentId: 'lc-1', sortOrder: 19, isActive: 1, formFields: '[]' },
  { id: 'lc-1-10', name: 'General Labor', slug: 'jobs-labor', description: 'General and manual labor', icon: '👷', parentId: 'lc-1', sortOrder: 110, isActive: 1, formFields: '[]' },

  // ========================
  // 2. FOR SALE
  // ========================
  { id: 'lc-2', name: 'For Sale', slug: 'for-sale', description: 'Items for sale by individuals and businesses', icon: '🏷️', parentId: null, sortOrder: 2, isActive: 1, formFields: JSON.stringify([{ name: 'condition', type: 'select', label: 'Condition', required: true, options: ['New', 'Like New', 'Good', 'Fair', 'For Parts'] }, { name: 'negotiable', type: 'boolean', label: 'Price Negotiable' }]) },
  { id: 'lc-2-1', name: 'Electronics', slug: 'electronics', description: 'Phones, computers, gadgets', icon: '📱', parentId: 'lc-2', sortOrder: 21, isActive: 1, formFields: '[]' },
  { id: 'lc-2-2', name: 'Fashion', slug: 'fashion', description: 'Clothing, shoes, accessories', icon: '👗', parentId: 'lc-2', sortOrder: 22, isActive: 1, formFields: '[]' },
  { id: 'lc-2-3', name: 'Furniture', slug: 'furniture', description: 'Home and office furniture', icon: '🪑', parentId: 'lc-2', sortOrder: 23, isActive: 1, formFields: '[]' },
  { id: 'lc-2-4', name: 'Sports & Outdoors', slug: 'sports-equipment', description: 'Sports gear and outdoor equipment', icon: '⚽', parentId: 'lc-2', sortOrder: 24, isActive: 1, formFields: '[]' },
  { id: 'lc-2-5', name: 'Baby & Kids', slug: 'baby-kids', description: 'Children items, toys, baby gear', icon: '🧸', parentId: 'lc-2', sortOrder: 25, isActive: 1, formFields: '[]' },
  { id: 'lc-2-6', name: 'Home & Garden', slug: 'home-garden', description: 'Home decor, garden equipment', icon: '🌿', parentId: 'lc-2', sortOrder: 26, isActive: 1, formFields: '[]' },
  { id: 'lc-2-7', name: 'Musical Instruments', slug: 'musical-instruments', description: 'Guitars, keyboards, drums', icon: '🎸', parentId: 'lc-2', sortOrder: 27, isActive: 1, formFields: '[]' },
  { id: 'lc-2-8', name: 'Books & Media', slug: 'books-media', description: 'Books, movies, music', icon: '📚', parentId: 'lc-2', sortOrder: 28, isActive: 1, formFields: '[]' },
  { id: 'lc-2-9', name: 'Collectibles', slug: 'collectibles', description: 'Antiques, art, collectibles', icon: '🏺', parentId: 'lc-2', sortOrder: 29, isActive: 1, formFields: '[]' },
  { id: 'lc-2-10', name: 'Tools & Machinery', slug: 'tools-machinery', description: 'Power tools, machinery', icon: '🔧', parentId: 'lc-2', sortOrder: 210, isActive: 1, formFields: '[]' },
  { id: 'lc-2-11', name: 'Office & Business', slug: 'office-business', description: 'Office equipment, business items', icon: '🏢', parentId: 'lc-2', sortOrder: 211, isActive: 1, formFields: '[]' },
  { id: 'lc-2-12', name: 'Art & Crafts', slug: 'art-crafts', description: 'Handmade items, art supplies', icon: '🎨', parentId: 'lc-2', sortOrder: 212, isActive: 1, formFields: '[]' },

  // Electronics Sub
  { id: 'lc-2-1-1', name: 'Mobile Phones', slug: 'mobile-phones', description: 'Smartphones and cell phones', icon: '📱', parentId: 'lc-2-1', sortOrder: 211, isActive: 1, formFields: JSON.stringify([{ name: 'brand', type: 'text', label: 'Brand' }, { name: 'model', type: 'text', label: 'Model' }]) },
  { id: 'lc-2-1-2', name: 'Computers', slug: 'computers', description: 'Laptops, desktops, tablets', icon: '💻', parentId: 'lc-2-1', sortOrder: 212, isActive: 1, formFields: '[]' },
  { id: 'lc-2-1-3', name: 'Audio & Headphones', slug: 'audio-headphones', description: 'Speakers, headphones, earbuds', icon: '🎧', parentId: 'lc-2-1', sortOrder: 213, isActive: 1, formFields: '[]' },
  { id: 'lc-2-1-4', name: 'Cameras', slug: 'cameras', description: 'DSLR, mirrorless, action cameras', icon: '📷', parentId: 'lc-2-1', sortOrder: 214, isActive: 1, formFields: '[]' },
  { id: 'lc-2-1-5', name: 'Gaming', slug: 'gaming-consoles', description: 'PlayStation, Xbox, Nintendo, PC gaming', icon: '🎮', parentId: 'lc-2-1', sortOrder: 215, isActive: 1, formFields: '[]' },
  { id: 'lc-2-1-6', name: 'TVs & Displays', slug: 'tvs-displays', description: 'Televisions and monitors', icon: '📺', parentId: 'lc-2-1', sortOrder: 216, isActive: 1, formFields: '[]' },
  { id: 'lc-2-1-7', name: 'Wearable Tech', slug: 'wearable-tech', description: 'Smartwatches, fitness trackers', icon: '⌚', parentId: 'lc-2-1', sortOrder: 217, isActive: 1, formFields: '[]' },

  // Fashion Sub
  { id: 'lc-2-2-1', name: "Men's Clothing", slug: 'mens-clothing', description: "Men's fashion and apparel", icon: '👔', parentId: 'lc-2-2', sortOrder: 221, isActive: 1, formFields: '[]' },
  { id: 'lc-2-2-2', name: "Women's Clothing", slug: 'womens-clothing', description: "Women's fashion and apparel", icon: '👗', parentId: 'lc-2-2', sortOrder: 222, isActive: 1, formFields: '[]' },
  { id: 'lc-2-2-3', name: 'Shoes & Footwear', slug: 'shoes-footwear', description: 'Shoes, boots, sandals', icon: '👟', parentId: 'lc-2-2', sortOrder: 223, isActive: 1, formFields: '[]' },
  { id: 'lc-2-2-4', name: 'Bags & Luggage', slug: 'bags-luggage', description: 'Handbags, backpacks, suitcases', icon: '👜', parentId: 'lc-2-2', sortOrder: 224, isActive: 1, formFields: '[]' },
  { id: 'lc-2-2-5', name: 'Jewelry & Watches', slug: 'jewelry-watches', description: 'Jewelry, watches, accessories', icon: '💍', parentId: 'lc-2-2', sortOrder: 225, isActive: 1, formFields: '[]' },
  { id: 'lc-2-2-6', name: 'Sunglasses & Eyewear', slug: 'sunglasses-eyewear', description: 'Sunglasses, glasses', icon: '🕶️', parentId: 'lc-2-2', sortOrder: 226, isActive: 1, formFields: '[]' },
  { id: 'lc-2-2-7', name: 'Kids Clothing', slug: 'kids-clothing', description: "Children's clothing", icon: '👧', parentId: 'lc-2-2', sortOrder: 227, isActive: 1, formFields: '[]' },

  // Furniture Sub
  { id: 'lc-2-3-1', name: 'Sofas & Couches', slug: 'sofas-couches', description: 'Sofas, couches, sectionals', icon: '🛋️', parentId: 'lc-2-3', sortOrder: 231, isActive: 1, formFields: '[]' },
  { id: 'lc-2-3-2', name: 'Beds & Mattresses', slug: 'beds-mattresses', description: 'Beds, mattresses, frames', icon: '🛏️', parentId: 'lc-2-3', sortOrder: 232, isActive: 1, formFields: '[]' },
  { id: 'lc-2-3-3', name: 'Tables & Desks', slug: 'tables-desks', description: 'Dining tables, desks', icon: '🪑', parentId: 'lc-2-3', sortOrder: 233, isActive: 1, formFields: '[]' },
  { id: 'lc-2-3-4', name: 'Chairs & Seating', slug: 'chairs-seating', description: 'Chairs, stools, benches', icon: '🪑', parentId: 'lc-2-3', sortOrder: 234, isActive: 1, formFields: '[]' },
  { id: 'lc-2-3-5', name: 'Storage & Shelving', slug: 'storage-shelving', description: 'Cabinets, shelves, drawers', icon: '🗄️', parentId: 'lc-2-3', sortOrder: 235, isActive: 1, formFields: '[]' },
  { id: 'lc-2-3-6', name: 'Outdoor Furniture', slug: 'outdoor-furniture', description: 'Patio, garden furniture', icon: '🏡', parentId: 'lc-2-3', sortOrder: 236, isActive: 1, formFields: '[]' },

  // ========================
  // 3. VEHICLES
  // ========================
  { id: 'lc-3', name: 'Vehicles', slug: 'vehicles', description: 'Cars, motorcycles, and other vehicles', icon: '🚗', parentId: null, sortOrder: 3, isActive: 1, formFields: JSON.stringify([{ name: 'vehicleType', type: 'select', label: 'Vehicle Type', required: true, options: ['Car', 'Motorcycle', 'Bicycle', 'Boat', 'Truck', 'Van', 'Bus', 'Other'] }, { name: 'make', type: 'text', label: 'Make/Brand', required: true }, { name: 'model', type: 'text', label: 'Model', required: true }, { name: 'year', type: 'number', label: 'Year', required: true }, { name: 'mileage', type: 'number', label: 'Mileage (km)' }, { name: 'fuelType', type: 'select', label: 'Fuel Type', options: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] }, { name: 'transmission', type: 'select', label: 'Transmission', options: ['Manual', 'Automatic'] }]) },
  { id: 'lc-3-1', name: 'Cars', slug: 'cars', description: 'Cars and passenger vehicles', icon: '🚙', parentId: 'lc-3', sortOrder: 31, isActive: 1, formFields: JSON.stringify([{ name: 'bodyType', type: 'select', label: 'Body Type', options: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Wagon', 'Van', 'Pickup'] }]) },
  { id: 'lc-3-2', name: 'Motorcycles', slug: 'motorcycles', description: 'Motorcycles and scooters', icon: '🏍️', parentId: 'lc-3', sortOrder: 32, isActive: 1, formFields: JSON.stringify([{ name: 'engineSize', type: 'number', label: 'Engine Size (cc)' }]) },
  { id: 'lc-3-3', name: 'Bicycles', slug: 'bicycles', description: 'Bikes and e-bikes', icon: '🚴', parentId: 'lc-3', sortOrder: 33, isActive: 1, formFields: '[]' },
  { id: 'lc-3-4', name: 'Boats & Watercraft', slug: 'boats-watercraft', description: 'Boats, jet skis, yachts', icon: '⛵', parentId: 'lc-3', sortOrder: 34, isActive: 1, formFields: '[]' },
  { id: 'lc-3-5', name: 'Trucks & Commercial', slug: 'trucks-commercial', description: 'Trucks, lorries, commercial vehicles', icon: '🚚', parentId: 'lc-3', sortOrder: 35, isActive: 1, formFields: '[]' },
  { id: 'lc-3-6', name: 'Vans & Minibuses', slug: 'vans-minibuses', description: 'Vans, minibuses, MPVs', icon: '🚐', parentId: 'lc-3', sortOrder: 36, isActive: 1, formFields: '[]' },
  { id: 'lc-3-7', name: 'Auto Parts & Accessories', slug: 'auto-parts', description: 'Parts, tires, accessories', icon: '🔧', parentId: 'lc-3', sortOrder: 37, isActive: 1, formFields: '[]' },

  // ========================
  // 4. PROPERTY
  // ========================
  { id: 'lc-4', name: 'Property', slug: 'property', description: 'Real estate for sale', icon: '🏠', parentId: null, sortOrder: 4, isActive: 1, formFields: JSON.stringify([{ name: 'propertyType', type: 'select', label: 'Property Type', required: true, options: ['House', 'Apartment', 'Land', 'Commercial', 'Industrial'] }, { name: 'bedrooms', type: 'number', label: 'Bedrooms' }, { name: 'bathrooms', type: 'number', label: 'Bathrooms' }, { name: 'landSize', type: 'number', label: 'Land Size (m²)' }]) },
  { id: 'lc-4-1', name: 'Houses', slug: 'houses-for-sale', description: 'Houses for sale', icon: '🏡', parentId: 'lc-4', sortOrder: 41, isActive: 1, formFields: JSON.stringify([{ name: 'bedrooms', type: 'number', label: 'Bedrooms', required: true }, { name: 'bathrooms', type: 'number', label: 'Bathrooms' }, { name: 'landSize', type: 'number', label: 'Land Size (m²)' }]) },
  { id: 'lc-4-2', name: 'Apartments', slug: 'apartments-for-sale', description: 'Apartments and condos', icon: '🏢', parentId: 'lc-4', sortOrder: 42, isActive: 1, formFields: JSON.stringify([{ name: 'floorLevel', type: 'number', label: 'Floor Level' }, { name: 'buildingSize', type: 'number', label: 'Unit Size (m²)' }]) },
  { id: 'lc-4-3', name: 'Land & Plots', slug: 'land-for-sale', description: 'Land and plots', icon: '🏔️', parentId: 'lc-4', sortOrder: 43, isActive: 1, formFields: JSON.stringify([{ name: 'landSize', type: 'number', label: 'Land Size (m²)', required: true }, { name: 'landType', type: 'select', label: 'Land Type', options: ['Residential', 'Commercial', 'Agricultural', 'Industrial'] }]) },
  { id: 'lc-4-4', name: 'Commercial Property', slug: 'commercial-for-sale', description: 'Shops, offices, warehouses', icon: '🏬', parentId: 'lc-4', sortOrder: 44, isActive: 1, formFields: '[]' },
  { id: 'lc-4-5', name: 'Industrial', slug: 'industrial-for-sale', description: 'Factories, warehouses', icon: '🏭', parentId: 'lc-4', sortOrder: 45, isActive: 1, formFields: '[]' },

  // ========================
  // 5. RENTALS
  // ========================
  { id: 'lc-5', name: 'Rentals', slug: 'rentals', description: 'Property and equipment for rent', icon: '🔑', parentId: null, sortOrder: 5, isActive: 1, formFields: JSON.stringify([{ name: 'rentalType', type: 'select', label: 'Rental Type', required: true, options: ['Apartment', 'House', 'Room', 'Office', 'Shop', 'Land', 'Equipment'] }, { name: 'bedrooms', type: 'number', label: 'Bedrooms' }, { name: 'furnished', type: 'boolean', label: 'Furnished' }]) },
  { id: 'lc-5-1', name: 'Apartments for Rent', slug: 'apartments-rent', description: 'Rental apartments', icon: '🏢', parentId: 'lc-5', sortOrder: 51, isActive: 1, formFields: '[]' },
  { id: 'lc-5-2', name: 'Houses for Rent', slug: 'houses-rent', description: 'Rental houses', icon: '🏡', parentId: 'lc-5', sortOrder: 52, isActive: 1, formFields: '[]' },
  { id: 'lc-5-3', name: 'Rooms for Rent', slug: 'rooms-rent', description: 'Single rooms and shared', icon: '🛏️', parentId: 'lc-5', sortOrder: 53, isActive: 1, formFields: '[]' },
  { id: 'lc-5-4', name: 'Office Space', slug: 'office-space-rent', description: 'Commercial office space', icon: '🏢', parentId: 'lc-5', sortOrder: 54, isActive: 1, formFields: '[]' },
  { id: 'lc-5-5', name: 'Shops & Retail', slug: 'shops-rent', description: 'Retail space for rent', icon: '🏪', parentId: 'lc-5', sortOrder: 55, isActive: 1, formFields: '[]' },
  { id: 'lc-5-6', name: 'Land Rental', slug: 'land-rent', description: 'Land for rent', icon: '🏔️', parentId: 'lc-5', sortOrder: 56, isActive: 1, formFields: '[]' },
  { id: 'lc-5-7', name: 'Equipment Rental', slug: 'equipment-rent', description: 'Tools and equipment rental', icon: '🔧', parentId: 'lc-5', sortOrder: 57, isActive: 1, formFields: '[]' },
  { id: 'lc-5-8', name: 'Vehicle Rental', slug: 'vehicle-rent', description: 'Cars and vehicles for rent', icon: '🚗', parentId: 'lc-5', sortOrder: 58, isActive: 1, formFields: '[]' },

  // ========================
  // 6. SERVICES
  // ========================
  { id: 'lc-6', name: 'Services', slug: 'services', description: 'Professional and personal services', icon: '🔧', parentId: null, sortOrder: 6, isActive: 1, formFields: JSON.stringify([{ name: 'serviceType', type: 'select', label: 'Service Type', required: true, options: ['Professional', 'Repair', 'Cleaning', 'Beauty', 'Education', 'Events', 'Photography', 'Other'] }, { name: 'available', type: 'boolean', label: 'Available Now' }]) },
  { id: 'lc-6-1', name: 'Professional Services', slug: 'professional-services', description: 'Legal, accounting, consulting', icon: '💼', parentId: 'lc-6', sortOrder: 61, isActive: 1, formFields: '[]' },
  { id: 'lc-6-2', name: 'Home Services', slug: 'home-services', description: 'Repair, cleaning, maintenance', icon: '🔧', parentId: 'lc-6', sortOrder: 62, isActive: 1, formFields: '[]' },
  { id: 'lc-6-3', name: 'Beauty & Wellness', slug: 'beauty-wellness', description: 'Hair, makeup, spa, massage', icon: '💆', parentId: 'lc-6', sortOrder: 63, isActive: 1, formFields: '[]' },
  { id: 'lc-6-4', name: 'Education & Tutoring', slug: 'education-tutoring', description: 'Tutoring, lessons, training', icon: '📚', parentId: 'lc-6', sortOrder: 64, isActive: 1, formFields: '[]' },
  { id: 'lc-6-5', name: 'Events & Entertainment', slug: 'events-entertainment', description: 'Planning, DJ, photography', icon: '🎉', parentId: 'lc-6', sortOrder: 65, isActive: 1, formFields: '[]' },
  { id: 'lc-6-6', name: 'Transportation & Logistics', slug: 'transportation', description: 'Moving, delivery, transport', icon: '🚚', parentId: 'lc-6', sortOrder: 66, isActive: 1, formFields: '[]' },
  { id: 'lc-6-7', name: 'Pet Services', slug: 'pet-services', description: 'Pet sitting, grooming, vet', icon: '🐾', parentId: 'lc-6', sortOrder: 67, isActive: 1, formFields: '[]' },
  { id: 'lc-6-8', name: 'Security Services', slug: 'security-services', description: 'Guards, surveillance', icon: '🔒', parentId: 'lc-6', sortOrder: 68, isActive: 1, formFields: '[]' },
  { id: 'lc-6-9', name: 'IT & Tech Support', slug: 'it-tech-support', description: 'Computer repair, web design', icon: '💻', parentId: 'lc-6', sortOrder: 69, isActive: 1, formFields: '[]' },
  { id: 'lc-6-10', name: 'Health & Fitness', slug: 'health-fitness', description: 'Personal training, yoga', icon: '💪', parentId: 'lc-6', sortOrder: 610, isActive: 1, formFields: '[]' },

  // ========================
  // 7. WANTED
  // ========================
  { id: 'lc-7', name: 'Wanted', slug: 'wanted', description: 'Items or services people are looking for', icon: '🔍', parentId: null, sortOrder: 7, isActive: 1, formFields: JSON.stringify([{ name: 'wantedType', type: 'select', label: 'Looking For', required: true, options: ['Item', 'Service', 'Property', 'Vehicle', 'Job', 'Roommate', 'Other'] }, { name: 'budget', type: 'number', label: 'Budget' }, { name: 'urgency', type: 'select', label: 'Urgency', options: ['Flexible', 'Soon', 'Urgent'] }]) },
  { id: 'lc-7-1', name: 'Wanted: Electronics', slug: 'wanted-electronics', description: 'Looking for electronics', icon: '📱', parentId: 'lc-7', sortOrder: 71, isActive: 1, formFields: '[]' },
  { id: 'lc-7-2', name: 'Wanted: Vehicles', slug: 'wanted-vehicles', description: 'Looking for vehicles', icon: '🚗', parentId: 'lc-7', sortOrder: 72, isActive: 1, formFields: '[]' },
  { id: 'lc-7-3', name: 'Wanted: Property', slug: 'wanted-property', description: 'Looking for property', icon: '🏠', parentId: 'lc-7', sortOrder: 73, isActive: 1, formFields: '[]' },
  { id: 'lc-7-4', name: 'Wanted: Furniture', slug: 'wanted-furniture', description: 'Looking for furniture', icon: '🪑', parentId: 'lc-7', sortOrder: 74, isActive: 1, formFields: '[]' },
  { id: 'lc-7-5', name: 'Wanted: Jobs', slug: 'wanted-jobs', description: 'Job seekers', icon: '💼', parentId: 'lc-7', sortOrder: 75, isActive: 1, formFields: '[]' },
  { id: 'lc-7-6', name: 'Wanted: Roommates', slug: 'wanted-roommates', description: 'Looking for roommates', icon: '👥', parentId: 'lc-7', sortOrder: 76, isActive: 1, formFields: '[]' },

  // ========================
  // 8. EVENTS
  // ========================
  { id: 'lc-8', name: 'Events', slug: 'events', description: 'Concerts, workshops, and community events', icon: '🎭', parentId: null, sortOrder: 8, isActive: 1, formFields: JSON.stringify([{ name: 'eventType', type: 'select', label: 'Event Type', required: true, options: ['Concert', 'Workshop', 'Conference', 'Festival', 'Sports', 'Community', 'Other'] }, { name: 'eventDate', type: 'date', label: 'Event Date', required: true }, { name: 'ticketPrice', type: 'number', label: 'Ticket Price' }]) },
  { id: 'lc-8-1', name: 'Concerts & Music', slug: 'concerts-music', description: 'Live music events', icon: '🎵', parentId: 'lc-8', sortOrder: 81, isActive: 1, formFields: '[]' },
  { id: 'lc-8-2', name: 'Workshops & Classes', slug: 'workshops-classes', description: 'Learning events', icon: '📝', parentId: 'lc-8', sortOrder: 82, isActive: 1, formFields: '[]' },
  { id: 'lc-8-3', name: 'Conferences', slug: 'conferences', description: 'Business conferences', icon: '🎤', parentId: 'lc-8', sortOrder: 83, isActive: 1, formFields: '[]' },
  { id: 'lc-8-4', name: 'Festivals', slug: 'festivals', description: 'Cultural festivals', icon: '🎪', parentId: 'lc-8', sortOrder: 84, isActive: 1, formFields: '[]' },
  { id: 'lc-8-5', name: 'Sports Events', slug: 'sports-events', description: 'Sports tournaments', icon: '🏆', parentId: 'lc-8', sortOrder: 85, isActive: 1, formFields: '[]' },
  { id: 'lc-8-6', name: 'Community Events', slug: 'community-events', description: 'Local community gatherings', icon: '👥', parentId: 'lc-8', sortOrder: 86, isActive: 1, formFields: '[]' },
  { id: 'lc-8-7', name: 'Exhibitions', slug: 'exhibitions', description: 'Art and trade shows', icon: '🖼️', parentId: 'lc-8', sortOrder: 87, isActive: 1, formFields: '[]' },

  // ========================
  // 9. PETS
  // ========================
  { id: 'lc-9', name: 'Pets', slug: 'pets', description: 'Pets for sale, adoption, or looking for home', icon: '🐾', parentId: null, sortOrder: 9, isActive: 1, formFields: JSON.stringify([{ name: 'petType', type: 'select', label: 'Pet Type', required: true, options: ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Reptile', 'Other'] }, { name: 'breed', type: 'text', label: 'Breed' }, { name: 'age', type: 'select', label: 'Age', options: ['Baby', 'Young', 'Adult', 'Senior'] }]) },
  { id: 'lc-9-1', name: 'Dogs', slug: 'dogs', description: 'Dogs for sale/adoption', icon: '🐕', parentId: 'lc-9', sortOrder: 91, isActive: 1, formFields: '[]' },
  { id: 'lc-9-2', name: 'Cats', slug: 'cats', description: 'Cats for sale/adoption', icon: '🐈', parentId: 'lc-9', sortOrder: 92, isActive: 1, formFields: '[]' },
  { id: 'lc-9-3', name: 'Birds', slug: 'birds', description: 'Birds and poultry', icon: '🦜', parentId: 'lc-9', sortOrder: 93, isActive: 1, formFields: '[]' },
  { id: 'lc-9-4', name: 'Fish & Aquarium', slug: 'fish-aquarium', description: 'Fish and aquarium supplies', icon: '🐠', parentId: 'lc-9', sortOrder: 94, isActive: 1, formFields: '[]' },
  { id: 'lc-9-5', name: 'Pet Supplies', slug: 'pet-supplies', description: 'Food, toys, accessories', icon: '🦴', parentId: 'lc-9', sortOrder: 95, isActive: 1, formFields: '[]' },
  { id: 'lc-9-6', name: 'Pet Services', slug: 'pet-services-list', description: 'Grooming, walking, sitting', icon: '🐾', parentId: 'lc-9', sortOrder: 96, isActive: 1, formFields: '[]' },

  // ========================
  // 10. AGRICULTURE
  // ========================
  { id: 'lc-10', name: 'Agriculture', slug: 'agriculture', description: 'Farm products, livestock, and agricultural equipment', icon: '🌾', parentId: null, sortOrder: 10, isActive: 1, formFields: JSON.stringify([{ name: 'agriType', type: 'select', label: 'Type', required: true, options: ['Crop', 'Livestock', 'Equipment', 'Seeds', 'Fertilizer', 'Other'] }, { name: 'organic', type: 'boolean', label: 'Organic' }]) },
  { id: 'lc-10-1', name: 'Crops & Produce', slug: 'crops-produce', description: 'Fresh produce and crops', icon: '🌽', parentId: 'lc-10', sortOrder: 101, isActive: 1, formFields: '[]' },
  { id: 'lc-10-2', name: 'Livestock', slug: 'livestock', description: 'Cattle, goats, pigs, chickens', icon: '🐄', parentId: 'lc-10', sortOrder: 102, isActive: 1, formFields: '[]' },
  { id: 'lc-10-3', name: 'Farm Equipment', slug: 'farm-equipment', description: 'Tractors, tools, machinery', icon: '🚜', parentId: 'lc-10', sortOrder: 103, isActive: 1, formFields: '[]' },
  { id: 'lc-10-4', name: 'Seeds & Plants', slug: 'seeds-plants', description: 'Seeds, seedlings, plants', icon: '🌱', parentId: 'lc-10', sortOrder: 104, isActive: 1, formFields: '[]' },
  { id: 'lc-10-5', name: 'Coffee & Cocoa', slug: 'coffee-cocoa', description: 'Coffee beans, cocoa', icon: '☕', parentId: 'lc-10', sortOrder: 105, isActive: 1, formFields: '[]' },
  { id: 'lc-10-6', name: 'Timber & Wood', slug: 'timber-wood', description: 'Timber products', icon: '🪵', parentId: 'lc-10', sortOrder: 106, isActive: 1, formFields: '[]' },

  // ========================
  // 11. FREE STUFF
  // ========================
  { id: 'lc-11', name: 'Free Stuff', slug: 'free-stuff', description: 'Items available for free', icon: '🎁', parentId: null, sortOrder: 11, isActive: 1, formFields: JSON.stringify([{ name: 'condition', type: 'select', label: 'Condition', options: ['New', 'Like New', 'Good', 'Fair'] }, { name: 'pickupOnly', type: 'boolean', label: 'Pickup Only' }]) },
  { id: 'lc-11-1', name: 'Furniture Free', slug: 'free-furniture', description: 'Free furniture', icon: '🪑', parentId: 'lc-11', sortOrder: 111, isActive: 1, formFields: '[]' },
  { id: 'lc-11-2', name: 'Electronics Free', slug: 'free-electronics', description: 'Free electronics', icon: '📱', parentId: 'lc-11', sortOrder: 112, isActive: 1, formFields: '[]' },
  { id: 'lc-11-3', name: 'Baby Items Free', slug: 'free-baby', description: 'Free baby items', icon: '🧸', parentId: 'lc-11', sortOrder: 113, isActive: 1, formFields: '[]' },
  { id: 'lc-11-4', name: 'Books & Media Free', slug: 'free-books', description: 'Free books and media', icon: '📚', parentId: 'lc-11', sortOrder: 114, isActive: 1, formFields: '[]' },
  { id: 'lc-11-5', name: 'Other Free', slug: 'free-other', description: 'Other free items', icon: '🎁', parentId: 'lc-11', sortOrder: 115, isActive: 1, formFields: '[]' },

  // ========================
  // 12. COMMUNITY
  // ========================
  { id: 'lc-12', name: 'Community', slug: 'community', description: 'Local community announcements and groups', icon: '👥', parentId: null, sortOrder: 12, isActive: 1, formFields: JSON.stringify([{ name: 'communityType', type: 'select', label: 'Type', options: ['Announcement', 'Lost & Found', 'Missing Person', 'Alert', 'Group'] }]) },
  { id: 'lc-12-1', name: 'Lost & Found', slug: 'lost-found', description: 'Lost and found items', icon: '🔎', parentId: 'lc-12', sortOrder: 121, isActive: 1, formFields: '[]' },
  { id: 'lc-12-2', name: 'Announcements', slug: 'announcements', description: 'Community announcements', icon: '📢', parentId: 'lc-12', sortOrder: 122, isActive: 1, formFields: '[]' },
  { id: 'lc-12-3', name: 'Volunteer', slug: 'volunteer', description: 'Volunteer opportunities', icon: '🤝', parentId: 'lc-12', sortOrder: 123, isActive: 1, formFields: '[]' },
  { id: 'lc-12-4', name: 'Classes & Groups', slug: 'classes-groups', description: 'Community classes and groups', icon: '👥', parentId: 'lc-12', sortOrder: 124, isActive: 1, formFields: '[]' },
  { id: 'lc-12-5', name: 'Religious', slug: 'religious', description: 'Churches, mosques, temples', icon: '🙏', parentId: 'lc-12', sortOrder: 125, isActive: 1, formFields: '[]' },
  { id: 'lc-12-6', name: 'Sports Clubs', slug: 'sports-clubs', description: 'Sports and fitness clubs', icon: '⚽', parentId: 'lc-12', sortOrder: 126, isActive: 1, formFields: '[]' },
];

// Generate SQL
const now = Math.floor(Date.now() / 1000);
const sqlStatements = listingCategories.map(cat => {
  const formFields = typeof cat.formFields === 'string' ? cat.formFields : JSON.stringify(cat.formFields);
  return `INSERT OR REPLACE INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields, created_at, updated_at) VALUES ('${cat.id}', '${cat.name.replace(/'/g, "''")}', '${cat.slug}', '${(cat.description || '').replace(/'/g, "''")}', '${cat.icon}', ${cat.parentId ? "'" + cat.parentId + "'" : 'NULL'}, ${cat.sortOrder}, ${cat.isActive}, '${formFields.replace(/'/g, "''")}', ${now}, ${now});`;
}).join('\n');

// Write to file
fs.writeFileSync('temp-listing-categories.sql', sqlStatements);

console.log(`Generated ${listingCategories.length} categories`);
console.log('SQL saved to temp-listing-categories.sql');