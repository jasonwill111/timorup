/**
 * Product Configuration Module
 *
 * Typed configuration for product/service types, price units, and specification fields.
 * Provides type-safe API with validation and backward compatibility.
 */

// === TYPE DEFINITIONS ===

export type ProductType =
  | 'product'
  | 'service'
  | 'rental'
  | 'food'
  | 'accommodation'
  | 'automotive'
  | 'healthcare'
  | 'education'
  | 'beauty'
  | 'event';

export interface PriceUnit {
  value: string;
  label: string;
  placeholder: string;
}

export interface SpecificationField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'tags' | 'checkbox';
  options?: string[];
  placeholder?: string;
}

// === PRICE UNITS DATA ===

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
] as const satisfies readonly PriceUnit[];

// === SKU SERVICE TYPES DATA ===

export const SKU_SERVICE_TYPES = [
  { value: 'product', label: 'Product (Retail)', icon: '📦' },
  { value: 'service', label: 'General Service', icon: '🔧' },
  { value: 'rental', label: 'Rental', icon: '🏠' },
  { value: 'food', label: 'Food & Dining', icon: '🍽️' },
  { value: 'accommodation', label: 'Accommodation', icon: '🛏️' },
  { value: 'automotive', label: 'Automotive', icon: '🚗' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'beauty', label: 'Beauty & Wellness', icon: '💅' },
  { value: 'event', label: 'Event Service', icon: '🎉' },
] as const;

// === PRIVATE LOOKUP TABLE ===

const PRICE_UNIT_MAP: Record<ProductType, readonly string[]> = {
  product: ['/piece', '/kg', '/liter', '/pack', '/set', '/unit', ''],
  service: ['/hour', '/day', '/session', '/person', '/table', '/group', ''],
  rental: ['/day', '/week', '/month', '/night', '/m²', ''],
  food: ['/person', '/table', '/piece', '/pack', '/set', ''],
  accommodation: ['/night', '/day', '/week', '/month', '/person', ''],
  automotive: ['/day', '/week', '/month', 'fixed', ''],
  healthcare: ['/session', '/hour', '/person', ''],
  education: ['/hour', '/session', '/month', '/course', ''],
  beauty: ['/session', '/hour', '/person', ''],
  event: ['/event', '/day', '/hour', 'fixed', ''],
};

// === SPECIFICATION FIELDS DATA ===

