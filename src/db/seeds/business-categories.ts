/**
 * Business Categories Seed Data
 * TimorUp (2026-05-21)
 *
 * 15 parent categories, each with 2-6 subcategories
 * Total: ~56 categories
 *
 * Structure: 2-level hierarchy
 * - parentId: null = top-level parent
 * - parentId: 'xxx' = child of parent
 */

export const businessCategories = [
  // 1. Food & Dining
  { id: "food-dining", name: "Food & Dining", slug: "food-dining", description: "Restaurants, cafés, and food services", icon: "UtensilsCrossed", parentId: null, sortOrder: 1, isActive: 1 },
  { id: "restaurants", name: "Restaurants", slug: "restaurants", description: "Full-service restaurants", icon: "Utensils", parentId: "food-dining", sortOrder: 1 },
  { id: "cafes", name: "Cafés", slug: "cafes", description: "Coffee shops and cafés", icon: "Coffee", parentId: "food-dining", sortOrder: 2 },
  { id: "fast-food", name: "Fast Food", slug: "fast-food", description: "Fast food chains and outlets", icon: "Burger", parentId: "food-dining", sortOrder: 3 },
  { id: "food-stalls", name: "Food Stalls", slug: "food-stalls", description: "Street food and local markets", icon: "Store", parentId: "food-dining", sortOrder: 4 },
  { id: "timorese-cuisine", name: "Timorese Cuisine", slug: "timorese-cuisine", description: "Traditional Timor-Leste cuisine", icon: "ChefHat", parentId: "food-dining", sortOrder: 5 },

  // 2. Accommodation
  { id: "accommodation", name: "Accommodation", slug: "accommodation", description: "Hotels, guesthouses, and lodging", icon: "Bed", parentId: null, sortOrder: 2, isActive: 1 },
  { id: "hotels", name: "Hotels", slug: "hotels", description: "Hotels and resorts", icon: "Building", parentId: "accommodation", sortOrder: 1 },
  { id: "guesthouses", name: "Guesthouses", slug: "guesthouses", description: "Guesthouses and B&Bs", icon: "Home", parentId: "accommodation", sortOrder: 2 },
  { id: "hostels", name: "Hostels", slug: "hostels", description: "Budget hostels", icon: "Backpack", parentId: "accommodation", sortOrder: 3 },
  { id: "homestays", name: "Homestays", slug: "homestays", description: "Home-stay accommodations", icon: "Heart", parentId: "accommodation", sortOrder: 4 },

  // 3. Retail & Shops
  { id: "retail-shops", name: "Retail & Shops", slug: "retail-shops", description: "Retail stores and shops", icon: "ShoppingBag", parentId: null, sortOrder: 3, isActive: 1 },
  { id: "supermarkets", name: "Supermarkets", slug: "supermarkets", description: "Large grocery stores", icon: "ShoppingCart", parentId: "retail-shops", sortOrder: 1 },
  { id: "markets", name: "Markets", slug: "markets", description: "Traditional markets", icon: "Store", parentId: "retail-shops", sortOrder: 2 },
  { id: "convenience", name: "Convenience Stores", slug: "convenience-stores", description: "Convenience and minimarts", icon: "CreditCard", parentId: "retail-shops", sortOrder: 3 },
  { id: "specialty-shops", name: "Specialty Shops", slug: "specialty-shops", description: "Specialized retail", icon: "Sparkles", parentId: "retail-shops", sortOrder: 4 },

  // 4. Transportation
  { id: "transportation", name: "Transportation", slug: "transportation", description: "Transport and travel services", icon: "Car", parentId: null, sortOrder: 4, isActive: 1 },
  { id: "taxis", name: "Taxis", slug: "taxis", description: "Taxi services", icon: "Taxi", parentId: "transportation", sortOrder: 1 },
  { id: "car-rentals", name: "Car Rentals", slug: "car-rentals", description: "Vehicle rental services", icon: "Key", parentId: "transportation", sortOrder: 2 },
  { id: "tours", name: "Tours & Travel", slug: "tours-travel", description: "Tour operators and travel agencies", icon: "Map", parentId: "transportation", sortOrder: 3 },
  { id: "bus-services", name: "Bus Services", slug: "bus-services", description: "Public and private bus services", icon: "Bus", parentId: "transportation", sortOrder: 4 },

  // 5. Professional Services
  { id: "professional-services", name: "Professional Services", slug: "professional-services", description: "Professional and business services", icon: "Briefcase", parentId: null, sortOrder: 5, isActive: 1 },
  { id: "banks", name: "Banks & Finance", slug: "banks-finance", description: "Banks and financial institutions", icon: "Landmark", parentId: "professional-services", sortOrder: 1 },
  { id: "legal-services", name: "Legal Services", slug: "legal-services", description: "Lawyers and legal firms", icon: "Scale", parentId: "professional-services", sortOrder: 2 },
  { id: "accounting", name: "Accounting", slug: "accounting", description: "Accounting and bookkeeping", icon: "Calculator", parentId: "professional-services", sortOrder: 3 },
  { id: "insurance", name: "Insurance", slug: "insurance", description: "Insurance providers", icon: "Shield", parentId: "professional-services", sortOrder: 4 },
  { id: "consulting", name: "Consulting", slug: "consulting", description: "Business consulting", icon: "MessageSquare", parentId: "professional-services", sortOrder: 5 },

  // 6. Health & Wellness
  { id: "health-wellness", name: "Health & Wellness", slug: "health-wellness", description: "Healthcare and wellness services", icon: "Heart", parentId: null, sortOrder: 6, isActive: 1 },
  { id: "clinics", name: "Clinics", slug: "clinics", description: "Medical clinics", icon: "Stethoscope", parentId: "health-wellness", sortOrder: 1 },
  { id: "pharmacies", name: "Pharmacies", slug: "pharmacies", description: "Pharmacies and drugstores", icon: "Pill", parentId: "health-wellness", sortOrder: 2 },
  { id: "gyms", name: "Gyms & Fitness", slug: "gyms-fitness", description: "Fitness centers", icon: "Dumbbell", parentId: "health-wellness", sortOrder: 3 },
  { id: "spas", name: "Spas & Massage", slug: "spas-massage", description: "Spa and massage services", icon: "Sparkles", parentId: "health-wellness", sortOrder: 4 },
  { id: "optical", name: "Optical & Eyewear", slug: "optical-eyewear", description: "Opticians and eyewear", icon: "Glasses", parentId: "health-wellness", sortOrder: 5 },
  { id: "dental", name: "Dental Services", slug: "dental-services", description: "Dental clinics", icon: "Smile", parentId: "health-wellness", sortOrder: 6 },

  // 7. Education
  { id: "education", name: "Education", slug: "education", description: "Schools and educational services", icon: "GraduationCap", parentId: null, sortOrder: 7, isActive: 1 },
  { id: "schools", name: "Schools", slug: "schools", description: "Primary and secondary schools", icon: "Building2", parentId: "education", sortOrder: 1 },
  { id: "language-centers", name: "Language Centers", slug: "language-centers", description: "Language learning centers", icon: "Languages", parentId: "education", sortOrder: 2 },
  { id: "training", name: "Training Centers", slug: "training-centers", description: "Vocational training", icon: "Award", parentId: "education", sortOrder: 3 },
  { id: "tutoring", name: "Tutoring", slug: "tutoring", description: "Private tutoring services", icon: "BookOpen", parentId: "education", sortOrder: 4 },

  // 8. Construction & Trades
  { id: "construction-trades", name: "Construction & Trades", slug: "construction-trades", description: "Construction and home services", icon: "HardHat", parentId: null, sortOrder: 8, isActive: 1 },
  { id: "contractors", name: "Contractors", slug: "contractors", description: "Building contractors", icon: "Hammer", parentId: "construction-trades", sortOrder: 1 },
  { id: "electricians", name: "Electricians", slug: "electricians", description: "Electrical services", icon: "Zap", parentId: "construction-trades", sortOrder: 2 },
  { id: "plumbers", name: "Plumbers", slug: "plumbers", description: "Plumbing services", icon: "Wrench", parentId: "construction-trades", sortOrder: 3 },
  { id: "painters", name: "Painters", slug: "painters", description: "Painting services", icon: "Paintbrush", parentId: "construction-trades", sortOrder: 4 },
  { id: "furniture", name: "Furniture Makers", slug: "furniture-makers", description: "Custom furniture", icon: "Armchair", parentId: "construction-trades", sortOrder: 5 },

  // 9. Entertainment
  { id: "entertainment", name: "Entertainment", slug: "entertainment", description: "Entertainment and leisure", icon: "Ticket", parentId: null, sortOrder: 9, isActive: 1 },
  { id: "bars-clubs", name: "Bars & Clubs", slug: "bars-clubs", description: "Bars and nightclubs", icon: "Wine", parentId: "entertainment", sortOrder: 1 },
  { id: "cinemas", name: "Cinemas", slug: "cinemas", description: "Movie theaters", icon: "Film", parentId: "entertainment", sortOrder: 2 },
  { id: "sports", name: "Sports & Recreation", slug: "sports-recreation", description: "Sports venues and activities", icon: "Trophy", parentId: "entertainment", sortOrder: 3 },
  { id: "events", name: "Event Venues", slug: "event-venues", description: "Event halls and venues", icon: "Calendar", parentId: "entertainment", sortOrder: 4 },

  // 10. Agriculture
  { id: "agriculture", name: "Agriculture", slug: "agriculture", description: "Farming and agricultural services", icon: "Wheat", parentId: null, sortOrder: 10, isActive: 1 },
  { id: "farms", name: "Farms", slug: "farms", description: "Farms and plantations", icon: "Sprout", parentId: "agriculture", sortOrder: 1 },
  { id: "agri-markets", name: "Agricultural Markets", slug: "agri-markets", description: "Farm produce markets", icon: "Apple", parentId: "agriculture", sortOrder: 2 },
  { id: "agri-supplies", name: "Agri Supplies", slug: "agri-supplies", description: "Seeds, fertilizers, tools", icon: "Package", parentId: "agriculture", sortOrder: 3 },
  { id: "livestock", name: "Livestock", slug: "livestock", description: "Livestock sales", icon: "Rabbit", parentId: "agriculture", sortOrder: 4 },

  // 11. Technology & IT
  { id: "technology-it", name: "Technology & IT", slug: "technology-it", description: "Technology and IT services", icon: "Laptop", parentId: null, sortOrder: 11, isActive: 1 },
  { id: "phone-shops", name: "Phone Shops", slug: "phone-shops", description: "Mobile phone retailers", icon: "Smartphone", parentId: "technology-it", sortOrder: 1 },
  { id: "internet-cafes", name: "Internet Cafés", slug: "internet-cafes", description: "Internet and gaming cafés", icon: "Monitor", parentId: "technology-it", sortOrder: 2 },
  { id: "repair", name: "Repair Services", slug: "repair-services", description: "Electronics repair", icon: "Wrench", parentId: "technology-it", sortOrder: 3 },
  { id: "software", name: "Software & IT", slug: "software-it", description: "Software and IT services", icon: "Code", parentId: "technology-it", sortOrder: 4 },

  // 12. Beauty & Personal Care
  { id: "beauty-personal-care", name: "Beauty & Personal Care", slug: "beauty-personal-care", description: "Salons and personal care", icon: "Scissors", parentId: null, sortOrder: 12, isActive: 1 },
  { id: "salons", name: "Hair Salons", slug: "hair-salons", description: "Hair salons and barbershops", icon: "Scissors", parentId: "beauty-personal-care", sortOrder: 1 },
  { id: "beauty-parlors", name: "Beauty Parlors", slug: "beauty-parlors", description: "Beauty and nail services", icon: "Sparkles", parentId: "beauty-personal-care", sortOrder: 2 },
  { id: "laundries", name: "Laundries", slug: "laundries", description: "Laundry and dry cleaning", icon: "Shirt", parentId: "beauty-personal-care", sortOrder: 3 },

  // 13. Automotive
  { id: "automotive", name: "Automotive", slug: "automotive", description: "Vehicle sales and services", icon: "Car", parentId: null, sortOrder: 13, isActive: 1 },
  { id: "gas-stations", name: "Gas Stations", slug: "gas-stations", description: "Petrol stations", icon: "Fuel", parentId: "automotive", sortOrder: 1 },
  { id: "repair-shops", name: "Repair Shops", slug: "repair-shops", description: "Vehicle repair", icon: "Wrench", parentId: "automotive", sortOrder: 2 },
  { id: "auto-parts", name: "Auto Parts", slug: "auto-parts", description: "Car parts and accessories", icon: "Cog", parentId: "automotive", sortOrder: 3 },
  { id: "car-dealers", name: "Car Dealers", slug: "car-dealers", description: "Vehicle sales", icon: "Car", parentId: "automotive", sortOrder: 4 },

  // 14. Crafts & Souvenirs
  { id: "crafts-souvenirs", name: "Crafts & Souvenirs", slug: "crafts-souvenirs", description: "Local crafts and souvenirs", icon: "Gift", parentId: null, sortOrder: 14, isActive: 1 },
  { id: "local-crafts", name: "Local Crafts", slug: "local-crafts", description: "Traditional Timorese crafts", icon: "Palette", parentId: "crafts-souvenirs", sortOrder: 1 },
  { id: "gift-shops", name: "Gift Shops", slug: "gift-shops", description: "Gift and souvenir shops", icon: "Gift", parentId: "crafts-souvenirs", sortOrder: 2 },
  { id: "jewelry", name: "Jewelry", slug: "jewelry", description: "Jewelry shops", icon: "Gem", parentId: "crafts-souvenirs", sortOrder: 3 },

  // 15. Financial & Communication
  { id: "financial-communication", name: "Financial & Communication", slug: "financial-communication", description: "Finance and communications", icon: "Phone", parentId: null, sortOrder: 15, isActive: 1 },
  { id: "money-transfer", name: "Money Transfer", slug: "money-transfer", description: "Remittance services", icon: "Send", parentId: "financial-communication", sortOrder: 1 },
  { id: "telecom", name: "Telecom Services", slug: "telecom-services", description: "Phone and internet providers", icon: "Signal", parentId: "financial-communication", sortOrder: 2 },
  { id: "print-copy", name: "Printing & Copy", slug: "printing-copy", description: "Printing and copying services", icon: "Printer", parentId: "financial-communication", sortOrder: 3 },
  { id: "photos", name: "Photography", slug: "photography", description: "Photo studios", icon: "Camera", parentId: "financial-communication", sortOrder: 4 },
];

export default businessCategories;