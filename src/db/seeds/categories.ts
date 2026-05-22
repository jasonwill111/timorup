/**
 * Listing Categories Seed Data
 * TimorUp (2026-05-21)
 *
 * 7 parent categories with complete subcategories
 * Global standard classified ads categories
 */

export const listingCategories = [
  // ========================
  // 1. JOBS
  // ========================
  { id: "jobs", name: "Jobs", slug: "jobs", description: "Employment opportunities", icon: "Briefcase", parentId: null, sortOrder: 1, isActive: 1 },
  { id: "jobs-fulltime", name: "Full-time", slug: "jobs-fulltime", description: "Full-time positions", icon: "Clock", parentId: "jobs", sortOrder: 1 },
  { id: "jobs-parttime", name: "Part-time", slug: "jobs-parttime", description: "Part-time positions", icon: "Clock", parentId: "jobs", sortOrder: 2 },
  { id: "jobs-contract", name: "Contract", slug: "jobs-contract", description: "Contract work", icon: "FileText", parentId: "jobs", sortOrder: 3 },
  { id: "jobs-internship", name: "Internship", slug: "jobs-internship", description: "Internship positions", icon: "GraduationCap", parentId: "jobs", sortOrder: 4 },
  { id: "jobs-freelance", name: "Freelance", slug: "jobs-freelance", description: "Freelance work", icon: "Laptop", parentId: "jobs", sortOrder: 5 },
  { id: "jobs-remote", name: "Remote", slug: "jobs-remote", description: "Remote work", icon: "Home", parentId: "jobs", sortOrder: 6 },
  { id: "jobs-seasonal", name: "Seasonal", slug: "jobs-seasonal", description: "Seasonal work", icon: "Calendar", parentId: "jobs", sortOrder: 7 },

  // ========================
  // 2. VEHICLES
  // ========================
  { id: "vehicles", name: "Vehicles", slug: "vehicles", description: "Cars, motorcycles, and other vehicles", icon: "Car", parentId: null, sortOrder: 2, isActive: 1 },
  { id: "vehicles-cars", name: "Cars", slug: "vehicles-cars", description: "Cars for sale", icon: "Car", parentId: "vehicles", sortOrder: 1 },
  { id: "vehicles-motorcycles", name: "Motorcycles", slug: "vehicles-motorcycles", description: "Motorcycles and scooters", icon: "Bike", parentId: "vehicles", sortOrder: 2 },
  { id: "vehicles-bicycles", name: "Bicycles", slug: "vehicles-bicycles", description: "Bicycles", icon: "CircleDot", parentId: "vehicles", sortOrder: 3 },
  { id: "vehicles-boats", name: "Boats", slug: "vehicles-boats", description: "Boats and watercraft", icon: "Anchor", parentId: "vehicles", sortOrder: 4 },
  { id: "vehicles-trucks", name: "Trucks", slug: "vehicles-trucks", description: "Trucks and commercial vehicles", icon: "Truck", parentId: "vehicles", sortOrder: 5 },
  { id: "vehicles-vans", name: "Vans", slug: "vehicles-vans", description: "Vans and minibuses", icon: "Bus", parentId: "vehicles", sortOrder: 6 },
  { id: "vehicles-parts", name: "Auto Parts", slug: "vehicles-parts", description: "Car parts and accessories", icon: "Cog", parentId: "vehicles", sortOrder: 7 },
  { id: "vehicles-other", name: "Other Vehicles", slug: "vehicles-other", description: "Other vehicles", icon: "Circle", parentId: "vehicles", sortOrder: 8 },

  // ========================
  // 3. PROPERTY
  // ========================
  { id: "property", name: "Property", slug: "property", description: "Real estate for sale and rent", icon: "Home", parentId: null, sortOrder: 3, isActive: 1 },
  { id: "property-houses", name: "Houses for Sale", slug: "property-houses-sale", description: "Houses for sale", icon: "Home", parentId: "property", sortOrder: 1 },
  { id: "property-apartments", name: "Apartments for Sale", slug: "property-apartments-sale", description: "Apartments for sale", icon: "Building", parentId: "property", sortOrder: 2 },
  { id: "property-land", name: "Land", slug: "property-land", description: "Land for sale", icon: "Map", parentId: "property", sortOrder: 3 },
  { id: "property-commercial", name: "Commercial", slug: "property-commercial", description: "Commercial property", icon: "Building2", parentId: "property", sortOrder: 4 },
  { id: "property-rooms", name: "Rooms", slug: "property-rooms", description: "Rooms for rent", icon: "Bed", parentId: "property", sortOrder: 5 },
  { id: "property-apartments-rent", name: "Apartments for Rent", slug: "property-apartments-rent", description: "Apartments for rent", icon: "Building", parentId: "property", sortOrder: 6 },
  { id: "property-houses-rent", name: "Houses for Rent", slug: "property-houses-rent", description: "Houses for rent", icon: "Home", parentId: "property", sortOrder: 7 },
  { id: "property-office", name: "Office Space", slug: "property-office", description: "Office space for rent", icon: "Briefcase", parentId: "property", sortOrder: 8 },
  { id: "property-shops", name: "Shops for Rent", slug: "property-shops-rent", description: "Retail space for rent", icon: "Store", parentId: "property", sortOrder: 9 },

  // ========================
  // 4. FOR SALE
  // ========================
  { id: "for-sale", name: "For Sale", slug: "for-sale", description: "Items for sale", icon: "ShoppingBag", parentId: null, sortOrder: 4, isActive: 1 },
  // Electronics
  { id: "sale-electronics", name: "Electronics", slug: "sale-electronics", description: "Electronic devices", icon: "Laptop", parentId: "for-sale", sortOrder: 1 },
  { id: "sale-computers", name: "Computers", slug: "sale-computers", description: "Desktops and laptops", icon: "Monitor", parentId: "for-sale", sortOrder: 2 },
  { id: "sale-phones", name: "Mobile Phones", slug: "sale-phones", description: "Cell phones and tablets", icon: "Smartphone", parentId: "for-sale", sortOrder: 3 },
  { id: "sale-tvs", name: "TVs & Displays", slug: "sale-tvs", description: "Televisions and monitors", icon: "Tv", parentId: "for-sale", sortOrder: 4 },
  { id: "sale-audio", name: "Audio & Headphones", slug: "sale-audio", description: "Audio equipment", icon: "Headphones", parentId: "for-sale", sortOrder: 5 },
  { id: "sale-cameras", name: "Cameras", slug: "sale-cameras", description: "Cameras and photography", icon: "Camera", parentId: "for-sale", sortOrder: 6 },
  { id: "sale-gaming", name: "Gaming", slug: "sale-gaming", description: "Gaming consoles and games", icon: "Gamepad2", parentId: "for-sale", sortOrder: 7 },
  // Home
  { id: "sale-furniture", name: "Furniture", slug: "sale-furniture", description: "Furniture and home items", icon: "Armchair", parentId: "for-sale", sortOrder: 10 },
  // Fashion
  { id: "sale-clothing", name: "Clothing", slug: "sale-clothing", description: "Clothing items", icon: "Shirt", parentId: "for-sale", sortOrder: 20 },
  { id: "sale-shoes", name: "Shoes & Footwear", slug: "sale-shoes", description: "Shoes and footwear", icon: "Footprints", parentId: "for-sale", sortOrder: 21 },
  { id: "sale-bags", name: "Bags & Luggage", slug: "sale-bags", description: "Bags and luggage", icon: "Briefcase", parentId: "for-sale", sortOrder: 22 },
  { id: "sale-jewelry", name: "Jewelry & Watches", slug: "sale-jewelry", description: "Jewelry and watches", icon: "Watch", parentId: "for-sale", sortOrder: 23 },
  // Family
  { id: "sale-baby", name: "Baby & Kids", slug: "sale-baby", description: "Baby and kids items", icon: "Baby", parentId: "for-sale", sortOrder: 30 },
  // Lifestyle
  { id: "sale-sports", name: "Sports Equipment", slug: "sale-sports", description: "Sports gear", icon: "Dumbbell", parentId: "for-sale", sortOrder: 40 },
  { id: "sale-garden", name: "Home & Garden", slug: "sale-garden", description: "Garden and outdoor", icon: "Flower2", parentId: "for-sale", sortOrder: 41 },
  { id: "sale-books", name: "Books & Media", slug: "sale-books", description: "Books, DVDs, music", icon: "BookOpen", parentId: "for-sale", sortOrder: 42 },
  { id: "sale-music", name: "Musical Instruments", slug: "sale-music", description: "Musical instruments", icon: "Music", parentId: "for-sale", sortOrder: 43 },
  { id: "sale-collectibles", name: "Collectibles", slug: "sale-collectibles", description: "Collectibles and antiques", icon: "Gem", parentId: "for-sale", sortOrder: 44 },
  { id: "sale-other", name: "Other Items", slug: "sale-other", description: "Other items for sale", icon: "MoreHorizontal", parentId: "for-sale", sortOrder: 50 },

  // ========================
  // 5. SERVICES
  // ========================
  { id: "services", name: "Services", slug: "services", description: "Professional and local services", icon: "Wrench", parentId: null, sortOrder: 5, isActive: 1 },
  { id: "services-professional", name: "Professional Services", slug: "services-professional", description: "Professional consulting", icon: "Briefcase", parentId: "services", sortOrder: 1 },
  { id: "services-home", name: "Home Services", slug: "services-home", description: "Home repair and maintenance", icon: "Home", parentId: "services", sortOrder: 2 },
  { id: "services-beauty", name: "Beauty & Wellness", slug: "services-beauty", description: "Beauty and wellness services", icon: "Sparkles", parentId: "services", sortOrder: 3 },
  { id: "services-education", name: "Education & Tutoring", slug: "services-education", description: "Teaching and tutoring", icon: "BookOpen", parentId: "services", sortOrder: 4 },
  { id: "services-events", name: "Events & Entertainment", slug: "services-events", description: "Event services", icon: "Calendar", parentId: "services", sortOrder: 5 },
  { id: "services-transport", name: "Transport & Logistics", slug: "services-transport", description: "Moving and delivery", icon: "Truck", parentId: "services", sortOrder: 6 },
  { id: "services-pet", name: "Pet Services", slug: "services-pet", description: "Pet care services", icon: "PawPrint", parentId: "services", sortOrder: 7 },
  { id: "services-it", name: "IT & Tech Support", slug: "services-it", description: "Computer and tech support", icon: "Laptop", parentId: "services", sortOrder: 8 },
  { id: "services-repair", name: "Repair Services", slug: "services-repair", description: "Repair services", icon: "Wrench", parentId: "services", sortOrder: 9 },

  // ========================
  // 6. COMMUNITY
  // ========================
  { id: "community", name: "Community", slug: "community", description: "Community events and connections", icon: "Users", parentId: null, sortOrder: 6, isActive: 1 },
  { id: "community-pets", name: "Pets", slug: "community-pets", description: "Pet listings", icon: "PawPrint", parentId: "community", sortOrder: 1 },
  { id: "community-pets-adoption", name: "Pets for Adoption", slug: "community-pets-adoption", description: "Pet adoption", icon: "Heart", parentId: "community", sortOrder: 2 },
  { id: "community-events", name: "Events", slug: "community-events", description: "Community events", icon: "Calendar", parentId: "community", sortOrder: 3 },
  { id: "community-free", name: "Free Stuff", slug: "community-free", description: "Items for free", icon: "Gift", parentId: "community", sortOrder: 4 },
  { id: "community-wanted", name: "Wanted", slug: "community-wanted", description: "Things wanted", icon: "Search", parentId: "community", sortOrder: 5 },
  { id: "community-lost", name: "Lost & Found", slug: "community-lost", description: "Lost and found items", icon: "Compass", parentId: "community", sortOrder: 6 },
  { id: "community-classes", name: "Classes & Groups", slug: "community-classes", description: "Community groups", icon: "Users", parentId: "community", sortOrder: 7 },
  { id: "community-volunteer", name: "Volunteer", slug: "community-volunteer", description: "Volunteer opportunities", icon: "Heart", parentId: "community", sortOrder: 8 },

  // ========================
  // 7. AGRICULTURE
  // ========================
  { id: "agriculture", name: "Agriculture", slug: "agriculture", description: "Farming and agricultural products", icon: "Wheat", parentId: null, sortOrder: 7, isActive: 1 },
  { id: "agri-equipment", name: "Farm Equipment", slug: "agri-equipment", description: "Agricultural machinery", icon: "Tractor", parentId: "agriculture", sortOrder: 1 },
  { id: "agri-livestock", name: "Livestock", slug: "agri-livestock", description: "Cattle, poultry, etc.", icon: "Cow", parentId: "agriculture", sortOrder: 2 },
  { id: "agri-crops", name: "Crops & Produce", slug: "agri-crops", description: "Fresh produce", icon: "Apple", parentId: "agriculture", sortOrder: 3 },
  { id: "agri-seeds", name: "Seeds & Plants", slug: "agri-seeds", description: "Seeds and seedlings", icon: "Sprout", parentId: "agriculture", sortOrder: 4 },
  { id: "agri-coffee", name: "Coffee & Cocoa", slug: "agri-coffee", description: "Coffee and cocoa products", icon: "Coffee", parentId: "agriculture", sortOrder: 5 },
  { id: "agri-tools", name: "Farm Tools", slug: "agri-tools", description: "Agricultural tools", icon: "Hammer", parentId: "agriculture", sortOrder: 6 },
  { id: "agri-fishing", name: "Fishing", slug: "agri-fishing", description: "Fishing equipment", icon: "Fish", parentId: "agriculture", sortOrder: 7 },
];

export default listingCategories;