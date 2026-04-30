globalThis.process ??= {};
globalThis.process.env ??= {};
const ENTITY_TYPES = [
  { value: "business", label: "Business" },
  { value: "government", label: "Government" },
  { value: "nonprofit", label: "Non-Profit" }
];
const INDUSTRIES = {
  accommodation: {
    label: "Accommodation",
    items: ["Hotels", "Guesthouses", "Hostels", "Resorts", "Apartments", "Homestays"]
  },
  food: {
    label: "Food & Dining",
    items: ["Restaurants", "Cafes", "Bars & Pubs", "Fast Food", "Food Stalls", "Bakeries", "Ice Cream Shops"]
  },
  retail: {
    label: "Retail",
    items: ["Supermarkets", "Convenience Stores", "Clothing Stores", "Electronics", "Furniture", "Books", "Markets"]
  },
  services: {
    label: "Personal Services",
    items: ["Hair Salons", "Spas & Massage", "Laundry & Dry Clean", "Repair Shops", "Cleaning Services", "Photography"]
  },
  health: {
    label: "Health & Medical",
    items: ["Clinics", "Pharmacies", "Dental", "Traditional Medicine", "Optometry", "Veterinary"]
  },
  education: {
    label: "Education",
    items: ["Schools", "Tutoring Centers", "Training Institutes", "Language Schools", "Music Schools", "Driving Schools"]
  },
  transport: {
    label: "Transportation",
    items: ["Taxis & Ride-hailing", "Rent-a-Car", "Bus Companies", "Logistics & Shipping", "Motorcycle Rental", "Fuel Stations"]
  },
  finance: {
    label: "Finance & Banking",
    items: ["Banks", "Microfinance", "Insurance", "Money Transfer", "ATM Services", "Currency Exchange"]
  },
  construction: {
    label: "Construction & Real Estate",
    items: ["Contractors", "Architecture", "Engineering", "Building Materials", "Real Estate Agencies", "Interior Design"]
  },
  professional: {
    label: "Professional Services",
    items: ["Legal Services", "Accounting & Tax", "IT Services", "Consulting", "Printing & Copy", "Office Supplies"]
  },
  entertainment: {
    label: "Entertainment & Sports",
    items: ["Gyms & Fitness", "Cinemas", "Event Venues", "Tour Operators", "Sports Clubs", "Game Centers"]
  },
  agriculture: {
    label: "Agriculture",
    items: ["Farms", "Fisheries", "Livestock", "Agri-Supplies", "Seeds & Plants", "Agricultural Machinery"]
  },
  manufacturing: {
    label: "Manufacturing",
    items: ["Food Processing", "Handicrafts", "Construction Materials", "Textiles", "Metalwork", "Woodwork"]
  },
  utilities: {
    label: "Utilities & Telecom",
    items: ["Electricity", "Water Supply", "Internet Providers", "Mobile Networks", "Solar Energy", "Waste Management"]
  }
};
const SKU_SERVICE_TYPES = [
  { value: "product", label: "Product (Retail)", icon: "📦" },
  { value: "service", label: "Service (Hourly/Daily)", icon: "🔧" },
  { value: "rental", label: "Rental (Time-based)", icon: "🏠" },
  { value: "food", label: "Food & Beverage", icon: "🍽️" },
  { value: "accommodation", label: "Accommodation", icon: "🛏️" },
  { value: "project", label: "Project/Contract", icon: "📋" }
];
export {
  ENTITY_TYPES as E,
  INDUSTRIES as I,
  SKU_SERVICE_TYPES as S
};
