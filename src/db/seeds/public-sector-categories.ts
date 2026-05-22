/**
 * Public Sector Categories Seed Data
 * TimorUp (2026-05-21)
 *
 * 15 parent categories with subcategories
 * Government, Ministries, and Public Services in Timor-Leste
 */

export const publicSectorCategories = [
  // 1. National Government
  { id: "national-government", name: "National Government", slug: "national-government", description: "National ministries and government agencies", icon: "Landmark", parentId: null, sortOrder: 1, isActive: 1 },
  { id: "prime-ministers-office", name: "Prime Minister's Office", slug: "prime-ministers-office", description: "Office of the Prime Minister", icon: "Building", parentId: "national-government", sortOrder: 1 },
  { id: "ministries", name: "Ministries", slug: "ministries", description: "Government ministries", icon: "Building2", parentId: "national-government", sortOrder: 2 },
  { id: "parliament", name: "Parliament", slug: "parliament", description: "National Parliament", icon: "Scale", parentId: "national-government", sortOrder: 3 },
  { id: "courts", name: "Courts", slug: "courts", description: "Judicial system", icon: "Gavel", parentId: "national-government", sortOrder: 4 },

  // 2. Municipal & District
  { id: "municipal-district", name: "Municipal & District", slug: "municipal-district", description: "Local government offices", icon: "MapPin", parentId: null, sortOrder: 2, isActive: 1 },
  { id: "district-offices", name: "District Offices", slug: "district-offices", description: "Administrative districts", icon: "Map", parentId: "municipal-district", sortOrder: 1 },
  { id: "municipal-services", name: "Municipal Services", slug: "municipal-services", description: "City/town services", icon: "Building", parentId: "municipal-district", sortOrder: 2 },
  { id: "sucos", name: "Suco Offices", slug: "suco-offices", description: "Village administrative offices", icon: "Home", parentId: "municipal-district", sortOrder: 3 },

  // 3. Healthcare Services
  { id: "healthcare-services", name: "Healthcare Services", slug: "healthcare-services", description: "Public health services", icon: "Heart", parentId: null, sortOrder: 3, isActive: 1 },
  { id: "national-hospitals", name: "National Hospitals", slug: "national-hospitals", description: "National referral hospitals", icon: "Building2", parentId: "healthcare-services", sortOrder: 1 },
  { id: "community-health", name: "Community Health Centers", slug: "community-health-centers", description: "Health posts and clinics", icon: "Stethoscope", parentId: "healthcare-services", sortOrder: 2 },
  { id: "clinics", name: "Clinics", slug: "clinics", description: "Local clinics", icon: "Plus", parentId: "healthcare-services", sortOrder: 3 },

  // 4. Education Services
  { id: "education-services", name: "Education Services", slug: "education-services", description: "Public education institutions", icon: "GraduationCap", parentId: null, sortOrder: 4, isActive: 1 },
  { id: "ministry-of-education", name: "Ministry of Education", slug: "ministry-of-education", description: "Education ministry", icon: "Building", parentId: "education-services", sortOrder: 1 },
  { id: "schools", name: "Schools", slug: "schools", description: "Public schools", icon: "BookOpen", parentId: "education-services", sortOrder: 2 },
  { id: "training-centers", name: "Training Centers", slug: "training-centers", description: "Vocational training", icon: "Award", parentId: "education-services", sortOrder: 3 },

  // 5. Public Security
  { id: "public-security", name: "Public Security", slug: "public-security", description: "Law enforcement and emergency services", icon: "Shield", parentId: null, sortOrder: 5, isActive: 1 },
  { id: "police", name: "Police (PNTL)", slug: "police", description: "National Police Timor-Leste", icon: "Shield", parentId: "public-security", sortOrder: 1 },
  { id: "fire-department", name: "Fire Department", slug: "fire-department", description: "Fire and rescue services", icon: "Flame", parentId: "public-security", sortOrder: 2 },
  { id: "civil-protection", name: "Civil Protection", slug: "civil-protection", description: "Civil defense and protection", icon: "AlertTriangle", parentId: "public-security", sortOrder: 3 },

  // 6. Defense & Security
  { id: "defense-security", name: "Defense & Security", slug: "defense-security", description: "Military and defense services", icon: "Crosshair", parentId: null, sortOrder: 6, isActive: 1 },
  { id: "ffdlt", name: "F-FDTL (Armed Forces)", slug: "ffdlt", description: "Timor-Leste Defense Force", icon: "Shield", parentId: "defense-security", sortOrder: 1 },
  { id: "maritime-authority", name: "Maritime Authority", slug: "maritime-authority", description: "Coast guard and maritime", icon: "Anchor", parentId: "defense-security", sortOrder: 2 },

  // 7. Infrastructure
  { id: "infrastructure", name: "Infrastructure", slug: "infrastructure", description: "Public infrastructure services", icon: "HardHat", parentId: null, sortOrder: 7, isActive: 1 },
  { id: "roads", name: "Roads & Bridges", slug: "roads-bridges", description: "Road construction and maintenance", icon: "Route", parentId: "infrastructure", sortOrder: 1 },
  { id: "utilities", name: "Utilities", slug: "utilities", description: "Electricity, water, telecom", icon: "Zap", parentId: "infrastructure", sortOrder: 2 },
  { id: "public-works", name: "Public Works", slug: "public-works", description: "Construction projects", icon: "Hammer", parentId: "infrastructure", sortOrder: 3 },

  // 8. Social Services
  { id: "social-services", name: "Social Services", slug: "social-services", description: "Welfare and social programs", icon: "Users", parentId: null, sortOrder: 8, isActive: 1 },
  { id: "welfare", name: "Welfare", slug: "welfare", description: "Social welfare programs", icon: "Heart", parentId: "social-services", sortOrder: 1 },
  { id: "social-security", name: "Social Security", slug: "social-security", description: "Social security services", icon: "Shield", parentId: "social-services", sortOrder: 2 },
  { id: "labor", name: "Labor & Employment", slug: "labor-employment", description: "Employment services", icon: "Briefcase", parentId: "social-services", sortOrder: 3 },

  // 9. Agriculture & Rural
  { id: "agriculture-rural", name: "Agriculture & Rural", slug: "agriculture-rural", description: "Agricultural and rural development", icon: "Wheat", parentId: null, sortOrder: 9, isActive: 1 },
  { id: "agri-extension", name: "Agricultural Extension", slug: "agricultural-extension", description: "Farmer support services", icon: "Sprout", parentId: "agriculture-rural", sortOrder: 1 },
  { id: "rural-development", name: "Rural Development", slug: "rural-development", description: "Rural development programs", icon: "Map", parentId: "agriculture-rural", sortOrder: 2 },
  { id: "livestock", name: "Livestock & Fisheries", slug: "livestock-fisheries", description: "Animal and fish farming", icon: "Fish", parentId: "agriculture-rural", sortOrder: 3 },

  // 10. Immigration & Consular
  { id: "immigration-consular", name: "Immigration & Consular", slug: "immigration-consular", description: "Passport and visa services", icon: "Globe", parentId: null, sortOrder: 10, isActive: 1 },
  { id: "passport-office", name: "Passport Office", slug: "passport-office", description: "Passport issuance", icon: "CreditCard", parentId: "immigration-consular", sortOrder: 1 },
  { id: "visa-services", name: "Visa Services", slug: "visa-services", description: "Immigration and visas", icon: "FileText", parentId: "immigration-consular", sortOrder: 2 },
  { id: "embassies", name: "Embassies & Consulates", slug: "embassies-consulates", description: "Foreign embassies in Timor-Leste", icon: "Building", parentId: "immigration-consular", sortOrder: 3 },

  // 11. Tax & Finance
  { id: "tax-finance", name: "Tax & Finance", slug: "tax-finance", description: "Financial and tax services", icon: "Landmark", parentId: null, sortOrder: 11, isActive: 1 },
  { id: "tax-authority", name: "Tax Authority", slug: "tax-authority", description: "Tax collection and compliance", icon: "Calculator", parentId: "tax-finance", sortOrder: 1 },
  { id: "treasury", name: "Treasury", slug: "treasury", description: "Government treasury", icon: "Coins", parentId: "tax-finance", sortOrder: 2 },
  { id: "customs", name: "Customs", slug: "customs", description: "Customs and border control", icon: "Shield", parentId: "tax-finance", sortOrder: 3 },

  // 12. Environment & Land
  { id: "environment-land", name: "Environment & Land", slug: "environment-land", description: "Environmental and land management", icon: "TreePine", parentId: null, sortOrder: 12, isActive: 1 },
  { id: "environmental-agency", name: "Environmental Agency", slug: "environmental-agency", description: "Environmental protection", icon: "Leaf", parentId: "environment-land", sortOrder: 1 },
  { id: "land-registry", name: "Land Registry", slug: "land-registry", description: "Land titling and registration", icon: "Map", parentId: "environment-land", sortOrder: 2 },
  { id: "land-management", name: "Land Management", slug: "land-management", description: "Land use planning", icon: "Grid3x3", parentId: "environment-land", sortOrder: 3 },

  // 13. Tourism
  { id: "tourism", name: "Tourism", slug: "tourism", description: "Tourism promotion and services", icon: "MapPin", parentId: null, sortOrder: 13, isActive: 1 },
  { id: "tourism-authority", name: "Tourism Authority", slug: "tourism-authority", description: "National tourism board", icon: "Compass", parentId: "tourism", sortOrder: 1 },
  { id: "national-parks", name: "National Parks", slug: "national-parks", description: "Protected areas and parks", icon: "Mountain", parentId: "tourism", sortOrder: 2 },
  { id: "museums", name: "Museums & Heritage", slug: "museums-heritage", description: "Cultural heritage sites", icon: "Landmark", parentId: "tourism", sortOrder: 3 },

  // 14. Culture & Heritage
  { id: "culture-heritage", name: "Culture & Heritage", slug: "culture-heritage", description: "Cultural preservation and arts", icon: "Palette", parentId: null, sortOrder: 14, isActive: 1 },
  { id: "cultural-heritage", name: "Cultural Heritage", slug: "cultural-heritage", description: "Heritage preservation", icon: "Landmark", parentId: "culture-heritage", sortOrder: 1 },
  { id: "arts-culture", name: "Arts & Culture", slug: "arts-culture", description: "Arts promotion", icon: "Palette", parentId: "culture-heritage", sortOrder: 2 },
  { id: "museums-2", name: "Museums", slug: "museums", description: "National museums", icon: "Building", parentId: "culture-heritage", sortOrder: 3 },

  // 15. Religious & Youth
  { id: "religious-youth", name: "Religious & Youth", slug: "religious-youth", description: "Religious affairs and youth services", icon: "Users", parentId: null, sortOrder: 15, isActive: 1 },
  { id: "religious-affairs", name: "Religious Affairs", slug: "religious-affairs", description: "Religious affairs office", icon: "Cross", parentId: "religious-youth", sortOrder: 1 },
  { id: "sports-commission", name: "Sports Commission", slug: "sports-commission", description: "National sports authority", icon: "Trophy", parentId: "religious-youth", sortOrder: 2 },
  { id: "youth-center", name: "Youth Center", slug: "youth-center", description: "Youth development center", icon: "Rocket", parentId: "religious-youth", sortOrder: 3 },
];

export default publicSectorCategories;