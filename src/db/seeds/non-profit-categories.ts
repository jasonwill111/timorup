/**
 * Non-Profit Categories Seed Data
 * TimorLink - NGOs, Charities, Community Organizations
 */

export const nonProfitCategories = [
  // TOP-LEVEL CATEGORIES
  {
    id: 'npc-1',
    name: 'Humanitarian Aid',
    slug: 'humanitarian-aid',
    description: 'Emergency relief and humanitarian organizations',
    icon: '❤️',
    parentId: null,
    sortOrder: 1,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'focusArea', type: 'select', label: 'Focus Area', required: true, options: ['Emergency Response', 'Food Security', 'Shelter', 'Health', 'Education', 'Water & Sanitation', 'Protection', 'Multiple'] },
      { name: 'targetGroup', type: 'text', label: 'Primary Beneficiaries' },
      { name: 'responseCapacity', type: 'select', label: 'Response Capacity', options: ['Local', 'Regional', 'National', 'International'] },
      { name: 'registrationStatus', type: 'text', label: 'Registration Status' }
    ])
  },
  {
    id: 'npc-2',
    name: 'Education',
    slug: 'education-ngo',
    description: 'Educational organizations and programs',
    icon: '📚',
    parentId: null,
    sortOrder: 2,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'educationType', type: 'select', label: 'Type', required: true, options: ['Formal Education', 'Non-Formal Education', 'Vocational Training', 'Teacher Training', 'Scholarship Programs', 'Literacy Programs', 'Early Childhood', 'Multiple'] },
      { name: 'ageGroups', type: 'text', label: 'Age Groups Served' },
      { name: 'schoolLevel', type: 'text', label: 'School Level' },
      { name: 'freeOrSubsidized', type: 'boolean', label: 'Free or Subsidized' }
    ])
  },
  {
    id: 'npc-3',
    name: 'Healthcare',
    slug: 'healthcare-ngo',
    description: 'Health and medical organizations',
    icon: '🏥',
    parentId: null,
    sortOrder: 3,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'healthType', type: 'select', label: 'Type', required: true, options: ['Hospital', 'Clinic', 'Mobile Clinic', 'Community Health', 'Mental Health', 'Maternal Health', 'HIV/AIDS', 'Malaria', 'Tuberculosis', 'Vaccination', 'Nutrition', 'Multiple'] },
      { name: 'serviceArea', type: 'text', label: 'Service Area' },
      { name: 'freeService', type: 'boolean', label: 'Free Services' },
      { name: 'mobileUnit', type: 'boolean', label: 'Mobile Health Unit' }
    ])
  },
  {
    id: 'npc-4',
    name: 'Environment',
    slug: 'environment',
    description: 'Environmental protection and conservation',
    icon: '🌍',
    parentId: null,
    sortOrder: 4,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'environmentType', type: 'select', label: 'Focus', required: true, options: ['Conservation', 'Reforestation', 'Marine Protection', 'Wildlife', 'Climate Change', 'Waste Management', 'Water Conservation', 'Sustainable Energy', 'Environmental Education', 'Multiple'] },
      { name: 'projectAreas', type: 'text', label: 'Project Areas' },
      { name: 'communityInvolvement', type: 'boolean', label: 'Community Involvement' }
    ])
  },
  {
    id: 'npc-5',
    name: 'Women & Children',
    slug: 'women-children',
    description: 'Organizations supporting women and children',
    icon: '👶',
    parentId: null,
    sortOrder: 5,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'focusArea', type: 'select', label: 'Focus', required: true, options: ['Gender Equality', 'Violence Prevention', 'Women\'s Rights', 'Child Protection', 'Orphan Support', 'Youth Development', 'Early Childhood Development', 'Multiple'] },
      { name: 'ageGroups', type: 'text', label: 'Age Groups' },
      { name: 'shelterServices', type: 'boolean', label: 'Shelter Services' }
    ])
  },
  {
    id: 'npc-6',
    name: 'Youth Development',
    slug: 'youth-development',
    description: 'Youth empowerment and development programs',
    icon: '🌟',
    parentId: null,
    sortOrder: 6,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'programType', type: 'select', label: 'Program Type', required: true, options: ['Skills Training', 'Sports', 'Arts & Culture', 'Leadership', 'Entrepreneurship', 'Volunteer Programs', 'Mentorship', 'Civic Engagement', 'Multiple'] },
      { name: 'ageRange', type: 'text', label: 'Age Range' },
      { name: 'dropoutPrevention', type: 'boolean', label: 'Dropout Prevention' }
    ])
  },
  {
    id: 'npc-7',
    name: 'Agriculture & Food Security',
    slug: 'agriculture-food',
    description: 'Food security and agricultural development',
    icon: '🌾',
    parentId: null,
    sortOrder: 7,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'agriType', type: 'select', label: 'Type', required: true, options: ['Food Security', 'Sustainable Agriculture', 'Livestock', 'Fishing', 'Nutrition', 'Food Distribution', 'Agricultural Training', 'Seed Distribution', 'Multiple'] },
      { name: 'farmersReached', type: 'number', label: 'Farmers Reached' },
      { name: 'organicPractices', type: 'boolean', label: 'Organic/Sustainable Practices' }
    ])
  },
  {
    id: 'npc-8',
    name: 'Governance & Advocacy',
    slug: 'governance-advocacy',
    description: 'Civic engagement and policy advocacy',
    icon: '⚖️',
    parentId: null,
    sortOrder: 8,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'focusArea', type: 'select', label: 'Focus', required: true, options: ['Human Rights', 'Democracy', 'Transparency', 'Anti-Corruption', 'Civic Education', 'Justice', 'Good Governance', 'Research & Advocacy', 'Multiple'] },
      { name: 'policyAreas', type: 'text', label: 'Policy Areas' },
      { name: 'internationalAffiliates', type: 'text', label: 'International Affiliates' }
    ])
  },
  {
    id: 'npc-9',
    name: 'Disability Inclusion',
    slug: 'disability-inclusion',
    description: 'Organizations supporting people with disabilities',
    icon: '�?,
    parentId: null,
    sortOrder: 9,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'focusArea', type: 'select', label: 'Focus', required: true, options: ['Physical Disability', 'Visual Impairment', 'Hearing Impairment', 'Intellectual Disability', 'Multiple Disabilities', 'Inclusion Advocacy', 'Assistive Technology', 'Rehabilitation', 'Multiple'] },
      { name: 'servicesOffered', type: 'text', label: 'Services Offered' },
      { name: 'barrierFreeAccess', type: 'boolean', label: 'Barrier-Free Access' }
    ])
  },
  {
    id: 'npc-10',
    name: 'Emergency & Disaster',
    slug: 'emergency-disaster',
    description: 'Disaster preparedness and response',
    icon: '🚨',
    parentId: null,
    sortOrder: 10,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'preparednessType', type: 'select', label: 'Type', required: true, options: ['Disaster Response', 'Disaster Preparedness', 'Search & Rescue', 'First Aid', 'Emergency Shelter', 'Early Warning Systems', 'Climate Adaptation', 'Multiple'] },
      { name: 'responseTime', type: 'text', label: 'Response Time Capacity' },
      { name: 'equipmentAvailable', type: 'text', label: 'Equipment Available' }
    ])
  },
  {
    id: 'npc-11',
    name: 'Community Development',
    slug: 'community-development',
    description: 'Local community development organizations',
    icon: '🏘�?,
    parentId: null,
    sortOrder: 11,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'focusArea', type: 'select', label: 'Focus', required: true, options: ['Infrastructure', 'Water & Sanitation', 'Energy Access', 'Income Generation', 'Local Governance', 'Social Cohesion', 'Cultural Preservation', 'Multiple'] },
      { name: 'villagesCovered', type: 'number', label: 'Villages Covered' },
      { name: 'communityLed', type: 'boolean', label: 'Community-Led Development' }
    ])
  },
  {
    id: 'npc-12',
    name: 'Arts & Culture',
    slug: 'arts-culture',
    description: 'Arts, culture, and heritage organizations',
    icon: '🎨',
    parentId: null,
    sortOrder: 12,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'cultureType', type: 'select', label: 'Type', required: true, options: ['Traditional Arts', 'Performing Arts', 'Visual Arts', 'Music', 'Film & Media', 'Heritage Preservation', 'Cultural Education', 'Crafts & Textiles', 'Multiple'] },
      { name: 'culturalFocus', type: 'text', label: 'Cultural Focus' },
      { name: 'workshopsOffered', type: 'boolean', label: 'Workshops Offered' }
    ])
  },

  // SUB-CATEGORIES
  {
    id: 'npc-1-1',
    name: 'Food Security',
    slug: 'food-security',
    description: 'Food distribution and nutrition programs',
    icon: '🍚',
    parentId: 'npc-1',
    sortOrder: 11,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'beneficiaries', type: 'number', label: 'Monthly Beneficiaries' },
      { name: 'foodType', type: 'text', label: 'Type of Food Aid' },
      { name: 'distributionPoints', type: 'number', label: 'Distribution Points' }
    ])
  },
  {
    id: 'npc-5-1',
    name: 'Gender-Based Violence',
    slug: 'gbv-services',
    description: 'Services for survivors of gender-based violence',
    icon: '🆘',
    parentId: 'npc-5',
    sortOrder: 51,
    isActive: 1,
    formFields: JSON.stringify([
      { name: 'servicesType', type: 'select', label: 'Services', required: true, options: ['Shelter', 'Hotline', 'Counseling', 'Legal Aid', 'Medical Support', 'Rehabilitation', 'Awareness Programs', 'Multiple'] },
      { name: 'confidentialService', type: 'boolean', label: 'Confidential Service' },
      { name: '24hrService', type: 'boolean', label: '24/7 Hotline' }
    ])
  }
];

export const insertNonProfitCategoriesSQL = nonProfitCategories.map(cat => `
  INSERT INTO non_profit_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields)
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

export default nonProfitCategories;
