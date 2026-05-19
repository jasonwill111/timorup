/**
 * Business Industry Categories Seed Data
 * TimorLink - Business Directory Categories
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

export const businessCategories = [
  // ========================
  // TOP-LEVEL INDUSTRIES
  // ========================

  {
    id: 'bc-1',
    name: 'Restaurants & Cafés',
    slug: 'restaurants-cafes',
    description: 'Food service establishments',
    icon: '🍽�?,
    parentId: null,
    sortOrder: 1,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'cuisineType', type: 'select', label: 'Cuisine Type', required: true, options: ['Timorese', 'Portuguese', 'Indonesian', 'Chinese', 'Indian', 'Italian', 'Fast Food', 'Seafood', 'Western', 'Fusion', 'Other'] },
      { name: 'priceRange', type: 'select', label: 'Price Range', options: ['$', '$$', '$$$', '$$$$'] },
      { name: 'openingHours', type: 'text', label: 'Opening Hours' },
      { name: 'outdoorSeating', type: 'boolean', label: 'Outdoor Seating' },
      { name: 'liveMusic', type: 'boolean', label: 'Live Music' },
      { name: 'wifiAvailable', type: 'boolean', label: 'WiFi Available' }
    ])
  },
  {
    id: 'bc-2',
    name: 'Accommodation',
    slug: 'accommodation',
    description: 'Hotels, guesthouses, and lodging',
    icon: '🏨',
    parentId: null,
    sortOrder: 2,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'accommodationType', type: 'select', label: 'Type', required: true, options: ['Hotel', 'Guesthouse', 'Homestay', 'Hostel', 'Resort', 'Villa', 'Lodge', 'Apartment'] },
      { name: 'starRating', type: 'select', label: 'Star Rating', options: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars', 'Unrated'] },
      { name: 'roomCount', type: 'number', label: 'Number of Rooms' },
      { name: 'checkInTime', type: 'text', label: 'Check-in Time' },
      { name: 'checkOutTime', type: 'text', label: 'Check-out Time' },
      { name: 'breakfastIncluded', type: 'boolean', label: 'Breakfast Included' },
      { name: 'poolAvailable', type: 'boolean', label: 'Pool Available' },
      { name: 'wifiAvailable', type: 'boolean', label: 'WiFi Available' },
      { name: 'airConditioning', type: 'boolean', label: 'Air Conditioning' }
    ])
  },
  {
    id: 'bc-3',
    name: 'Retail & Shops',
    slug: 'retail-shops',
    description: 'Retail stores and shops',
    icon: '🏪',
    parentId: null,
    sortOrder: 3,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'retailType', type: 'select', label: 'Store Type', required: true, options: ['Grocery', 'Clothing', 'Electronics', 'Furniture', 'Hardware', 'Pharmacy', 'Books', 'Sports', 'Beauty', 'Jewelry', 'Souvenirs', 'Other'] },
      { name: 'parkingAvailable', type: 'boolean', label: 'Parking Available' },
      { name: 'openingHours', type: 'text', label: 'Opening Hours' }
    ])
  },
  {
    id: 'bc-4',
    name: 'Transportation',
    slug: 'transportation',
    description: 'Transport services and vehicle rental',
    icon: '🚗',
    parentId: null,
    sortOrder: 4,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'transportType', type: 'select', label: 'Service Type', required: true, options: ['Taxi', 'Rent-a-Car', 'Motorcycle Rental', 'Bus', 'Boat/Ferry', 'Airport Transfer', 'Trucking', 'Logistics', 'Driving School'] },
      { name: 'fleetSize', type: 'number', label: 'Fleet Size' },
      { name: 'operatingHours', type: 'text', label: 'Operating Hours' },
      { name: 'homePickup', type: 'boolean', label: 'Home Pickup Available' }
    ])
  },
  {
    id: 'bc-5',
    name: 'Professional Services',
    slug: 'professional-services',
    description: 'Legal, accounting, consulting',
    icon: '💼',
    parentId: null,
    sortOrder: 5,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'serviceType', type: 'select', label: 'Service Type', required: true, options: ['Legal', 'Accounting', 'Consulting', 'IT Services', 'Marketing', 'Architecture', 'Engineering', 'Insurance', 'Real Estate', 'Other'] },
      { name: 'languages', type: 'text', label: 'Languages Spoken' },
      { name: 'experience', type: 'text', label: 'Years of Experience' },
      { name: 'certifications', type: 'text', label: 'Certifications' }
    ])
  },
  {
    id: 'bc-6',
    name: 'Health & Wellness',
    slug: 'health-wellness',
    description: 'Healthcare and wellness services',
    icon: '🏥',
    parentId: null,
    sortOrder: 6,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'healthType', type: 'select', label: 'Service Type', required: true, options: ['Hospital', 'Clinic', 'Pharmacy', 'Dental', 'Optical', 'Laboratory', 'Physiotherapy', 'Mental Health', 'Traditional Medicine', 'Gym/Fitness', 'Spa', 'Beauty Salon', 'Barbershop'] },
      { name: 'emergencyService', type: 'boolean', label: '24/7 Emergency' },
      { name: 'insuranceAccepted', type: 'boolean', label: 'Insurance Accepted' },
      { name: 'parkingAvailable', type: 'boolean', label: 'Parking Available' }
    ])
  },
  {
    id: 'bc-7',
    name: 'Education & Training',
    slug: 'education-training',
    description: 'Schools, courses, and training',
    icon: '🎓',
    parentId: null,
    sortOrder: 7,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'educationType', type: 'select', label: 'Institution Type', required: true, options: ['University', 'School', 'Vocational Training', 'Language School', 'Driving School', 'Music School', 'Art School', 'Tutoring Center', 'Online Platform', 'Other'] },
      { name: 'accreditation', type: 'text', label: 'Accreditation' },
      { name: 'ageGroups', type: 'text', label: 'Age Groups Served' },
      { name: 'classSize', type: 'text', label: 'Average Class Size' }
    ])
  },
  {
    id: 'bc-8',
    name: 'Construction & Trades',
    slug: 'construction-trades',
    description: 'Building and home services',
    icon: '🏗�?,
    parentId: null,
    sortOrder: 8,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'tradeType', type: 'select', label: 'Service Type', required: true, options: ['General Contractor', 'Electrical', 'Plumbing', 'Painting', 'Carpentry', 'Roofing', 'Landscaping', 'Cleaning', 'Pest Control', 'AC Repair', 'Security Systems', 'Masonry', 'Other'] },
      { name: 'licensed', type: 'boolean', label: 'Licensed & Insured' },
      { name: 'serviceArea', type: 'text', label: 'Service Area' },
      { name: 'freeQuote', type: 'boolean', label: 'Free Estimates' }
    ])
  },
  {
    id: 'bc-9',
    name: 'Entertainment & Events',
    slug: 'entertainment-events',
    description: 'Entertainment and event services',
    icon: '🎭',
    parentId: null,
    sortOrder: 9,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'entertainmentType', type: 'select', label: 'Service Type', required: true, options: ['Cinema', 'Theater', 'Nightclub', 'Bar', 'Karaoke', 'Bowling', 'Arcade', 'Events Venue', 'Photography', 'Videography', 'DJ Services', 'Event Planning', 'Catering', 'Other'] },
      { name: 'capacity', type: 'number', label: 'Capacity (people)' },
      { name: 'openingHours', type: 'text', label: 'Opening Hours' },
      { name: 'ageRestriction', type: 'text', label: 'Age Restriction' }
    ])
  },
  {
    id: 'bc-10',
    name: 'Agriculture & Farming',
    slug: 'agriculture-farming',
    description: 'Agricultural products and services',
    icon: '🌾',
    parentId: null,
    sortOrder: 10,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'agriType', type: 'select', label: 'Type', required: true, options: ['Farm', 'Nursery', 'AgriSupplier', 'Livestock', 'Fishery', 'Coffee Farm', 'Organic Farm', 'AgriProcessing', 'Other'] },
      { name: 'organicCertified', type: 'boolean', label: 'Organic Certified' },
      { name: 'productTypes', type: 'text', label: 'Products Grown/Sold' },
      { name: 'farmVisits', type: 'boolean', label: 'Farm Visits Available' }
    ])
  },
  {
    id: 'bc-11',
    name: 'Computers & Electronics',
    slug: 'computers-electronics',
    description: 'Tech shops and services',
    icon: '💻',
    parentId: null,
    sortOrder: 11,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'techType', type: 'select', label: 'Service Type', required: true, options: ['Computer Shop', 'Phone Shop', 'Repair Service', 'Software Development', 'Web Design', 'IT Support', 'Network Installation', 'CCTV Installation', 'Gaming', 'Other'] },
      { name: 'warrantyOffered', type: 'boolean', label: 'Warranty Offered' },
      { name: 'partsAvailable', type: 'boolean', label: 'Parts Available' }
    ])
  },
  {
    id: 'bc-12',
    name: 'Fashion & Beauty',
    slug: 'fashion-beauty',
    description: 'Clothing, accessories, and beauty services',
    icon: '👗',
    parentId: null,
    sortOrder: 12,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'fashionType', type: 'select', label: 'Business Type', required: true, options: ['Clothing Store', 'Shoes', 'Accessories', 'Tailoring', 'Laundry/Dry Clean', 'Hair Salon', 'Nail Salon', 'Barbershop', 'Spa', 'Makeup Artist', 'Fashion Designer', 'Other'] },
      { name: 'customOrders', type: 'boolean', label: 'Custom Orders' },
      { name: 'appointmentOnly', type: 'boolean', label: 'Appointment Only' }
    ])
  },

  // ========================
  // SUB-CATEGORIES (Restaurants & Cafés)
  // ========================
  {
    id: 'bc-1-1',
    name: 'Timorese Cuisine',
    slug: 'timorese-restaurants',
    description: 'Traditional Timor-Leste cuisine',
    icon: '🍲',
    parentId: 'bc-1',
    sortOrder: 11,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'traditionalDishes', type: 'text', label: 'Traditional Dishes' },
      { name: 'regionalSpecialty', type: 'text', label: 'Regional Specialty' }
    ])
  },
  {
    id: 'bc-1-2',
    name: 'Coffee Shops',
    slug: 'coffee-shops',
    description: 'Coffee shops and cafés',
    icon: '�?,
    parentId: 'bc-1',
    sortOrder: 12,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'coffeeOrigin', type: 'text', label: 'Coffee Origin' },
      { name: 'beansAvailable', type: 'select', label: 'Beans Available', options: ['Local Timor', 'Imported', 'Both'] }
    ])
  },
  {
    id: 'bc-1-3',
    name: 'Fast Food',
    slug: 'fast-food',
    description: 'Fast food chains and outlets',
    icon: '🍟',
    parentId: 'bc-1',
    sortOrder: 13,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'chainName', type: 'text', label: 'Chain Name' },
      { name: 'deliveryAvailable', type: 'boolean', label: 'Delivery Available' }
    ])
  },

  // SUB-CATEGORIES (Accommodation)
  {
    id: 'bc-2-1',
    name: 'Hotels',
    slug: 'hotels',
    description: 'Hotels and resorts',
    icon: '🏨',
    parentId: 'bc-2',
    sortOrder: 21,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'starRating', type: 'select', label: 'Star Rating', options: ['2 Stars', '3 Stars', '4 Stars', '5 Stars'] },
      { name: 'roomCount', type: 'number', label: 'Number of Rooms' },
      { name: 'meetingRooms', type: 'boolean', label: 'Meeting Rooms' }
    ])
  },
  {
    id: 'bc-2-2',
    name: 'Guesthouses',
    slug: 'guesthouses',
    description: 'Guesthouses and homestays',
    icon: '🏠',
    parentId: 'bc-2',
    sortOrder: 22,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'roomCount', type: 'number', label: 'Number of Rooms' },
      { name: 'mealsAvailable', type: 'boolean', label: 'Meals Available' },
      { name: 'kitchenAccess', type: 'boolean', label: 'Guest Kitchen Access' }
    ])
  },

  // SUB-CATEGORIES (Health & Wellness)
  {
    id: 'bc-6-1',
    name: 'Clinics',
    slug: 'clinics',
    description: 'Medical and dental clinics',
    icon: '🩺',
    parentId: 'bc-6',
    sortOrder: 61,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'specialty', type: 'text', label: 'Medical Specialty' },
      { name: 'operatingHours', type: 'text', label: 'Operating Hours' },
      { name: 'appointmentRequired', type: 'boolean', label: 'Appointment Required' }
    ])
  },
  {
    id: 'bc-6-2',
    name: 'Pharmacies',
    slug: 'pharmacies',
    description: 'Pharmacies and medicine shops',
    icon: '💊',
    parentId: 'bc-6',
    sortOrder: 62,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'nightService', type: 'boolean', label: '24/7 Service' },
      { name: 'prescriptionRequired', type: 'boolean', label: 'Prescription Required for Some Items' }
    ])
  },

  // SUB-CATEGORIES (Education & Training)
  {
    id: 'bc-7-1',
    name: 'Language Schools',
    slug: 'language-schools',
    description: 'Language learning centers',
    icon: '🗣�?,
    parentId: 'bc-7',
    sortOrder: 71,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'languagesTaught', type: 'text', label: 'Languages Taught' },
      { name: 'classSizes', type: 'text', label: 'Class Sizes' },
      { name: 'certificationOffered', type: 'boolean', label: 'Certification Offered' }
    ])
  },
  {
    id: 'bc-7-2',
    name: 'Vocational Training',
    slug: 'vocational-training',
    description: 'Vocational and technical schools',
    icon: '🔧',
    parentId: 'bc-7',
    sortOrder: 72,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'coursesOffered', type: 'text', label: 'Courses Offered' },
      { name: 'internshipAvailable', type: 'boolean', label: 'Internship Available' },
      { name: 'jobPlacement', type: 'boolean', label: 'Job Placement Assistance' }
    ])
  }
];

export const insertBusinessCategoriesSQL = businessCategories.map(cat => `
  INSERT INTO business_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields)
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

export default businessCategories;