const SPECIFICATION_FIELDS: Record<ProductType, readonly SpecificationField[]> = {
  automotive: [
    { key: 'vehicleType', label: 'Vehicle Type', type: 'select', options: ['sedan', 'suv', 'motorcycle', 'truck', 'van', 'pickup'] },
    { key: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g., Toyota, Honda' },
    { key: 'model', label: 'Model', type: 'text', placeholder: 'e.g., Corolla, Civic' },
    { key: 'year', label: 'Year', type: 'number', placeholder: '2023' },
    { key: 'mileage', label: 'Mileage (km)', type: 'number', placeholder: '50000' },
    { key: 'fuelType', label: 'Fuel Type', type: 'select', options: ['petrol', 'diesel', 'electric', 'hybrid'] },
    { key: 'transmission', label: 'Transmission', type: 'select', options: ['manual', 'automatic'] },
    { key: 'color', label: 'Color', type: 'text', placeholder: 'e.g., White, Black' },
    { key: 'condition', label: 'Condition', type: 'select', options: ['new', 'used', 'certified'] },
    { key: 'doors', label: 'Doors', type: 'number', placeholder: '4' },
    { key: 'seats', label: 'Seats', type: 'number', placeholder: '5' },
  ],
  food: [
    { key: 'cuisine', label: 'Cuisine Type', type: 'tags', placeholder: 'Indonesian, Chinese' },
    { key: 'dietaryOptions', label: 'Dietary Options', type: 'tags', placeholder: 'Halal, Vegetarian' },
    { key: 'mealType', label: 'Meal Type', type: 'select', options: ['breakfast', 'lunch', 'dinner', 'all_day'] },
    { key: 'priceRange', label: 'Price Range', type: 'select', options: ['$', '$$', '$$$', '$$$$'] },
    { key: 'parking', label: 'Parking Available', type: 'checkbox' },
    { key: 'delivery', label: 'Delivery Available', type: 'checkbox' },
    { key: 'takeaway', label: 'Takeaway Available', type: 'checkbox' },
    { key: 'reservation', label: 'Reservation Required', type: 'checkbox' },
  ],
  accommodation: [
    { key: 'roomType', label: 'Room Type', type: 'select', options: ['single', 'double', 'twin', 'suite', 'dorm', 'villa'] },
    { key: 'maxGuests', label: 'Max Guests', type: 'number', placeholder: '2' },
    { key: 'bedType', label: 'Bed Type', type: 'select', options: ['single', 'double', 'queen', 'king'] },
    { key: 'numBeds', label: 'Number of Beds', type: 'number', placeholder: '1' },
    { key: 'checkInTime', label: 'Check-in Time', type: 'text', placeholder: '14:00' },
    { key: 'checkOutTime', label: 'Check-out Time', type: 'text', placeholder: '12:00' },
    { key: 'roomSize', label: 'Room Size (sqm)', type: 'number', placeholder: '25' },
    { key: 'amenities', label: 'Amenities', type: 'tags', placeholder: 'wifi, ac, pool, parking' },
  ],
  healthcare: [
    { key: 'specialization', label: 'Specialization', type: 'text', placeholder: 'e.g., General, Dental, Eye' },
    { key: 'consultationType', label: 'Consultation Type', type: 'select', options: ['in_person', 'telemedicine'] },
    { key: 'consultationDuration', label: 'Duration (minutes)', type: 'number', placeholder: '30' },
    { key: 'emergencyService', label: '24/7 Emergency', type: 'checkbox' },
    { key: 'homeVisit', label: 'Home Visit Available', type: 'checkbox' },
  ],
  education: [
    { key: 'courseType', label: 'Course Type', type: 'select', options: ['language', 'vocational', 'tutoring', 'training', 'workshop'] },
    { key: 'subject', label: 'Subject', type: 'text', placeholder: 'e.g., English, Computer' },
    { key: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g., 2 hours, 3 months' },
    { key: 'schedule', label: 'Schedule', type: 'select', options: ['weekday', 'weekend', 'evening', 'flexible'] },
    { key: 'level', label: 'Level', type: 'select', options: ['beginner', 'intermediate', 'advanced', 'all_levels'] },
    { key: 'certificate', label: 'Certificate Issued', type: 'checkbox' },
    { key: 'classSize', label: 'Max Class Size', type: 'number', placeholder: '20' },
    { key: 'language', label: 'Language', type: 'text', placeholder: 'English' },
  ],
  beauty: [
    { key: 'serviceCategory', label: 'Service Category', type: 'select', options: ['hair', 'nail', 'spa', 'massage', 'makeup', 'tattoo'] },
    { key: 'genderPreference', label: 'Gender', type: 'select', options: ['male', 'female', 'unisex'] },
    { key: 'duration', label: 'Duration (minutes)', type: 'number', placeholder: '60' },
    { key: 'advanceBooking', label: 'Advance Booking Required', type: 'checkbox' },
    { key: 'homeService', label: 'Home Service Available', type: 'checkbox' },
  ],
  event: [
    { key: 'eventType', label: 'Event Type', type: 'select', options: ['photography', 'catering', 'decoration', 'entertainment', 'transport'] },
    { key: 'coverage', label: 'Coverage Area', type: 'text', placeholder: 'e.g., East Timor, Dili only' },
    { key: 'minBooking', label: 'Minimum Booking', type: 'text', placeholder: 'e.g., 2 hours, 1 day' },
    { key: 'teamIncluded', label: 'Team Size', type: 'number', placeholder: '2' },
    { key: 'equipment', label: 'Equipment Included', type: 'tags', placeholder: 'Camera, Lighting, Tripod' },
  ],
  service: [
    { key: 'serviceCategory', label: 'Service Category', type: 'select', options: ['repair', 'cleaning', 'delivery', 'moving', 'installation'] },
    { key: 'coverage', label: 'Service Area', type: 'text', placeholder: 'e.g., Dili only' },
    { key: 'responseTime', label: 'Response Time', type: 'text', placeholder: 'e.g., Same day, 24 hours' },
    { key: 'warranty', label: 'Warranty', type: 'text', placeholder: 'e.g., 1 month' },
    { key: 'insured', label: 'Insured', type: 'checkbox' },
  ],
  rental: [
    { key: 'rentalType', label: 'Rental Type', type: 'select', options: ['equipment', 'vehicle', 'property', 'furniture'] },
    { key: 'minRental', label: 'Minimum Rental', type: 'text', placeholder: 'e.g., 1 day, 1 week' },
    { key: 'maxRental', label: 'Maximum Rental', type: 'text', placeholder: 'e.g., 1 month' },
    { key: 'deposit', label: 'Deposit Required', type: 'text', placeholder: 'e.g., $50' },
    { key: 'delivery', label: 'Delivery Available', type: 'checkbox' },
    { key: 'deliveryFee', label: 'Delivery Fee', type: 'text', placeholder: 'e.g., $10' },
  ],
  // Product type has no special specification fields
  product: [],
} as const;

// === PUBLIC API ===

/**
 * Type-safe product configuration API
 */
export const productConfig = {
  /**
   * Check if a string is a valid ProductType
   * @param type - String to validate
   * @returns true if type is a valid ProductType
   */
  isValid(type: string): type is ProductType {
    return type in PRICE_UNIT_MAP;
  },

  /**
   * Get price units for a product type
   * @param type - Product type (validated via isValid)
   * @returns Array of PriceUnit objects, empty array if invalid
   */
  getPriceUnits(type: string): PriceUnit[] {
    if (!this.isValid(type)) {
      return [];
    }
    const allowedValues = PRICE_UNIT_MAP[type as ProductType];
    return PRICE_UNITS.filter(u => allowedValues.includes(u.value));
  },

  /**
   * Get specification fields for a product type
   * @param type - Product type (validated via isValid)
   * @returns Array of SpecificationField objects, empty array if invalid
   */
  getSpecificationFields(type: string): SpecificationField[] {
    if (!this.isValid(type)) {
      return [];
    }
    return [...(SPECIFICATION_FIELDS[type as ProductType] ?? [])];
  },

  /**
   * Get all valid product types
   * @returns Array of all ProductType values
   */
  allTypes(): ProductType[] {
    return Object.keys(PRICE_UNIT_MAP) as ProductType[];
  },
} as const;

// === BACKWARD COMPATIBILITY ===

/**
 * @deprecated Use `productConfig.getPriceUnits()` instead
 * Returns price units for a service type
 */
export function getPriceUnitsForServiceType(productType: string): PriceUnit[] {
  return productConfig.getPriceUnits(productType);
}

// Re-export types for convenience
export type { ProductConfig } from './constants';