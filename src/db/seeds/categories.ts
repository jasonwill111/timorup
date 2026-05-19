/**
 * Listing Categories Seed Data
 * TimorLink - Classification Ads Categories
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

import { sql } from 'drizzle-orm';

// Form field types: text, number, select, multi-select, boolean, date, url

export const listingCategories = [
  // ========================
  // TOP-LEVEL CATEGORIES
  // ========================

  {
    id: 'lc-1',
    name: 'Jobs',
    slug: 'jobs',
    description: 'Employment opportunities and job postings',
    icon: '💼',
    parentId: null,
    sortOrder: 1,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'employmentType', type: 'select', label: 'Employment Type', required: true, options: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'] },
      { name: 'salary', type: 'number', label: 'Salary', required: false },
      { name: 'salaryCurrency', type: 'select', label: 'Currency', options: ['USD', 'IDR', 'AUD', 'EUR'] },
      { name: 'salaryPeriod', type: 'select', label: 'Salary Period', options: ['month', 'week', 'day', 'hour'] },
      { name: 'experienceLevel', type: 'select', label: 'Experience Level', options: ['Entry', 'Mid', 'Senior', 'Executive'] },
      { name: 'qualifications', type: 'text', label: 'Qualifications' },
      { name: 'benefits', type: 'text', label: 'Benefits' },
      { name: 'applicationDeadline', type: 'date', label: 'Application Deadline' }
    ])
  },
  {
    id: 'lc-2',
    name: 'For Sale',
    slug: 'for-sale',
    description: 'Items for sale by individuals',
    icon: '🏷�?,
    parentId: null,
    sortOrder: 2,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'condition', type: 'select', label: 'Condition', required: true, options: ['New', 'Like New', 'Good', 'Fair', 'For Parts'] },
      { name: 'negotiable', type: 'boolean', label: 'Price Negotiable' }
    ])
  },
  {
    id: 'lc-3',
    name: 'Vehicles',
    slug: 'vehicles',
    description: 'Cars, motorcycles, and other vehicles',
    icon: '🚗',
    parentId: null,
    sortOrder: 3,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'vehicleType', type: 'select', label: 'Vehicle Type', required: true, options: ['Car', 'Motorcycle', 'Bicycle', 'Boat', 'Truck', 'Van', 'Bus', 'Other'] },
      { name: 'make', type: 'text', label: 'Make/Brand', required: true },
      { name: 'model', type: 'text', label: 'Model', required: true },
      { name: 'year', type: 'number', label: 'Year', required: true },
      { name: 'mileage', type: 'number', label: 'Mileage (km)' },
      { name: 'fuelType', type: 'select', label: 'Fuel Type', options: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
      { name: 'transmission', type: 'select', label: 'Transmission', options: ['Manual', 'Automatic'] },
      { name: 'color', type: 'text', label: 'Color' },
      { name: 'condition', type: 'select', label: 'Condition', options: ['New', 'Excellent', 'Good', 'Fair'] },
      { name: 'negotiable', type: 'boolean', label: 'Price Negotiable' }
    ])
  },
  {
    id: 'lc-4',
    name: 'Property',
    slug: 'property',
    description: 'Real estate for sale',
    icon: '🏠',
    parentId: null,
    sortOrder: 4,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'propertyType', type: 'select', label: 'Property Type', required: true, options: ['House', 'Apartment', 'Land', 'Commercial', 'Industrial'] },
      { name: 'bedrooms', type: 'number', label: 'Bedrooms' },
      { name: 'bathrooms', type: 'number', label: 'Bathrooms' },
      { name: 'landSize', type: 'number', label: 'Land Size (m²)' },
      { name: 'buildingSize', type: 'number', label: 'Building Size (m²)' },
      { name: 'condition', type: 'select', label: 'Condition', options: ['New', 'Good', 'Needs Renovation'] },
      { name: 'negotiable', type: 'boolean', label: 'Price Negotiable' }
    ])
  },
  {
    id: 'lc-5',
    name: 'Rentals',
    slug: 'rentals',
    description: 'Property and equipment for rent',
    icon: '🔑',
    parentId: null,
    sortOrder: 5,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'rentalType', type: 'select', label: 'Rental Type', required: true, options: ['Apartment', 'House', 'Room', 'Office', 'Shop', 'Land', 'Equipment'] },
      { name: 'bedrooms', type: 'number', label: 'Bedrooms' },
      { name: 'bathrooms', type: 'number', label: 'Bathrooms' },
      { name: 'minRentalDays', type: 'number', label: 'Minimum Rental Days' },
      { name: 'availableFrom', type: 'date', label: 'Available From' },
      { name: 'furnished', type: 'boolean', label: 'Furnished' }
    ])
  },
  {
    id: 'lc-6',
    name: 'Services',
    slug: 'services',
    description: 'Professional and personal services',
    icon: '🔧',
    parentId: null,
    sortOrder: 6,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'serviceType', type: 'select', label: 'Service Type', required: true, options: ['Professional', 'Repair', 'Cleaning', 'Beauty', 'Education', 'Events', 'Photography', 'Other'] },
      { name: 'serviceArea', type: 'text', label: 'Service Area' },
      { name: 'available', type: 'boolean', label: 'Available Now' },
      { name: 'homeVisit', type: 'boolean', label: 'Home Visit Available' }
    ])
  },
  {
    id: 'lc-7',
    name: 'Wanted',
    slug: 'wanted',
    description: 'Items or services people are looking for',
    icon: '🔍',
    parentId: null,
    sortOrder: 7,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'wantedType', type: 'select', label: 'Looking For', required: true, options: ['Item', 'Service', 'Property', 'Vehicle', 'Job', 'Other'] },
      { name: 'budget', type: 'number', label: 'Budget' },
      { name: 'urgency', type: 'select', label: 'Urgency', options: ['Flexible', 'Soon', 'Urgent'] }
    ])
  },
  {
    id: 'lc-8',
    name: 'Events',
    slug: 'events',
    description: 'Concerts, workshops, and community events',
    icon: '🎭',
    parentId: null,
    sortOrder: 8,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'eventType', type: 'select', label: 'Event Type', required: true, options: ['Concert', 'Workshop', 'Conference', 'Festival', 'Sports', 'Community', 'Other'] },
      { name: 'eventDate', type: 'date', label: 'Event Date', required: true },
      { name: 'venue', type: 'text', label: 'Venue' },
      { name: 'ticketPrice', type: 'number', label: 'Ticket Price' },
      { name: 'freeEntry', type: 'boolean', label: 'Free Entry' }
    ])
  },
  {
    id: 'lc-9',
    name: 'Pets',
    slug: 'pets',
    description: 'Pets for sale, adoption, or looking for home',
    icon: '🐾',
    parentId: null,
    sortOrder: 9,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'petType', type: 'select', label: 'Pet Type', required: true, options: ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Other'] },
      { name: 'breed', type: 'text', label: 'Breed' },
      { name: 'age', type: 'select', label: 'Age', options: ['Baby', 'Young', 'Adult', 'Senior'] },
      { name: 'gender', type: 'select', label: 'Gender', options: ['Male', 'Female'] },
      { name: 'vaccinated', type: 'boolean', label: 'Vaccinated' },
      { name: 'neutered', type: 'boolean', label: 'Neutered/Spayed' },
      { name: 'listingType', type: 'select', label: 'Listing Type', options: ['For Sale', 'Free', 'For Adoption', 'Lost', 'Found'] }
    ])
  },
  {
    id: 'lc-10',
    name: 'Agriculture',
    slug: 'agriculture',
    description: 'Farm products, livestock, and agricultural equipment',
    icon: '🌾',
    parentId: null,
    sortOrder: 10,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'agriType', type: 'select', label: 'Type', required: true, options: ['Crop', 'Livestock', 'Equipment', 'Seeds', 'Fertilizer', 'Other'] },
      { name: 'organic', type: 'boolean', label: 'Organic' },
      { name: 'quantity', type: 'number', label: 'Quantity' },
      { name: 'unit', type: 'text', label: 'Unit (kg, head, etc.)' }
    ])
  },

  // ========================
  // SUB-CATEGORIES (For Sale)
  // ========================
  {
    id: 'lc-2-1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Phones, computers, and gadgets',
    icon: '📱',
    parentId: 'lc-2',
    sortOrder: 21,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'brand', type: 'text', label: 'Brand', required: true },
      { name: 'model', type: 'text', label: 'Model' },
      { name: 'condition', type: 'select', label: 'Condition', required: true, options: ['New', 'Like New', 'Good', 'Fair', 'For Parts'] },
      { name: 'negotiable', type: 'boolean', label: 'Price Negotiable' }
    ])
  },
  {
    id: 'lc-2-2',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, shoes, and accessories',
    icon: '👗',
    parentId: 'lc-2',
    sortOrder: 22,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'gender', type: 'select', label: 'Gender', options: ['Men', 'Women', 'Unisex', 'Kids'] },
      { name: 'size', type: 'text', label: 'Size' },
      { name: 'brand', type: 'text', label: 'Brand' },
      { name: 'condition', type: 'select', label: 'Condition', required: true, options: ['New', 'Like New', 'Good', 'Fair'] },
      { name: 'negotiable', type: 'boolean', label: 'Price Negotiable' }
    ])
  },
  {
    id: 'lc-2-3',
    name: 'Furniture',
    slug: 'furniture',
    description: 'Home and office furniture',
    icon: '🪑',
    parentId: 'lc-2',
    sortOrder: 23,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'furnitureType', type: 'select', label: 'Type', options: ['Sofa', 'Bed', 'Table', 'Chair', 'Cabinet', 'Desk', 'Other'] },
      { name: 'material', type: 'text', label: 'Material' },
      { name: 'dimensions', type: 'text', label: 'Dimensions' },
      { name: 'condition', type: 'select', label: 'Condition', required: true, options: ['New', 'Like New', 'Good', 'Fair'] },
      { name: 'negotiable', type: 'boolean', label: 'Price Negotiable' }
    ])
  },
  {
    id: 'lc-2-4',
    name: 'Sports',
    slug: 'sports-equipment',
    description: 'Sports gear and equipment',
    icon: '�?,
    parentId: 'lc-2',
    sortOrder: 24,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'sportType', type: 'select', label: 'Sport', options: ['Football', 'Basketball', 'Tennis', 'Swimming', 'Cycling', 'Gym', 'Other'] },
      { name: 'condition', type: 'select', label: 'Condition', required: true, options: ['New', 'Like New', 'Good', 'Fair'] },
      { name: 'negotiable', type: 'boolean', label: 'Price Negotiable' }
    ])
  },

  // SUB-CATEGORIES (Services)
  {
    id: 'lc-6-1',
    name: 'Professional Services',
    slug: 'professional-services',
    description: 'Legal, accounting, consulting',
    icon: '💼',
    parentId: 'lc-6',
    sortOrder: 61,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'serviceType', type: 'select', label: 'Service Type', required: true, options: ['Legal', 'Accounting', 'Consulting', 'IT Services', 'Marketing'] },
      { name: 'experience', type: 'text', label: 'Years of Experience' },
      { name: 'languages', type: 'text', label: 'Languages Spoken' },
      { name: 'available', type: 'boolean', label: 'Available Now' }
    ])
  },
  {
    id: 'lc-6-2',
    name: 'Home Services',
    slug: 'home-services',
    description: 'Repair, cleaning, maintenance',
    icon: '🔧',
    parentId: 'lc-6',
    sortOrder: 62,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'serviceType', type: 'select', label: 'Service Type', required: true, options: ['Plumbing', 'Electrical', 'Painting', 'Cleaning', 'Pest Control', 'AC Repair', 'Carpentry'] },
      { name: 'serviceArea', type: 'text', label: 'Service Area' },
      { name: 'homeVisit', type: 'boolean', label: 'Home Visit Available' },
      { name: 'available', type: 'boolean', label: 'Available Now' }
    ])
  },
  {
    id: 'lc-6-3',
    name: 'Beauty & Wellness',
    slug: 'beauty-wellness',
    description: 'Hair, makeup, spa, massage',
    icon: '💆',
    parentId: 'lc-6',
    sortOrder: 63,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'serviceType', type: 'select', label: 'Service Type', required: true, options: ['Hair', 'Makeup', 'Nails', 'Spa', 'Massage', 'Facial', 'Eyebrow'] },
      { name: 'homeVisit', type: 'boolean', label: 'Home Visit Available' },
      { name: 'available', type: 'boolean', label: 'Available Now' }
    ])
  },
  {
    id: 'lc-6-4',
    name: 'Education & Tutoring',
    slug: 'education-tutoring',
    description: 'Tutoring, lessons, training',
    icon: '📚',
    parentId: 'lc-6',
    sortOrder: 64,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'subjects', type: 'text', label: 'Subjects/Topics' },
      { name: 'teachingMode', type: 'select', label: 'Teaching Mode', options: ['In Person', 'Online', 'Both'] },
      { name: 'hourlyRate', type: 'number', label: 'Hourly Rate (USD)' },
      { name: 'available', type: 'boolean', label: 'Available Now' }
    ])
  },

  // SUB-CATEGORIES (Property)
  {
    id: 'lc-4-1',
    name: 'Houses',
    slug: 'houses-for-sale',
    description: 'Houses for sale',
    icon: '🏡',
    parentId: 'lc-4',
    sortOrder: 41,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'bedrooms', type: 'number', label: 'Bedrooms', required: true },
      { name: 'bathrooms', type: 'number', label: 'Bathrooms' },
      { name: 'landSize', type: 'number', label: 'Land Size (m²)' },
      { name: 'buildingSize', type: 'number', label: 'Building Size (m²)' },
      { name: 'condition', type: 'select', label: 'Condition', options: ['New', 'Good', 'Needs Renovation'] },
      { name: 'negotiable', type: 'boolean', label: 'Price Negotiable' }
    ])
  },
  {
    id: 'lc-4-2',
    name: 'Apartments',
    slug: 'apartments-for-sale',
    description: 'Apartments and condos for sale',
    icon: '🏢',
    parentId: 'lc-4',
    sortOrder: 42,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'bedrooms', type: 'number', label: 'Bedrooms', required: true },
      { name: 'bathrooms', type: 'number', label: 'Bathrooms' },
      { name: 'floorLevel', type: 'number', label: 'Floor Level' },
      { name: 'buildingSize', type: 'number', label: 'Unit Size (m²)' },
      { name: 'negotiable', type: 'boolean', label: 'Price Negotiable' }
    ])
  },
  {
    id: 'lc-4-3',
    name: 'Land',
    slug: 'land-for-sale',
    description: 'Land and plots for sale',
    icon: '🏔�?,
    parentId: 'lc-4',
    sortOrder: 43,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'landSize', type: 'number', label: 'Land Size (m²)', required: true },
      { name: 'landType', type: 'select', label: 'Land Type', options: ['Residential', 'Commercial', 'Agricultural', 'Industrial'] },
      { name: 'negotiable', type: 'boolean', label: 'Price Negotiable' }
    ])
  },

  // SUB-CATEGORIES (Vehicles)
  {
    id: 'lc-3-1',
    name: 'Cars',
    slug: 'cars',
    description: 'Cars and passenger vehicles',
    icon: '🚙',
    parentId: 'lc-3',
    sortOrder: 31,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'make', type: 'text', label: 'Make/Brand', required: true },
      { name: 'model', type: 'text', label: 'Model', required: true },
      { name: 'year', type: 'number', label: 'Year', required: true },
      { name: 'mileage', type: 'number', label: 'Mileage (km)' },
      { name: 'fuelType', type: 'select', label: 'Fuel Type', options: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
      { name: 'transmission', type: 'select', label: 'Transmission', options: ['Manual', 'Automatic'] },
      { name: 'color', type: 'text', label: 'Color' },
      { name: 'condition', type: 'select', label: 'Condition', options: ['New', 'Excellent', 'Good', 'Fair'] },
      { name: 'negotiable', type: 'boolean', label: 'Price Negotiable' }
    ])
  },
  {
    id: 'lc-3-2',
    name: 'Motorcycles',
    slug: 'motorcycles',
    description: 'Motorcycles and scooters',
    icon: '🏍�?,
    parentId: 'lc-3',
    sortOrder: 32,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'make', type: 'text', label: 'Make/Brand', required: true },
      { name: 'model', type: 'text', label: 'Model', required: true },
      { name: 'year', type: 'number', label: 'Year', required: true },
      { name: 'mileage', type: 'number', label: 'Mileage (km)' },
      { name: 'engineSize', type: 'number', label: 'Engine Size (cc)' },
      { name: 'condition', type: 'select', label: 'Condition', options: ['New', 'Excellent', 'Good', 'Fair'] },
      { name: 'negotiable', type: 'boolean', label: 'Price Negotiable' }
    ])
  },
];

export const insertListingCategoriesSQL = listingCategories.map(cat => `
  INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields)
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

export default listingCategories;

