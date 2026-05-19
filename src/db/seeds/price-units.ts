/**
 * Price Units Seed Data
 * TimorLink - Pre-defined price units for various industries
 *
 * Structure:
 * - category: Industry category
 * - units: Array of common units with display name
 */

export const priceUnits = [
  // ========================
  // Retail & E-commerce
  // ========================
  {
    category: 'retail',
    label: 'Retail',
    units: [
      { value: 'per piece', label: 'per piece' },
      { value: 'per pack', label: 'per pack' },
      { value: 'per box', label: 'per box' },
      { value: 'per dozen', label: 'per dozen' },
      { value: 'per set', label: 'per set' },
      { value: 'per bundle', label: 'per bundle' },
    ]
  },

  // ========================
  // Food & Beverages
  // ========================
  {
    category: 'food',
    label: 'Food & Beverages',
    units: [
      { value: 'per kg', label: 'per kg' },
      { value: 'per gram', label: 'per gram' },
      { value: 'per liter', label: 'per liter' },
      { value: 'per ml', label: 'per ml' },
      { value: 'per portion', label: 'per portion' },
      { value: 'per bottle', label: 'per bottle' },
      { value: 'per can', label: 'per can' },
      { value: 'per pack', label: 'per pack' },
      { value: 'per plate', label: 'per plate' },
      { value: 'per cup', label: 'per cup' },
    ]
  },

  // ========================
  // Services (General)
  // ========================
  {
    category: 'services',
    label: 'Services',
    units: [
      { value: 'per hour', label: 'per hour' },
      { value: 'per session', label: 'per session' },
      { value: 'per day', label: 'per day' },
      { value: 'per project', label: 'per project' },
      { value: 'per job', label: 'per job' },
      { value: 'per visit', label: 'per visit' },
      { value: 'per consultation', label: 'per consultation' },
    ]
  },

  // ========================
  // Repair & Maintenance
  // ========================
  {
    category: 'repair',
    label: 'Repair & Maintenance',
    units: [
      { value: 'per hour', label: 'per hour' },
      { value: 'per job', label: 'per job' },
      { value: 'per diagnostic', label: 'per diagnostic' },
      { value: 'per repair', label: 'per repair' },
      { value: 'fixed price', label: 'fixed price' },
      { value: 'starting from', label: 'starting from' },
    ]
  },

  // ========================
  // Beauty & Wellness
  // ========================
  {
    category: 'beauty',
    label: 'Beauty & Wellness',
    units: [
      { value: 'per session', label: 'per session' },
      { value: 'per hour', label: 'per hour' },
      { value: 'per treatment', label: 'per treatment' },
      { value: 'per course', label: 'per course (e.g., 6 sessions)' },
      { value: 'per person', label: 'per person' },
    ]
  },

  // ========================
  // Cleaning Services
  // ========================
  {
    category: 'cleaning',
    label: 'Cleaning Services',
    units: [
      { value: 'per hour', label: 'per hour' },
      { value: 'per session', label: 'per session' },
      { value: 'per job', label: 'per job' },
      { value: 'per sqm', label: 'per sq meter' },
      { value: 'fixed price', label: 'fixed price' },
    ]
  },

  // ========================
  // Education & Training
  // ========================
  {
    category: 'education',
    label: 'Education & Training',
    units: [
      { value: 'per hour', label: 'per hour' },
      { value: 'per lesson', label: 'per lesson' },
      { value: 'per session', label: 'per session' },
      { value: 'per course', label: 'per course' },
      { value: 'per module', label: 'per module' },
      { value: 'per month', label: 'per month' },
      { value: 'per semester', label: 'per semester' },
      { value: 'per enrollment', label: 'per enrollment' },
    ]
  },

  // ========================
  // Hospitality & Accommodation
  // ========================
  {
    category: 'hospitality',
    label: 'Hospitality & Accommodation',
    units: [
      { value: 'per night', label: 'per night' },
      { value: 'per room', label: 'per room' },
      { value: 'per person', label: 'per person' },
      { value: 'per person/night', label: 'per person/night' },
      { value: 'per week', label: 'per week' },
      { value: 'per month', label: 'per month' },
      { value: 'per event', label: 'per event' },
    ]
  },

  // ========================
  // Rentals
  // ========================
  {
    category: 'rental',
    label: 'Rentals',
    units: [
      { value: 'per day', label: 'per day' },
      { value: 'per week', label: 'per week' },
      { value: 'per month', label: 'per month' },
      { value: 'per hour', label: 'per hour' },
      { value: 'per trip', label: 'per trip' },
      { value: 'per km', label: 'per km' },
    ]
  },

  // ========================
  // Tickets & Events
  // ========================
  {
    category: 'tickets',
    label: 'Tickets & Events',
    units: [
      { value: 'per ticket', label: 'per ticket' },
      { value: 'per seat', label: 'per seat' },
      { value: 'per person', label: 'per person' },
      { value: 'per group', label: 'per group' },
      { value: 'per family', label: 'per family' },
      { value: 'per child', label: 'per child' },
    ]
  },

  // ========================
  // Professional Services
  // ========================
  {
    category: 'professional',
    label: 'Professional Services',
    units: [
      { value: 'per hour', label: 'per hour' },
      { value: 'per day', label: 'per day' },
      { value: 'per project', label: 'per project' },
      { value: 'per consultation', label: 'per consultation' },
      { value: 'per session', label: 'per session' },
      { value: 'retainer/month', label: 'retainer/month' },
      { value: 'fixed price', label: 'fixed price' },
    ]
  },

  // ========================
  // Consulting & Advisory
  // ========================
  {
    category: 'consulting',
    label: 'Consulting & Advisory',
    units: [
      { value: 'per hour', label: 'per hour' },
      { value: 'per day', label: 'per day' },
      { value: 'per session', label: 'per session' },
      { value: 'per project', label: 'per project' },
      { value: 'per report', label: 'per report' },
      { value: 'per month', label: 'per month' },
      { value: 'retainer/month', label: 'retainer/month' },
    ]
  },

  // ========================
  // Subscriptions
  // ========================
  {
    category: 'subscription',
    label: 'Subscriptions',
    units: [
      { value: 'per month', label: 'per month' },
      { value: 'per year', label: 'per year' },
      { value: 'per quarter', label: 'per quarter' },
      { value: 'per credit', label: 'per credit' },
      { value: 'per user/month', label: 'per user/month' },
      { value: 'lifetime', label: 'lifetime' },
    ]
  },

  // ========================
  // Digital & Virtual
  // ========================
  {
    category: 'digital',
    label: 'Digital & Virtual',
    units: [
      { value: 'per download', label: 'per download' },
      { value: 'per license', label: 'per license' },
      { value: 'per subscription', label: 'per subscription' },
      { value: 'per access', label: 'per access' },
      { value: 'per month', label: 'per month' },
      { value: 'per year', label: 'per year' },
    ]
  },

  // ========================
  // Construction & Trades
  // ========================
  {
    category: 'construction',
    label: 'Construction & Trades',
    units: [
      { value: 'per sqm', label: 'per sq meter' },
      { value: 'per hour', label: 'per hour' },
      { value: 'per day', label: 'per day' },
      { value: 'per project', label: 'per project' },
      { value: 'per unit', label: 'per unit' },
      { value: 'fixed price', label: 'fixed price' },
      { value: 'estimate', label: 'estimate' },
    ]
  },

  // ========================
  // Transport & Logistics
  // ========================
  {
    category: 'transport',
    label: 'Transport & Logistics',
    units: [
      { value: 'per km', label: 'per km' },
      { value: 'per trip', label: 'per trip' },
      { value: 'per hour', label: 'per hour' },
      { value: 'per day', label: 'per day' },
      { value: 'per person', label: 'per person' },
      { value: 'per kg', label: 'per kg' },
      { value: 'per shipment', label: 'per shipment' },
    ]
  },

  // ========================
  // Healthcare
  // ========================
  {
    category: 'healthcare',
    label: 'Healthcare',
    units: [
      { value: 'per session', label: 'per session' },
      { value: 'per consultation', label: 'per consultation' },
      { value: 'per treatment', label: 'per treatment' },
      { value: 'per hour', label: 'per hour' },
      { value: 'per procedure', label: 'per procedure' },
      { value: 'per package', label: 'per package' },
    ]
  },

  // ========================
  // Pets & Animals
  // ========================
  {
    category: 'pets',
    label: 'Pets & Animals',
    units: [
      { value: 'per pet', label: 'per pet' },
      { value: 'per session', label: 'per session' },
      { value: 'per day', label: 'per day' },
      { value: 'per night', label: 'per night (boarding)' },
      { value: 'per hour', label: 'per hour' },
      { value: 'per treatment', label: 'per treatment' },
    ]
  },

  // ========================
  // Events & Catering
  // ========================
  {
    category: 'events',
    label: 'Events & Catering',
    units: [
      { value: 'per person', label: 'per person' },
      { value: 'per event', label: 'per event' },
      { value: 'per plate', label: 'per plate' },
      { value: 'per hour', label: 'per hour' },
      { value: 'per package', label: 'per package' },
      { value: 'fixed price', label: 'fixed price' },
    ]
  },

  // ========================
  // Photography & Media
  // ========================
  {
    category: 'photography',
    label: 'Photography & Media',
    units: [
      { value: 'per hour', label: 'per hour' },
      { value: 'per session', label: 'per session' },
      { value: 'per day', label: 'per day' },
      { value: 'per event', label: 'per event' },
      { value: 'per deliverable', label: 'per deliverable' },
      { value: 'per photo', label: 'per photo' },
      { value: 'per video', label: 'per video' },
    ]
  },

  // ========================
  // Legal & Financial
  // ========================
  {
    category: 'legal',
    label: 'Legal & Financial',
    units: [
      { value: 'per hour', label: 'per hour' },
      { value: 'per consultation', label: 'per consultation' },
      { value: 'per case', label: 'per case' },
      { value: 'per service', label: 'per service' },
      { value: 'retainer/month', label: 'retainer/month' },
      { value: 'fixed price', label: 'fixed price' },
      { value: 'percentage', label: 'percentage' },
    ]
  },

  // ========================
  // No Fixed Price
  // ========================
  {
    category: 'contact',
    label: 'Contact for Price',
    units: [
      { value: 'contact for price', label: 'Contact for price' },
      { value: 'negotiable', label: 'Price negotiable' },
      { value: 'custom quote', label: 'Custom quote' },
      { value: 'starting from', label: 'Starting from' },
      { value: 'call for price', label: 'Call for price' },
    ]
  },
];

// Helper function to get all unique units
export function getAllUnits() {
  const units = new Map();
  priceUnits.forEach(group => {
    group.units.forEach(unit => {
      units.set(unit.value, unit.label);
    });
  });
  return units;
}

// Helper function to get units by category
export function getUnitsByCategory(category: string) {
  return priceUnits.find(g => g.category === category)?.units || [];
}
