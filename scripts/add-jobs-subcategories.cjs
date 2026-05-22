// Additional Jobs sub-categories
// Run: node scripts/add-jobs-subcategories.js

const fs = require('fs');

const additionalJobsCategories = [
  // Manufacturing & Production
  { id: 'lc-1-11', name: 'Manufacturing & Production', slug: 'jobs-manufacturing', description: 'Manufacturing and production jobs', icon: '🏭', parentId: 'lc-1', sortOrder: 111, isActive: 1, formFields: '[]' },

  // Legal Services
  { id: 'lc-1-12', name: 'Legal Services', slug: 'jobs-legal', description: 'Law, paralegal, and legal positions', icon: '⚖️', parentId: 'lc-1', sortOrder: 112, isActive: 1, formFields: '[]' },

  // Marketing & Advertising
  { id: 'lc-1-13', name: 'Marketing & Advertising', slug: 'jobs-marketing', description: 'Marketing, PR, and advertising', icon: '📣', parentId: 'lc-1', sortOrder: 113, isActive: 1, formFields: '[]' },

  // Human Resources
  { id: 'lc-1-14', name: 'Human Resources', slug: 'jobs-hr', description: 'HR, recruitment, and personnel', icon: '👔', parentId: 'lc-1', sortOrder: 114, isActive: 1, formFields: '[]' },

  // Engineering
  { id: 'lc-1-15', name: 'Engineering', slug: 'jobs-engineering', description: 'Engineering positions', icon: '🔬', parentId: 'lc-1', sortOrder: 115, isActive: 1, formFields: '[]' },

  // Science & Research
  { id: 'lc-1-16', name: 'Science & Research', slug: 'jobs-science', description: 'Science, research, and academia', icon: '🔬', parentId: 'lc-1', sortOrder: 116, isActive: 1, formFields: '[]' },

  // Media & Communications
  { id: 'lc-1-17', name: 'Media & Communications', slug: 'jobs-media', description: 'Journalism, broadcasting, communications', icon: '🎬', parentId: 'lc-1', sortOrder: 117, isActive: 1, formFields: '[]' },

  // Real Estate
  { id: 'lc-1-18', name: 'Real Estate', slug: 'jobs-real-estate', description: 'Real estate and property', icon: '🏢', parentId: 'lc-1', sortOrder: 118, isActive: 1, formFields: '[]' },

  // Transportation & Logistics
  { id: 'lc-1-19', name: 'Transportation & Logistics', slug: 'jobs-transport', description: 'Driving, logistics, and warehouse', icon: '🚛', parentId: 'lc-1', sortOrder: 119, isActive: 1, formFields: '[]' },

  // Security & Armed Forces
  { id: 'lc-1-20', name: 'Security & Armed Forces', slug: 'jobs-security', description: 'Security, police, military', icon: '🛡️', parentId: 'lc-1', sortOrder: 120, isActive: 1, formFields: '[]' },

  // Executive & Management
  { id: 'lc-1-21', name: 'Executive & Management', slug: 'jobs-management', description: 'C-level, directors, managers', icon: '👑', parentId: 'lc-1', sortOrder: 121, isActive: 1, formFields: '[]' },

  // Internship & Trainee
  { id: 'lc-1-22', name: 'Internship & Trainee', slug: 'jobs-internship', description: 'Internships and training programs', icon: '🎓', parentId: 'lc-1', sortOrder: 122, isActive: 1, formFields: '[]' },

  // Remote / Work From Home
  { id: 'lc-1-23', name: 'Remote / Work From Home', slug: 'jobs-remote', description: 'Remote and work from home jobs', icon: '🏠', parentId: 'lc-1', sortOrder: 123, isActive: 1, formFields: '[]' },

  // Part-time
  { id: 'lc-1-24', name: 'Part-time', slug: 'jobs-parttime', description: 'Part-time employment', icon: '⏰', parentId: 'lc-1', sortOrder: 124, isActive: 1, formFields: '[]' },
];

// Generate SQL
const now = Math.floor(Date.now() / 1000);
const sqlStatements = additionalJobsCategories.map(cat => {
  return `INSERT OR REPLACE INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields, created_at, updated_at) VALUES ('${cat.id}', '${cat.name}', '${cat.slug}', '${cat.description}', '${cat.icon}', '${cat.parentId}', ${cat.sortOrder}, ${cat.isActive}, '${cat.formFields}', ${now}, ${now});`;
}).join('\n');

fs.writeFileSync('temp-jobs-categories.sql', sqlStatements);
console.log(`Generated ${additionalJobsCategories.length} additional Jobs categories`);
console.log('SQL saved to temp-jobs-categories.sql');