/**
 * Non-Profit Categories Seed Data
 * TimorUp (2026-05-21)
 *
 * 12 parent categories with subcategories
 * Simplified structure - Others category as fallback
 */

export const nonProfitCategories = [
  // 1. Humanitarian Aid
  { id: "humanitarian-aid", name: "Humanitarian Aid", slug: "humanitarian-aid", description: "Emergency relief and humanitarian organizations", icon: "Heart", parentId: null, sortOrder: 1, isActive: 1 },
  { id: "emergency-relief", name: "Emergency Relief", slug: "emergency-relief", description: "Emergency response and relief", icon: "Siren", parentId: "humanitarian-aid", sortOrder: 1 },
  { id: "food-aid", name: "Food Aid", slug: "food-aid", description: "Food distribution programs", icon: "Utensils", parentId: "humanitarian-aid", sortOrder: 2 },
  { id: "shelter", name: "Shelter", slug: "shelter", description: "Emergency shelter and housing", icon: "Home", parentId: "humanitarian-aid", sortOrder: 3 },
  { id: "medical-aid", name: "Medical Aid", slug: "medical-aid", description: "Medical humanitarian aid", icon: "Stethoscope", parentId: "humanitarian-aid", sortOrder: 4 },

  // 2. Education
  { id: "education", name: "Education", slug: "education", description: "Educational organizations and programs", icon: "GraduationCap", parentId: null, sortOrder: 2, isActive: 1 },
  { id: "schools", name: "Schools", slug: "schools", description: "Formal education institutions", icon: "Building2", parentId: "education", sortOrder: 1 },
  { id: "training", name: "Training", slug: "training", description: "Vocational and skills training", icon: "Award", parentId: "education", sortOrder: 2 },
  { id: "literacy", name: "Literacy Programs", slug: "literacy-programs", description: "Literacy education", icon: "BookOpen", parentId: "education", sortOrder: 3 },
  { id: "scholarships", name: "Scholarships", slug: "scholarships", description: "Scholarship programs", icon: "Gift", parentId: "education", sortOrder: 4 },

  // 3. Healthcare
  { id: "healthcare", name: "Healthcare", slug: "healthcare", description: "Health and medical organizations", icon: "Heart", parentId: null, sortOrder: 3, isActive: 1 },
  { id: "clinics", name: "Clinics", slug: "clinics", description: "Medical clinics", icon: "Stethoscope", parentId: "healthcare", sortOrder: 1 },
  { id: "health-outreach", name: "Health Outreach", slug: "health-outreach", description: "Mobile health services", icon: "MapPin", parentId: "healthcare", sortOrder: 2 },
  { id: "mental-health", name: "Mental Health", slug: "mental-health", description: "Mental health services", icon: "Brain", parentId: "healthcare", sortOrder: 3 },
  { id: "maternal-health", name: "Maternal Health", slug: "maternal-health", description: "Maternal and child health", icon: "Baby", parentId: "healthcare", sortOrder: 4 },

  // 4. Environment
  { id: "environment", name: "Environment", slug: "environment", description: "Environmental protection and conservation", icon: "Leaf", parentId: null, sortOrder: 4, isActive: 1 },
  { id: "conservation", name: "Conservation", slug: "conservation", description: "Nature conservation", icon: "TreePine", parentId: "environment", sortOrder: 1 },
  { id: "reforestation", name: "Reforestation", slug: "reforestation", description: "Tree planting programs", icon: "Sprout", parentId: "environment", sortOrder: 2 },
  { id: "wildlife", name: "Wildlife Protection", slug: "wildlife-protection", description: "Wildlife conservation", icon: "PawPrint", parentId: "environment", sortOrder: 3 },
  { id: "clean-energy", name: "Clean Energy", slug: "clean-energy", description: "Renewable energy initiatives", icon: "Sun", parentId: "environment", sortOrder: 4 },

  // 5. Women & Children
  { id: "women-children", name: "Women & Children", slug: "women-children", description: "Organizations supporting women and children", icon: "Users", parentId: null, sortOrder: 5, isActive: 1 },
  { id: "womens-rights", name: "Women's Rights", slug: "womens-rights", description: "Gender equality advocacy", icon: "Scale", parentId: "women-children", sortOrder: 1 },
  { id: "child-protection", name: "Child Protection", slug: "child-protection", description: "Child welfare services", icon: "Shield", parentId: "women-children", sortOrder: 2 },
  { id: "youth-programs", name: "Youth Programs", slug: "youth-programs", description: "Youth development", icon: "Rocket", parentId: "women-children", sortOrder: 3 },

  // 6. Agriculture & Food
  { id: "agriculture-food", name: "Agriculture & Food", slug: "agriculture-food", description: "Food security and agricultural development", icon: "Wheat", parentId: null, sortOrder: 6, isActive: 1 },
  { id: "urban-farming", name: "Urban Farming", slug: "urban-farming", description: "Urban agriculture", icon: "Sprout", parentId: "agriculture-food", sortOrder: 1 },
  { id: "food-banks", name: "Food Banks", slug: "food-banks", description: "Food distribution", icon: "Package", parentId: "agriculture-food", sortOrder: 2 },
  { id: "community-gardens", name: "Community Gardens", slug: "community-gardens", description: "Community agriculture", icon: "Flower2", parentId: "agriculture-food", sortOrder: 3 },

  // 7. Governance & Advocacy
  { id: "governance-advocacy", name: "Governance & Advocacy", slug: "governance-advocacy", description: "Civic engagement and policy advocacy", icon: "Scale", parentId: null, sortOrder: 7, isActive: 1 },
  { id: "human-rights", name: "Human Rights", slug: "human-rights", description: "Human rights advocacy", icon: "Globe", parentId: "governance-advocacy", sortOrder: 1 },
  { id: "legal-aid", name: "Legal Aid", slug: "legal-aid", description: "Free legal services", icon: "Scale", parentId: "governance-advocacy", sortOrder: 2 },
  { id: "policy-advocacy", name: "Policy Advocacy", slug: "policy-advocacy", description: "Policy research and advocacy", icon: "FileText", parentId: "governance-advocacy", sortOrder: 3 },

  // 8. Community Development
  { id: "community-development", name: "Community Development", slug: "community-development", description: "Local community development", icon: "Building", parentId: null, sortOrder: 8, isActive: 1 },
  { id: "infrastructure", name: "Infrastructure", slug: "infrastructure", description: "Community infrastructure", icon: "HardHat", parentId: "community-development", sortOrder: 1 },
  { id: "water-sanitation", name: "Water & Sanitation", slug: "water-sanitation", description: "WASH programs", icon: "Droplets", parentId: "community-development", sortOrder: 2 },
  { id: "social-programs", name: "Social Programs", slug: "social-programs", description: "Social welfare programs", icon: "Heart", parentId: "community-development", sortOrder: 3 },

  // 9. Emergency & Disaster
  { id: "emergency-disaster", name: "Emergency & Disaster", slug: "emergency-disaster", description: "Disaster preparedness and response", icon: "Siren", parentId: null, sortOrder: 9, isActive: 1 },
  { id: "disaster-response", name: "Disaster Response", slug: "disaster-response", description: "Post-disaster response", icon: "AlertTriangle", parentId: "emergency-disaster", sortOrder: 1 },
  { id: "search-rescue", name: "Search & Rescue", slug: "search-rescue", description: "Search and rescue operations", icon: "Compass", parentId: "emergency-disaster", sortOrder: 2 },
  { id: "relief", name: "Relief", slug: "relief", description: "Relief supplies and logistics", icon: "Package", parentId: "emergency-disaster", sortOrder: 3 },

  // 10. Arts, Culture & Sports
  { id: "arts-culture-sports", name: "Arts, Culture & Sports", slug: "arts-culture-sports", description: "Arts, culture, and sports organizations", icon: "Palette", parentId: null, sortOrder: 10, isActive: 1 },
  { id: "cultural-orgs", name: "Cultural Organizations", slug: "cultural-organizations", description: "Cultural preservation", icon: "Landmark", parentId: "arts-culture-sports", sortOrder: 1 },
  { id: "sports-clubs", name: "Sports Clubs", slug: "sports-clubs", description: "Sports organizations", icon: "Trophy", parentId: "arts-culture-sports", sortOrder: 2 },
  { id: "community-events", name: "Community Events", slug: "community-events", description: "Community gatherings", icon: "Calendar", parentId: "arts-culture-sports", sortOrder: 3 },

  // 11. Disability & Senior Care
  { id: "disability-senior", name: "Disability & Senior Care", slug: "disability-senior-care", description: "Support for disabled and elderly", icon: "Accessibility", parentId: null, sortOrder: 11, isActive: 1 },
  { id: "disability-support", name: "Disability Support", slug: "disability-support", description: "Disability services", icon: "Accessibility", parentId: "disability-senior", sortOrder: 1 },
  { id: "senior-services", name: "Senior Services", slug: "senior-services", description: "Elderly care", icon: "Heart", parentId: "disability-senior", sortOrder: 2 },

  // 12. Housing & Shelter
  { id: "housing-shelter", name: "Housing & Shelter", slug: "housing-shelter", description: "Housing assistance organizations", icon: "Home", parentId: null, sortOrder: 12, isActive: 1 },
  { id: "homeless-shelters", name: "Homeless Shelters", slug: "homeless-shelters", description: "Shelter for homeless", icon: "Bed", parentId: "housing-shelter", sortOrder: 1 },
  { id: "housing-assistance", name: "Housing Assistance", slug: "housing-assistance", description: "Housing support programs", icon: "Key", parentId: "housing-shelter", sortOrder: 2 },

  // 13. Others
  { id: "others", name: "Others", slug: "others", description: "Other non-profit organizations", icon: "MoreHorizontal", parentId: null, sortOrder: 13, isActive: 1 },
  { id: "refugee-support", name: "Refugee Support", slug: "refugee-support", description: "Refugee assistance", icon: "Users", parentId: "others", sortOrder: 1 },
  { id: "veterans", name: "Veterans Services", slug: "veterans-services", description: "Veteran organizations", icon: "Award", parentId: "others", sortOrder: 2 },
  { id: "other-services", name: "Other Services", slug: "other-services", description: "Other charitable services", icon: "Circle", parentId: "others", sortOrder: 3 },
];

export default nonProfitCategories;