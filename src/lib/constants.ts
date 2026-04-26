// Entity types for listings
export const ENTITY_TYPES = [
  { value: 'business', label: 'Business' },
  { value: 'government', label: 'Government' },
  { value: 'nonprofit', label: 'Non-Profit' },
] as const;

// Industry classifications for businesses
export const INDUSTRIES = {
  accommodation: {
    label: 'Accommodation',
    items: ['Hotels', 'Guesthouses', 'Hostels', 'Resorts', 'Apartments', 'Homestays'],
  },
  food: {
    label: 'Food & Dining',
    items: ['Restaurants', 'Cafes', 'Bars & Pubs', 'Fast Food', 'Food Stalls', 'Bakeries', 'Ice Cream Shops'],
  },
  retail: {
    label: 'Retail',
    items: ['Supermarkets', 'Convenience Stores', 'Clothing Stores', 'Electronics', 'Furniture', 'Books', 'Markets'],
  },
  services: {
    label: 'Personal Services',
    items: ['Hair Salons', 'Spas & Massage', 'Laundry & Dry Clean', 'Repair Shops', 'Cleaning Services', 'Photography'],
  },
  health: {
    label: 'Health & Medical',
    items: ['Clinics', 'Pharmacies', 'Dental', 'Traditional Medicine', 'Optometry', 'Veterinary'],
  },
  education: {
    label: 'Education',
    items: ['Schools', 'Tutoring Centers', 'Training Institutes', 'Language Schools', 'Music Schools', 'Driving Schools'],
  },
  transport: {
    label: 'Transportation',
    items: ['Taxis & Ride-hailing', 'Rent-a-Car', 'Bus Companies', 'Logistics & Shipping', 'Motorcycle Rental', 'Fuel Stations'],
  },
  finance: {
    label: 'Finance & Banking',
    items: ['Banks', 'Microfinance', 'Insurance', 'Money Transfer', 'ATM Services', 'Currency Exchange'],
  },
  construction: {
    label: 'Construction & Real Estate',
    items: ['Contractors', 'Architecture', 'Engineering', 'Building Materials', 'Real Estate Agencies', 'Interior Design'],
  },
  professional: {
    label: 'Professional Services',
    items: ['Legal Services', 'Accounting & Tax', 'IT Services', 'Consulting', 'Printing & Copy', 'Office Supplies'],
  },
  entertainment: {
    label: 'Entertainment & Sports',
    items: ['Gyms & Fitness', 'Cinemas', 'Event Venues', 'Tour Operators', 'Sports Clubs', 'Game Centers'],
  },
  agriculture: {
    label: 'Agriculture',
    items: ['Farms', 'Fisheries', 'Livestock', 'Agri-Supplies', 'Seeds & Plants', 'Agricultural Machinery'],
  },
  manufacturing: {
    label: 'Manufacturing',
    items: ['Food Processing', 'Handicrafts', 'Construction Materials', 'Textiles', 'Metalwork', 'Woodwork'],
  },
  utilities: {
    label: 'Utilities & Telecom',
    items: ['Electricity', 'Water Supply', 'Internet Providers', 'Mobile Networks', 'Solar Energy', 'Waste Management'],
  },
} as const;

// Price units for SKUs
export const PRICE_UNITS = [
  // No unit
  { value: '', label: 'No unit', placeholder: 'Ask for price' },
  // Time-based
  { value: '/hour', label: 'Per hour', placeholder: '0.00' },
  { value: '/day', label: 'Per day', placeholder: '0.00' },
  { value: '/week', label: 'Per week', placeholder: '0.00' },
  { value: '/month', label: 'Per month', placeholder: '0.00' },
  // Count-based
  { value: '/session', label: 'Per session', placeholder: '0.00' },
  { value: '/unit', label: 'Per unit', placeholder: '0.00' },
  { value: '/piece', label: 'Per piece', placeholder: '0.00' },
  { value: '/kg', label: 'Per kg', placeholder: '0.00' },
  { value: '/liter', label: 'Per liter', placeholder: '0.00' },
  { value: '/pack', label: 'Per pack', placeholder: '0.00' },
  { value: '/set', label: 'Per set', placeholder: '0.00' },
  // Person-based
  { value: '/person', label: 'Per person', placeholder: '0.00' },
  { value: '/table', label: 'Per table', placeholder: '0.00' },
  { value: '/group', label: 'Per group', placeholder: '0.00' },
  // Rental
  { value: '/night', label: 'Per night', placeholder: '0.00' },
  { value: '/m²', label: 'Per m²', placeholder: '0.00' },
  // Fixed
  { value: 'fixed', label: 'Fixed price', placeholder: '0.00' },
  // Events
  { value: '/event', label: 'Per event', placeholder: '0.00' },
] as const;

// SKU service types (affects available price units)
export const SKU_SERVICE_TYPES = [
  { value: 'product', label: 'Product (Retail)', icon: '📦' },
  { value: 'service', label: 'Service (Hourly/Daily)', icon: '🔧' },
  { value: 'rental', label: 'Rental (Time-based)', icon: '🏠' },
  { value: 'food', label: 'Food & Beverage', icon: '🍽️' },
  { value: 'accommodation', label: 'Accommodation', icon: '🛏️' },
  { value: 'project', label: 'Project/Contract', icon: '📋' },
] as const;

// Get relevant price units for a service type
export function getPriceUnitsForServiceType(serviceType: string): typeof PRICE_UNITS {
  const unitMap: Record<string, string[]> = {
    product: ['/piece', '/kg', '/liter', '/pack', '/set', '/unit', ''],
    service: ['/hour', '/day', '/session', '/person', '/table', '/group', ''],
    rental: ['/day', '/week', '/month', '/night', '/m²', ''],
    food: ['/person', '/table', '/piece', '/pack', '/set', ''],
    accommodation: ['/night', '/day', '/week', '/month', '/person', ''],
    project: ['/unit', '/m²', '/session', 'fixed', ''],
  };
  const allowed = unitMap[serviceType] || [];
  return PRICE_UNITS.filter(u => allowed.includes(u.value));
}
