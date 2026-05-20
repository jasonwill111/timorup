// Entity types for listings
export const ENTITY_TYPES = [
  { value: 'business', label: 'Business' },
  { value: 'non-profit', label: 'Non-Profit' },
] as const;

// Organization sub-types for nonprofits
export const NONPROFIT_TYPES = [
  { value: 'government', label: 'Government Agency' },
  { value: 'ngo', label: 'NGO' },
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

// Re-export product config from product-config module for backward compatibility
export {
  PRICE_UNITS,
  SKU_SERVICE_TYPES,
  productConfig,
  getPriceUnitsForServiceType,
} from './product-config';

export type { ProductType, PriceUnit, SpecificationField } from './product-config';