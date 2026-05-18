/**
 * Public Sector Categories Seed Data
 * TimorLIST - Government, Ministries, and Public Services
 */

export const publicSectorCategories = [
  // TOP-LEVEL CATEGORIES
  {
    id: 'psc-1',
    name: 'National Government',
    slug: 'national-government',
    description: 'National ministries and government agencies',
    icon: '🏛️',
    parentId: null,
    sortOrder: 1,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'ministryName', type: 'text', label: 'Ministry Name', required: true },
      { name: 'ministerName', type: 'text', label: 'Minister' },
      { name: 'headquarters', type: 'text', label: 'Headquarters Location' },
      { name: 'regionalOffices', type: 'number', label: 'Number of Regional Offices' },
      { name: 'servicesOffered', type: 'text', label: 'Key Services' }
    ])
  },
  {
    id: 'psc-2',
    name: 'Municipal & District',
    slug: 'municipal-district',
    description: 'Local government offices',
    icon: '🏢',
    parentId: null,
    sortOrder: 2,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'adminLevel', type: 'select', label: 'Admin Level', required: true, options: ['Municipality', 'Administrative Post', 'Suco/Suburb', 'Aldeia'] },
      { name: 'population', type: 'number', label: 'Population Served' },
      { name: 'chiefName', type: 'text', label: 'Chief Administrator' },
      { name: 'servicesOffered', type: 'text', label: 'Services Available' }
    ])
  },
  {
    id: 'psc-3',
    name: 'Justice & Law',
    slug: 'justice-law',
    description: 'Courts, police, and legal services',
    icon: '⚖️',
    parentId: null,
    sortOrder: 3,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'justiceType', type: 'select', label: 'Type', required: true, options: ['Court', 'Prosecutor Office', 'Public Defender', 'Police Station', 'Prison', 'Legal Aid', 'Alternative Dispute Resolution'] },
      { name: 'jurisdiction', type: 'text', label: 'Jurisdiction Area' },
      { name: 'operatingHours', type: 'text', label: 'Operating Hours' },
      { name: 'appointmentRequired', type: 'boolean', label: 'Appointment Required' }
    ])
  },
  {
    id: 'psc-4',
    name: 'Education',
    slug: 'education-public',
    description: 'Public schools and educational institutions',
    icon: '🏫',
    parentId: null,
    sortOrder: 4,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'schoolType', type: 'select', label: 'Type', required: true, options: ['Primary School', 'Secondary School', 'Technical School', 'University', 'Vocational Training Center', 'Teacher Training'] },
      { name: 'level', type: 'text', label: 'Education Level' },
      { name: 'studentCount', type: 'number', label: 'Number of Students' },
      { name: 'feesRequired', type: 'boolean', label: 'Fees Required' },
      { name: 'boardingAvailable', type: 'boolean', label: 'Boarding Available' }
    ])
  },
  {
    id: 'psc-5',
    name: 'Healthcare',
    slug: 'healthcare-public',
    description: 'Public hospitals and health centers',
    icon: '🏥',
    parentId: null,
    sortOrder: 5,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'healthType', type: 'select', label: 'Type', required: true, options: ['National Hospital', 'Referral Hospital', 'Municipal Health Center', 'Community Health Center', 'Health Post', 'Maternal & Child Health', 'Laboratory', 'Pharmacy'] },
      { name: 'bedsAvailable', type: 'number', label: 'Number of Beds' },
      { name: 'emergencyService', type: 'boolean', label: '24/7 Emergency' },
      { name: 'freeService', type: 'boolean', label: 'Free Services' },
      { name: 'specialistsAvailable', type: 'text', label: 'Medical Specialists' }
    ])
  },
  {
    id: 'psc-6',
    name: 'Agriculture & Rural',
    slug: 'agriculture-rural',
    description: 'Agricultural extension and rural development',
    icon: '🌾',
    parentId: null,
    sortOrder: 6,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'agriServiceType', type: 'select', label: 'Type', required: true, options: ['Agriculture Extension', 'Livestock', 'Fisheries', 'Forestry', 'Cooperatives', 'Rural Development', 'Irrigation', 'Agricultural Research'] },
      { name: 'serviceArea', type: 'text', label: 'Service Area' },
      { name: 'farmersReached', type: 'number', label: 'Farmers Reached' },
      { name: 'trainingPrograms', type: 'boolean', label: 'Training Programs' }
    ])
  },
  {
    id: 'psc-7',
    name: 'Infrastructure & Utilities',
    slug: 'infrastructure-utilities',
    description: 'Public works, transport, and utilities',
    icon: '🔧',
    parentId: null,
    sortOrder: 7,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'infraType', type: 'select', label: 'Type', required: true, options: ['Roads & Bridges', 'Water Supply', 'Electricity', 'Telecommunications', 'Port Authority', 'Airport', 'Public Transport', 'Waste Management'] },
      { name: 'serviceArea', type: 'text', label: 'Service Area' },
      { name: 'emergencyContact', type: 'text', label: 'Emergency Contact' },
      { name: 'reportFaults', type: 'boolean', label: 'Online Fault Reporting' }
    ])
  },
  {
    id: 'psc-8',
    name: 'Social Services',
    slug: 'social-services',
    description: 'Social welfare and protection services',
    icon: '🤝',
    parentId: null,
    sortOrder: 8,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'socialType', type: 'select', label: 'Type', required: true, options: ['Social Security', 'Pensions', 'Disability Benefits', 'Child Protection', 'Elderly Care', 'Food Assistance', 'Housing Support', 'Veteran Services', 'Refugee Services'] },
      { name: 'eligibilityCriteria', type: 'text', label: 'Eligibility Criteria' },
      { name: 'applicationProcess', type: 'text', label: 'Application Process' },
      { name: 'beneficiaries', type: 'number', label: 'Number of Beneficiaries' }
    ])
  },
  {
    id: 'psc-9',
    name: 'Tax & Finance',
    slug: 'tax-finance',
    description: 'Tax offices and financial services',
    icon: '💰',
    parentId: null,
    sortOrder: 9,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'financeType', type: 'select', label: 'Type', required: true, options: ['Tax Office', 'Customs', 'Treasury', 'National Bank', 'Revenue Authority', 'Customs Authority'] },
      { name: 'servicesOffered', type: 'text', label: 'Services' },
      { name: 'operatingHours', type: 'text', label: 'Operating Hours' },
      { name: 'onlineFiling', type: 'boolean', label: 'Online Filing Available' }
    ])
  },
  {
    id: 'psc-10',
    name: 'Immigration & Consular',
    slug: 'immigration-consular',
    description: 'Passports, visas, and consular services',
    icon: '🛂',
    parentId: null,
    sortOrder: 10,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'serviceType', type: 'select', label: 'Type', required: true, options: ['Passport Office', 'Visa Services', 'Emigration', 'Consular Affairs', 'Foreign Embassy', 'Immigration Control'] },
      { name: 'processingTime', type: 'text', label: 'Processing Time' },
      { name: 'appointmentRequired', type: 'boolean', label: 'Appointment Required' },
      { name: 'onlineBooking', type: 'boolean', label: 'Online Booking' }
    ])
  },
  {
    id: 'psc-11',
    name: 'Environment & Land',
    slug: 'environment-land',
    description: 'Environmental protection and land administration',
    icon: '🌳',
    parentId: null,
    sortOrder: 11,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'envType', type: 'select', label: 'Type', required: true, options: ['Environmental Agency', 'Land Registry', 'Cadastral Office', 'Spatial Planning', 'Geology & Mines', 'Water Resources', 'Meteorology'] },
      { name: 'serviceArea', type: 'text', label: 'Service Area' },
      { name: 'permitsIssued', type: 'text', label: 'Key Permits' },
      { name: 'onlinePortal', type: 'boolean', label: 'Online Portal' }
    ])
  },
  {
    id: 'psc-12',
    name: 'Employment & Labor',
    slug: 'employment-labor',
    description: 'Employment services and labor offices',
    icon: '👷',
    parentId: null,
    sortOrder: 12,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'laborType', type: 'select', label: 'Type', required: true, options: ['Labor Office', 'Employment Agency', 'Vocational Training', 'Social Security Institute', 'Workers Union', 'Occupational Safety'] },
      { name: 'jobSeekersRegistered', type: 'number', label: 'Job Seekers Registered' },
      { name: 'trainingPrograms', type: 'boolean', label: 'Training Programs' },
      { name: 'onlineJobPortal', type: 'boolean', label: 'Online Job Portal' }
    ])
  },

  // SUB-CATEGORIES
  {
    id: 'psc-5-1',
    name: 'National Hospitals',
    slug: 'national-hospitals',
    description: 'National referral hospitals',
    icon: '🏥',
    parentId: 'psc-5',
    sortOrder: 51,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'bedsAvailable', type: 'number', label: 'Number of Beds', required: true },
      { name: 'specialties', type: 'text', label: 'Medical Specialties' },
      { name: 'teachingHospital', type: 'boolean', label: 'Teaching Hospital' },
      { name: 'ambulanceService', type: 'boolean', label: 'Ambulance Service' }
    ])
  },
  {
    id: 'psc-5-2',
    name: 'Community Health Centers',
    slug: 'community-health-centers',
    description: 'Local health centers and posts',
    icon: '🏃',
    parentId: 'psc-5',
    sortOrder: 52,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'servicesOffered', type: 'text', label: 'Services', required: true },
      { name: 'staffCount', type: 'number', label: 'Staff Count' },
      { name: 'openingHours', type: 'text', label: 'Opening Hours' }
    ])
  },
  {
    id: 'psc-1-1',
    name: 'Ministry of Health',
    slug: 'ministry-health',
    description: 'Ministry of Health services and programs',
    icon: '🩺',
    parentId: 'psc-1',
    sortOrder: 11,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'healthPrograms', type: 'text', label: 'Health Programs' },
      { name: 'nationalHospitals', type: 'number', label: 'National Hospitals' },
      { name: 'healthCenters', type: 'number', label: 'Health Centers' },
      { name: 'emergencyHotline', type: 'text', label: 'Emergency Hotline' }
    ])
  },
  {
    id: 'psc-1-2',
    name: 'Ministry of Education',
    slug: 'ministry-education',
    description: 'Ministry of Education services',
    icon: '📖',
    parentId: 'psc-1',
    sortOrder: 12,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'educationPrograms', type: 'text', label: 'Education Programs' },
      { name: 'schoolsNationally', type: 'number', label: 'Total Schools' },
      { name: 'studentsNationally', type: 'number', label: 'Total Students' },
      { name: 'scholarships', type: 'text', label: 'Scholarship Programs' }
    ])
  }
];

export const insertPublicSectorCategoriesSQL = publicSectorCategories.map(cat => `
  INSERT INTO public_sector_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields)
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

export default publicSectorCategories;