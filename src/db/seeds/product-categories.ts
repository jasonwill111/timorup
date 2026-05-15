/**
 * Product Categories Seed Data
 * TimorLIST - Business SKUs / Products & Services Categories
 *
 * Each category has:
 * - name: Display name
 * - slug: URL-friendly identifier
 * - description: Category description
 * - icon: Emoji icon
 * - parentId: Parent category (null for top-level)
 * - formFields: JSON schema for category-specific fields
 * - sortOrder: Display order
 * - isActive: Active status
 */

export const productCategories = [
  // ========================
  // TOP-LEVEL: Physical Goods
  // ========================
  {
    id: 'pc-1',
    name: 'Electronics & Gadgets',
    slug: 'electronics',
    description: 'Phones, computers, cameras, and accessories',
    icon: '📱',
    parentId: null,
    sortOrder: 1,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'brand', type: 'text', label: 'Brand', required: true },
      { name: 'model', type: 'text', label: 'Model' },
      { name: 'warranty', type: 'text', label: 'Warranty' },
      { name: 'negotiable', type: 'boolean', label: 'Price Negotiable' }
    ])
  },
  {
    id: 'pc-2',
    name: 'Fashion & Apparel',
    slug: 'fashion',
    description: 'Clothing, shoes, bags, and accessories',
    icon: '👗',
    parentId: null,
    sortOrder: 2,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'brand', type: 'text', label: 'Brand' },
      { name: 'size', type: 'text', label: 'Size' },
      { name: 'color', type: 'text', label: 'Color' },
      { name: 'material', type: 'text', label: 'Material' },
      { name: 'gender', type: 'select', label: 'Gender', options: ['Men', 'Women', 'Unisex', 'Kids'] }
    ])
  },
  {
    id: 'pc-3',
    name: 'Food & Beverages',
    slug: 'food-beverages',
    description: 'Food products, beverages, and groceries',
    icon: '🍔',
    parentId: null,
    sortOrder: 3,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'unit', type: 'text', label: 'Unit (kg, liter, piece)' },
      { name: 'organic', type: 'boolean', label: 'Organic' },
      { name: 'halal', type: 'boolean', label: 'Halal' },
      { name: 'expiryDate', type: 'date', label: 'Expiry Date' }
    ])
  },
  {
    id: 'pc-4',
    name: 'Health & Beauty',
    slug: 'health-beauty',
    description: 'Cosmetics, skincare, supplements',
    icon: '💄',
    parentId: null,
    sortOrder: 4,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'brand', type: 'text', label: 'Brand' },
      { name: 'skinType', type: 'text', label: 'Skin Type' },
      { name: 'organic', type: 'boolean', label: 'Organic/Natural' },
      { name: 'halal', type: 'boolean', label: 'Halal Certified' }
    ])
  },
  {
    id: 'pc-5',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Furniture, decor, and household items',
    icon: '🏠',
    parentId: null,
    sortOrder: 5,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'material', type: 'text', label: 'Material' },
      { name: 'dimensions', type: 'text', label: 'Dimensions' },
      { name: 'color', type: 'text', label: 'Color' },
      { name: 'assemblyRequired', type: 'boolean', label: 'Assembly Required' }
    ])
  },
  {
    id: 'pc-6',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sports equipment and outdoor gear',
    icon: '⚽',
    parentId: null,
    sortOrder: 6,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'sportType', type: 'select', label: 'Sport', options: ['Football', 'Basketball', 'Tennis', 'Swimming', 'Cycling', 'Gym', 'Hiking', 'Fishing', 'Other'] },
      { name: 'brand', type: 'text', label: 'Brand' },
      { name: 'condition', type: 'select', label: 'Condition', options: ['New', 'Like New', 'Good', 'Used'] }
    ])
  },
  {
    id: 'pc-7',
    name: 'Baby & Kids',
    slug: 'baby-kids',
    description: 'Baby products, toys, and kids items',
    icon: '👶',
    parentId: null,
    sortOrder: 7,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'ageRange', type: 'text', label: 'Age Range' },
      { name: 'gender', type: 'select', label: 'Gender', options: ['Boy', 'Girl', 'Unisex'] },
      { name: 'safetyCertified', type: 'boolean', label: 'Safety Certified' }
    ])
  },
  {
    id: 'pc-8',
    name: 'Office Supplies',
    slug: 'office-supplies',
    description: 'Stationery, office equipment, and supplies',
    icon: '📎',
    parentId: null,
    sortOrder: 8,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'category', type: 'select', label: 'Category', options: ['Stationery', 'Printer Supplies', 'Office Furniture', 'Electronics', 'Other'] }
    ])
  },
  {
    id: 'pc-9',
    name: 'Automotive',
    slug: 'automotive',
    description: 'Vehicle parts and accessories',
    icon: '🚗',
    parentId: null,
    sortOrder: 9,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'compatibleMake', type: 'text', label: 'Compatible Make' },
      { name: 'compatibleModel', type: 'text', label: 'Compatible Model' },
      { name: 'partType', type: 'text', label: 'Part Type' },
      { name: 'condition', type: 'select', label: 'Condition', options: ['New', 'Used', 'Refurbished'] }
    ])
  },
  {
    id: 'pc-10',
    name: 'Agriculture & Farm',
    slug: 'agriculture',
    description: 'Farm products, seeds, and agricultural supplies',
    icon: '🌾',
    parentId: null,
    sortOrder: 10,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'productType', type: 'select', label: 'Product Type', options: ['Seeds', 'Fertilizer', 'Equipment', 'Crop', 'Livestock', 'Other'] },
      { name: 'organic', type: 'boolean', label: 'Organic' },
      { name: 'quantity', type: 'number', label: 'Quantity' },
      { name: 'unit', type: 'text', label: 'Unit' }
    ])
  },

  // ========================
  // TOP-LEVEL: Services
  // ========================
  {
    id: 'pc-20',
    name: 'Professional Services',
    slug: 'professional-services',
    description: 'Legal, accounting, consulting, and business services',
    icon: '💼',
    parentId: null,
    sortOrder: 20,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'serviceType', type: 'select', label: 'Service Type', options: ['Legal', 'Accounting', 'Consulting', 'IT Services', 'Marketing', 'Photography', 'Other'] },
      { name: 'hourlyRate', type: 'number', label: 'Hourly Rate (USD)' },
      { name: 'minHours', type: 'number', label: 'Minimum Hours' },
      { name: 'certifications', type: 'text', label: 'Certifications' }
    ])
  },
  {
    id: 'pc-21',
    name: 'Repair & Maintenance',
    slug: 'repair-maintenance',
    description: 'Device repair, home repair, and maintenance services',
    icon: '🔧',
    parentId: null,
    sortOrder: 21,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'repairType', type: 'select', label: 'Repair Type', options: ['Phone', 'Laptop', 'Vehicle', 'Plumbing', 'Electrical', 'Appliance', 'Other'] },
      { name: 'diagnosticFee', type: 'number', label: 'Diagnostic Fee (USD)' },
      { name: 'warranty', type: 'text', label: 'Service Warranty' },
      { name: 'mobileService', type: 'boolean', label: 'Mobile Service Available' }
    ])
  },
  {
    id: 'pc-22',
    name: 'Cleaning Services',
    slug: 'cleaning-services',
    description: 'House cleaning, office cleaning, and sanitation services',
    icon: '🧹',
    parentId: null,
    sortOrder: 22,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'serviceType', type: 'select', label: 'Service Type', options: ['House', 'Office', 'Deep Cleaning', 'Move-in/out', 'Post-construction'] },
      { name: 'pricePerHour', type: 'number', label: 'Price per Hour (USD)' },
      { name: 'equipmentIncluded', type: 'boolean', label: 'Equipment Included' },
      { name: 'productsIncluded', type: 'boolean', label: 'Cleaning Products Included' }
    ])
  },
  {
    id: 'pc-23',
    name: 'Beauty & Wellness',
    slug: 'beauty-wellness',
    description: 'Hair, makeup, spa, massage, and wellness services',
    icon: '💆',
    parentId: null,
    sortOrder: 23,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'serviceType', type: 'select', label: 'Service Type', options: ['Hair', 'Makeup', 'Nails', 'Spa', 'Massage', 'Facial', 'Eyebrow', 'Other'] },
      { name: 'pricePerSession', type: 'number', label: 'Price per Session (USD)' },
      { name: 'duration', type: 'number', label: 'Duration (minutes)' },
      { name: 'homeVisit', type: 'boolean', label: 'Home Visit Available' }
    ])
  },
  {
    id: 'pc-24',
    name: 'Education & Training',
    slug: 'education-training',
    description: 'Tutoring, lessons, courses, and training',
    icon: '📚',
    parentId: null,
    sortOrder: 24,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'subjects', type: 'text', label: 'Subjects/Training Areas' },
      { name: 'teachingMode', type: 'select', label: 'Teaching Mode', options: ['In Person', 'Online', 'Both'] },
      { name: 'hourlyRate', type: 'number', label: 'Hourly Rate (USD)' },
      { name: 'groupDiscount', type: 'text', label: 'Group Discount' },
      { name: 'certification', type: 'boolean', label: 'Certificate Provided' }
    ])
  },
  {
    id: 'pc-25',
    name: 'Events & Catering',
    slug: 'events-catering',
    description: 'Event planning, catering, and party services',
    icon: '🎉',
    parentId: null,
    sortOrder: 25,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'serviceType', type: 'select', label: 'Service Type', options: ['Catering', 'Event Planning', 'Decoration', 'Photography', 'Entertainment', 'Rentals'] },
      { name: 'minGuests', type: 'number', label: 'Minimum Guests' },
      { name: 'pricePerPerson', type: 'number', label: 'Price per Person (USD)' },
      { name: 'dietaryOptions', type: 'text', label: 'Dietary Options' }
    ])
  },
  {
    id: 'pc-26',
    name: 'Transportation & Delivery',
    slug: 'transportation-delivery',
    description: 'Logistics, courier, and delivery services',
    icon: '🚚',
    parentId: null,
    sortOrder: 26,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'serviceType', type: 'select', label: 'Service Type', options: ['Courier', 'Moving', 'Food Delivery', 'Cargo', 'Passenger'] },
      { name: 'coverageArea', type: 'text', label: 'Coverage Area' },
      { name: 'baseRate', type: 'number', label: 'Base Rate (USD)' },
      { name: 'perKmRate', type: 'number', label: 'Rate per KM (USD)' }
    ])
  },
  {
    id: 'pc-27',
    name: 'Construction & Renovation',
    slug: 'construction-renovation',
    description: 'Building, renovation, and interior design',
    icon: '🏗️',
    parentId: null,
    sortOrder: 27,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'serviceType', type: 'select', label: 'Service Type', options: ['New Build', 'Renovation', 'Interior Design', 'Electrical', 'Plumbing', 'Painting', 'Roofing'] },
      { name: 'quoteType', type: 'select', label: 'Quote Type', options: ['Fixed Price', 'Estimate', 'Hourly Rate'] },
      { name: 'licenseRequired', type: 'boolean', label: 'License Required' },
      { name: 'insurance', type: 'boolean', label: 'Insurance Provided' }
    ])
  },
  {
    id: 'pc-28',
    name: 'Healthcare Services',
    slug: 'healthcare-services',
    description: 'Medical, dental, and health services',
    icon: '🏥',
    parentId: null,
    sortOrder: 28,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'serviceType', type: 'select', label: 'Service Type', options: ['General Practice', 'Dental', 'Optical', 'Physiotherapy', 'Alternative Medicine', 'Home Care'] },
      { name: 'consultationFee', type: 'number', label: 'Consultation Fee (USD)' },
      { name: 'insuranceAccepted', type: 'boolean', label: 'Insurance Accepted' },
      { name: 'homeVisit', type: 'boolean', label: 'Home Visit Available' }
    ])
  },
  {
    id: 'pc-29',
    name: 'Pet Services',
    slug: 'pet-services',
    description: 'Pet care, grooming, and veterinary services',
    icon: '🐾',
    parentId: null,
    sortOrder: 29,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'serviceType', type: 'select', label: 'Service Type', options: ['Grooming', 'Veterinary', 'Boarding', 'Training', 'Day Care', 'Walking'] },
      { name: 'pricePerSession', type: 'number', label: 'Price per Session (USD)' },
      { name: 'homeVisit', type: 'boolean', label: 'Home Visit Available' },
      { name: 'certifications', type: 'text', label: 'Certifications' }
    ])
  },

  // ========================
  // TOP-LEVEL: Accommodation
  // ========================
  {
    id: 'pc-30',
    name: 'Hotels & Lodging',
    slug: 'hotels-lodging',
    description: 'Hotel rooms and lodging services',
    icon: '🏨',
    parentId: null,
    sortOrder: 30,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'roomType', type: 'select', label: 'Room Type', options: ['Standard', 'Deluxe', 'Suite', 'Family Room', 'Dormitory'] },
      { name: 'bedType', type: 'select', label: 'Bed Type', options: ['Single', 'Double', 'Twin', 'Queen', 'King'] },
      { name: 'maxGuests', type: 'number', label: 'Maximum Guests' },
      { name: 'pricePerNight', type: 'number', label: 'Price per Night (USD)' },
      { name: 'breakfastIncluded', type: 'boolean', label: 'Breakfast Included' },
      { name: 'starRating', type: 'select', label: 'Star Rating', options: ['1', '2', '3', '4', '5'] }
    ])
  },
  {
    id: 'pc-31',
    name: 'Vacation Rentals',
    slug: 'vacation-rentals',
    description: 'Holiday homes and vacation rentals',
    icon: '🏡',
    parentId: null,
    sortOrder: 31,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'bedrooms', type: 'number', label: 'Bedrooms' },
      { name: 'bathrooms', type: 'number', label: 'Bathrooms' },
      { name: 'maxGuests', type: 'number', label: 'Maximum Guests' },
      { name: 'pricePerNight', type: 'number', label: 'Price per Night (USD)' },
      { name: 'amenities', type: 'text', label: 'Amenities' },
      { name: 'petFriendly', type: 'boolean', label: 'Pet Friendly' }
    ])
  },
  {
    id: 'pc-32',
    name: 'Restaurants & Dining',
    slug: 'restaurants-dining',
    description: 'Restaurant menu items and dining services',
    icon: '🍽️',
    parentId: null,
    sortOrder: 32,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'cuisineType', type: 'select', label: 'Cuisine Type', options: ['Timorese', 'Indonesian', 'Chinese', 'Western', 'Japanese', 'Indian', 'Italian', 'Fast Food', 'Seafood', 'Other'] },
      { name: 'priceRange', type: 'select', label: 'Price Range', options: ['$', '$$', '$$$', '$$$$'] },
      { name: 'dietaryOptions', type: 'text', label: 'Dietary Options' },
      { name: 'takeaway', type: 'boolean', label: 'Takeaway Available' },
      { name: 'delivery', type: 'boolean', label: 'Delivery Available' }
    ])
  },
  {
    id: 'pc-33',
    name: 'Catering Services',
    slug: 'catering-services',
    description: 'Event catering and food services',
    icon: '🍴',
    parentId: null,
    sortOrder: 33,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'cuisineType', type: 'select', label: 'Cuisine Type', options: ['Timorese', 'Indonesian', 'Chinese', 'Western', 'Fusion', 'Other'] },
      { name: 'minGuests', type: 'number', label: 'Minimum Guests' },
      { name: 'pricePerPerson', type: 'number', label: 'Price per Person (USD)' },
      { name: 'serviceStaff', type: 'boolean', label: 'Service Staff Included' }
    ])
  },

  // ========================
  // TOP-LEVEL: Digital & Virtual
  // ========================
  {
    id: 'pc-40',
    name: 'Software & Apps',
    slug: 'software-apps',
    description: 'Software licenses and digital products',
    icon: '💻',
    parentId: null,
    sortOrder: 40,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'licenseType', type: 'select', label: 'License Type', options: ['Perpetual', 'Subscription', 'Lifetime'] },
      { name: 'platform', type: 'text', label: 'Platform' },
      { name: 'instantDelivery', type: 'boolean', label: 'Instant Delivery' },
      { name: 'support', type: 'text', label: 'Support Included' }
    ])
  },
  {
    id: 'pc-41',
    name: 'Online Courses',
    slug: 'online-courses',
    description: 'Digital courses and training materials',
    icon: '🎓',
    parentId: null,
    sortOrder: 41,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'duration', type: 'text', label: 'Course Duration' },
      { name: 'level', type: 'select', label: 'Level', options: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] },
      { name: 'certificate', type: 'boolean', label: 'Certificate Provided' },
      { name: 'accessPeriod', type: 'text', label: 'Access Period' }
    ])
  },
  {
    id: 'pc-42',
    name: 'Digital Art & Media',
    slug: 'digital-art-media',
    description: 'E-books, music, and digital art',
    icon: '🎨',
    parentId: null,
    sortOrder: 42,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'format', type: 'select', label: 'Format', options: ['PDF', 'EPUB', 'MOBI', 'MP3', 'MP4', 'JPG', 'PNG', 'SVG', 'Other'] },
      { name: 'instantDelivery', type: 'boolean', label: 'Instant Download' }
    ])
  },

  // ========================
  // TOP-LEVEL: Rentals
  // ========================
  {
    id: 'pc-50',
    name: 'Equipment Rental',
    slug: 'equipment-rental',
    description: 'Tools, electronics, and equipment for rent',
    icon: '🔧',
    parentId: null,
    sortOrder: 50,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'equipmentType', type: 'select', label: 'Equipment Type', options: ['Power Tools', 'Electronics', 'Party Equipment', 'Sports Equipment', 'Other'] },
      { name: 'deposit', type: 'number', label: 'Deposit (USD)' },
      { name: 'pricePerDay', type: 'number', label: 'Price per Day (USD)' },
      { name: 'minRentalDays', type: 'number', label: 'Minimum Rental Days' }
    ])
  },
  {
    id: 'pc-51',
    name: 'Vehicle Rental',
    slug: 'vehicle-rental',
    description: 'Cars, motorcycles, and bicycles for rent',
    icon: '🚗',
    parentId: null,
    sortOrder: 51,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'vehicleType', type: 'select', label: 'Vehicle Type', options: ['Car', 'Motorcycle', 'Bicycle', 'Van', 'Truck'] },
      { name: 'pricePerDay', type: 'number', label: 'Price per Day (USD)' },
      { name: 'insurance', type: 'boolean', label: 'Insurance Included' },
      { name: 'driverAvailable', type: 'boolean', label: 'Driver Available' }
    ])
  },
  {
    id: 'pc-52',
    name: 'Venue Rental',
    slug: 'venue-rental',
    description: 'Spaces for events and meetings',
    icon: '🏛️',
    parentId: null,
    sortOrder: 52,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'venueType', type: 'select', label: 'Venue Type', options: ['Meeting Room', 'Conference Hall', 'Wedding Venue', 'Party Space', 'Co-working'] },
      { name: 'capacity', type: 'number', label: 'Capacity (people)' },
      { name: 'pricePerHour', type: 'number', label: 'Price per Hour (USD)' },
      { name: 'equipmentIncluded', type: 'text', label: 'Equipment Included' }
    ])
  },

  // ========================
  // TOP-LEVEL: Tickets
  // ========================
  {
    id: 'pc-60',
    name: 'Event Tickets',
    slug: 'event-tickets',
    description: 'Tickets for concerts, shows, and events',
    icon: '🎫',
    parentId: null,
    sortOrder: 60,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'eventType', type: 'select', label: 'Event Type', options: ['Concert', 'Sports', 'Theater', 'Festival', 'Conference', 'Other'] },
      { name: 'eventDate', type: 'date', label: 'Event Date', required: true },
      { name: 'venue', type: 'text', label: 'Venue', required: true },
      { name: 'seatCategory', type: 'text', label: 'Seat Category' }
    ])
  },
  {
    id: 'pc-61',
    name: 'Transportation Tickets',
    slug: 'transportation-tickets',
    description: 'Bus, ferry, and flight tickets',
    icon: '✈️',
    parentId: null,
    sortOrder: 61,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'transportType', type: 'select', label: 'Transport Type', options: ['Bus', 'Ferry', 'Flight', 'Taxi'] },
      { name: 'route', type: 'text', label: 'Route' },
      { name: 'departureDate', type: 'date', label: 'Departure Date', required: true },
      { name: 'class', type: 'select', label: 'Class', options: ['Economy', 'Business', 'First'] }
    ])
  },

  // ========================
  // SUB-CATEGORIES: Electronics
  // ========================
  {
    id: 'pc-1-1',
    name: 'Phones & Tablets',
    slug: 'phones-tablets',
    description: 'Mobile phones and tablets',
    icon: '📱',
    parentId: 'pc-1',
    sortOrder: 11,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'brand', type: 'text', label: 'Brand', required: true },
      { name: 'model', type: 'text', label: 'Model', required: true },
      { name: 'storage', type: 'text', label: 'Storage' },
      { name: 'color', type: 'text', label: 'Color' },
      { name: 'condition', type: 'select', label: 'Condition', options: ['New', 'Like New', 'Good', 'Fair'] },
      { name: 'warranty', type: 'text', label: 'Warranty' },
      { name: 'negotiable', type: 'boolean', label: 'Price Negotiable' }
    ])
  },
  {
    id: 'pc-1-2',
    name: 'Computers & Laptops',
    slug: 'computers-laptops',
    description: 'Desktop computers and laptops',
    icon: '💻',
    parentId: 'pc-1',
    sortOrder: 12,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'brand', type: 'text', label: 'Brand', required: true },
      { name: 'model', type: 'text', label: 'Model' },
      { name: 'processor', type: 'text', label: 'Processor' },
      { name: 'ram', type: 'text', label: 'RAM' },
      { name: 'storage', type: 'text', label: 'Storage' },
      { name: 'condition', type: 'select', label: 'Condition', options: ['New', 'Like New', 'Good', 'Fair'] },
      { name: 'warranty', type: 'text', label: 'Warranty' }
    ])
  },
  {
    id: 'pc-1-3',
    name: 'Cameras & Photography',
    slug: 'cameras-photography',
    description: 'Cameras and photography equipment',
    icon: '📷',
    parentId: 'pc-1',
    sortOrder: 13,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'brand', type: 'text', label: 'Brand', required: true },
      { name: 'model', type: 'text', label: 'Model' },
      { name: 'condition', type: 'select', label: 'Condition', options: ['New', 'Like New', 'Good', 'Used'] },
      { name: 'accessories', type: 'text', label: 'Accessories Included' }
    ])
  },

  // SUB-CATEGORIES: Fashion
  {
    id: 'pc-2-1',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Men and women clothing',
    icon: '👕',
    parentId: 'pc-2',
    sortOrder: 21,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'gender', type: 'select', label: 'Gender', options: ['Men', 'Women', 'Unisex'], required: true },
      { name: 'size', type: 'text', label: 'Size', required: true },
      { name: 'brand', type: 'text', label: 'Brand' },
      { name: 'material', type: 'text', label: 'Material' },
      { name: 'color', type: 'text', label: 'Color' },
      { name: 'condition', type: 'select', label: 'Condition', options: ['New', 'Like New', 'Good'] }
    ])
  },
  {
    id: 'pc-2-2',
    name: 'Shoes & Footwear',
    slug: 'shoes-footwear',
    description: 'Shoes and footwear',
    icon: '👟',
    parentId: 'pc-2',
    sortOrder: 22,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'gender', type: 'select', label: 'Gender', options: ['Men', 'Women', 'Kids', 'Unisex'], required: true },
      { name: 'size', type: 'text', label: 'Size', required: true },
      { name: 'brand', type: 'text', label: 'Brand' },
      { name: 'condition', type: 'select', label: 'Condition', options: ['New', 'Like New', 'Good'] }
    ])
  },
  {
    id: 'pc-2-3',
    name: 'Bags & Luggage',
    slug: 'bags-luggage',
    description: 'Bags, backpacks, and luggage',
    icon: '🎒',
    parentId: 'pc-2',
    sortOrder: 23,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'bagType', type: 'select', label: 'Type', options: ['Backpack', 'Handbag', 'Wallet', 'Travel Bag', 'Luggage'] },
      { name: 'brand', type: 'text', label: 'Brand' },
      { name: 'material', type: 'text', label: 'Material' },
      { name: 'condition', type: 'select', label: 'Condition', options: ['New', 'Like New', 'Good'] }
    ])
  },

  // SUB-CATEGORIES: Food & Beverages
  {
    id: 'pc-3-1',
    name: 'Coffee & Tea',
    slug: 'coffee-tea',
    description: 'Coffee and tea products',
    icon: '☕',
    parentId: 'pc-3',
    sortOrder: 31,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'productType', type: 'select', label: 'Type', options: ['Coffee Beans', 'Ground Coffee', 'Tea', 'Instant Coffee'], required: true },
      { name: 'origin', type: 'text', label: 'Origin' },
      { name: 'organic', type: 'boolean', label: 'Organic' },
      { name: 'roastLevel', type: 'text', label: 'Roast Level' },
      { name: 'unit', type: 'text', label: 'Unit/Weight' }
    ])
  },
  {
    id: 'pc-3-2',
    name: 'Local Products',
    slug: 'local-products',
    description: 'Timor-Leste local products',
    icon: '🏺',
    parentId: 'pc-3',
    sortOrder: 32,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'productType', type: 'select', label: 'Type', options: ['Handicraft', 'Textiles', 'Honey', 'Candles', 'Soap', 'Other'], required: true },
      { name: 'handmade', type: 'boolean', label: 'Handmade' },
      { name: 'localSource', type: 'text', label: 'Community/Cooperative' }
    ])
  },

  // SUB-CATEGORIES: Professional Services
  {
    id: 'pc-20-1',
    name: 'IT & Tech Services',
    slug: 'it-tech-services',
    description: 'Web development, IT support, and tech consulting',
    icon: '💻',
    parentId: 'pc-20',
    sortOrder: 201,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'serviceType', type: 'select', label: 'Service', options: ['Web Development', 'App Development', 'IT Support', 'Consulting', 'Data Analysis', 'Other'], required: true },
      { name: 'hourlyRate', type: 'number', label: 'Hourly Rate (USD)' },
      { name: 'portfolio', type: 'url', label: 'Portfolio URL' },
      { name: 'technologies', type: 'text', label: 'Technologies' }
    ])
  },
  {
    id: 'pc-20-2',
    name: 'Legal Services',
    slug: 'legal-services',
    description: 'Legal advice and documentation',
    icon: '⚖️',
    parentId: 'pc-20',
    sortOrder: 202,
    isActive: true,
    formFields: JSON.stringify([
      { name: 'practiceArea', type: 'select', label: 'Practice Area', options: ['Corporate', 'Family', 'Criminal', 'Property', 'Immigration', 'General'], required: true },
      { name: 'consultationFee', type: 'number', label: 'Consultation Fee (USD)' },
      { name: 'languages', type: 'text', label: 'Languages' },
      { name: 'barNumber', type: 'text', label: 'Bar/License Number' }
    ])
  },
];

export const insertProductCategoriesSQL = productCategories.map(cat => `
  INSERT INTO product_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields)
  VALUES (
    '${cat.id}',
    '${cat.name.replace(/'/g, "''")}',
    '${cat.slug}',
    '${cat.description?.replace(/'/g, "''") || ''}',
    '${cat.icon}',
    ${cat.parentId ? `'${cat.parentId}'` : 'NULL'},
    ${cat.sortOrder},
    ${cat.isActive ? 1 : 0},
    '${cat.formFields.replace(/'/g, "''")}'
  );
`).join('\n');

export default productCategories;
