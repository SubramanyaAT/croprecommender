// Comprehensive crop recommendation database
const cropDatabase = {
  spring: {
    loamy: [
      { name: 'Wheat', suitability: 'high', yieldPotential: '5-6 tons/ha', waterRequirement: 'Low-Medium', harvestTime: '120-140 days' },
      { name: 'Barley', suitability: 'high', yieldPotential: '4-5 tons/ha', waterRequirement: 'Low', harvestTime: '110-130 days' },
      { name: 'Chickpea', suitability: 'high', yieldPotential: '2-3 tons/ha', waterRequirement: 'Low', harvestTime: '100-120 days' },
      { name: 'Potato', suitability: 'medium', yieldPotential: '20-25 tons/ha', waterRequirement: 'Medium', harvestTime: '90-120 days' },
    ],
    sandy: [
      { name: 'Groundnut', suitability: 'high', yieldPotential: '2-3 tons/ha', waterRequirement: 'Medium', harvestTime: '130-150 days' },
      { name: 'Watermelon', suitability: 'high', yieldPotential: '30-40 tons/ha', waterRequirement: 'High', harvestTime: '70-80 days' },
      { name: 'Muskmelon', suitability: 'high', yieldPotential: '25-30 tons/ha', waterRequirement: 'High', harvestTime: '80-90 days' },
    ],
    clay: [
      { name: 'Rice', suitability: 'high', yieldPotential: '5-6 tons/ha', waterRequirement: 'High', harvestTime: '120-150 days' },
      { name: 'Cotton', suitability: 'medium', yieldPotential: '2-3 tons/ha', waterRequirement: 'High', harvestTime: '160-180 days' },
    ],
  },
  summer: {
    loamy: [
      { name: 'Maize', suitability: 'high', yieldPotential: '7-8 tons/ha', waterRequirement: 'Medium-High', harvestTime: '80-120 days' },
      { name: 'Sugarcane', suitability: 'high', yieldPotential: '60-80 tons/ha', waterRequirement: 'High', harvestTime: '270-365 days' },
      { name: 'Sorghum', suitability: 'medium', yieldPotential: '3-4 tons/ha', waterRequirement: 'Medium', harvestTime: '100-120 days' },
    ],
    sandy: [
      { name: 'Pearl Millet', suitability: 'high', yieldPotential: '1.5-2.5 tons/ha', waterRequirement: 'Low', harvestTime: '70-90 days' },
      { name: 'Cowpea', suitability: 'high', yieldPotential: '1-2 tons/ha', waterRequirement: 'Low-Medium', harvestTime: '60-90 days' },
    ],
    clay: [
      { name: 'Rice', suitability: 'high', yieldPotential: '5-6 tons/ha', waterRequirement: 'High', harvestTime: '120-150 days' },
      { name: 'Jute', suitability: 'medium', yieldPotential: '3-4 tons/ha', waterRequirement: 'High', harvestTime: '120-140 days' },
    ],
  },
  monsoon: {
    loamy: [
      { name: 'Rice', suitability: 'high', yieldPotential: '5-7 tons/ha', waterRequirement: 'High', harvestTime: '120-150 days' },
      { name: 'Lentil', suitability: 'high', yieldPotential: '1.5-2.5 tons/ha', waterRequirement: 'Medium', harvestTime: '100-120 days' },
      { name: 'Black Bean', suitability: 'medium', yieldPotential: '2-2.5 tons/ha', waterRequirement: 'Medium', harvestTime: '90-120 days' },
    ],
    sandy: [
      { name: 'Green Gram', suitability: 'high', yieldPotential: '1-1.5 tons/ha', waterRequirement: 'Medium', harvestTime: '60-90 days' },
      { name: 'Black Gram', suitability: 'high', yieldPotential: '1-1.5 tons/ha', waterRequirement: 'Medium', harvestTime: '80-100 days' },
    ],
    clay: [
      { name: 'Rice', suitability: 'high', yieldPotential: '6-8 tons/ha', waterRequirement: 'Very High', harvestTime: '120-150 days' },
      { name: 'Sugarcane', suitability: 'medium', yieldPotential: '50-70 tons/ha', waterRequirement: 'High', harvestTime: '270-365 days' },
    ],
  },
  autumn: {
    loamy: [
      { name: 'Wheat', suitability: 'high', yieldPotential: '5-6 tons/ha', waterRequirement: 'Low-Medium', harvestTime: '120-140 days' },
      { name: 'Gram', suitability: 'high', yieldPotential: '2-2.5 tons/ha', waterRequirement: 'Low', harvestTime: '110-120 days' },
      { name: 'Linseed', suitability: 'medium', yieldPotential: '1-1.5 tons/ha', waterRequirement: 'Low-Medium', harvestTime: '100-120 days' },
    ],
    sandy: [
      { name: 'Groundnut', suitability: 'high', yieldPotential: '2-2.5 tons/ha', waterRequirement: 'Low-Medium', harvestTime: '130-150 days' },
      { name: 'Sesame', suitability: 'high', yieldPotential: '1-1.5 tons/ha', waterRequirement: 'Low', harvestTime: '90-120 days' },
    ],
    clay: [
      { name: 'Rice', suitability: 'high', yieldPotential: '4-5 tons/ha', waterRequirement: 'High', harvestTime: '120-140 days' },
      { name: 'Mustard', suitability: 'medium', yieldPotential: '1.5-2 tons/ha', waterRequirement: 'Low', harvestTime: '100-120 days' },
    ],
  },
  winter: {
    loamy: [
      { name: 'Wheat', suitability: 'high', yieldPotential: '5-6 tons/ha', waterRequirement: 'Low-Medium', harvestTime: '120-140 days' },
      { name: 'Pea', suitability: 'high', yieldPotential: '2-2.5 tons/ha', waterRequirement: 'Low-Medium', harvestTime: '90-110 days' },
      { name: 'Potato', suitability: 'high', yieldPotential: '20-25 tons/ha', waterRequirement: 'Medium', harvestTime: '90-120 days' },
    ],
    sandy: [
      { name: 'Carrot', suitability: 'high', yieldPotential: '30-40 tons/ha', waterRequirement: 'Medium', harvestTime: '70-80 days' },
      { name: 'Radish', suitability: 'high', yieldPotential: '25-35 tons/ha', waterRequirement: 'Medium', harvestTime: '50-60 days' },
    ],
    clay: [
      { name: 'Wheat', suitability: 'medium', yieldPotential: '4-5 tons/ha', waterRequirement: 'Low-Medium', harvestTime: '120-140 days' },
      { name: 'Mustard', suitability: 'high', yieldPotential: '1.5-2 tons/ha', waterRequirement: 'Low', harvestTime: '100-120 days' },
    ],
  },
};

const getRecommendations = (season, soilType) => {
  const season_lower = season.toLowerCase();
  const soil_lower = soilType.toLowerCase();

  if (cropDatabase[season_lower] && cropDatabase[season_lower][soil_lower]) {
    return cropDatabase[season_lower][soil_lower];
  }

  // Fallback to loamy soil if combination not found
  if (cropDatabase[season_lower] && cropDatabase[season_lower].loamy) {
    return cropDatabase[season_lower].loamy;
  }

  return [];
};

module.exports = { getRecommendations };
