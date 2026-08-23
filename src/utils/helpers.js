// Utility helper functions (ES6+ features - Lectures 13-18)

export const calculateBMI = (weight, height) => {
  const h = height / 100;
  return (weight / (h * h)).toFixed(1);
};

export const getBMICategory = (bmi) => {
  const val = parseFloat(bmi);
  if (val < 18.5) return { label: 'Underweight', color: '#4dc9f6' };
  if (val < 25) return { label: 'Normal', color: '#00f593' };
  if (val < 30) return { label: 'Overweight', color: '#ffb347' };
  return { label: 'Obese', color: '#ff4d6a' };
};

export const calculateTDEE = (weight, height, age, gender, activity) => {
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, extreme: 1.9 };
  return Math.round(bmr * (multipliers[activity] || 1.2));
};

export const calculateMacros = (calories, goal) => {
  const ratios = {
    lose: { protein: 0.40, carbs: 0.30, fat: 0.30 },
    maintain: { protein: 0.30, carbs: 0.40, fat: 0.30 },
    gain: { protein: 0.30, carbs: 0.45, fat: 0.25 },
  };
  const r = ratios[goal] || ratios.maintain;
  return {
    protein: Math.round((calories * r.protein) / 4),
    carbs: Math.round((calories * r.carbs) / 4),
    fat: Math.round((calories * r.fat) / 9),
  };
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

export const capitalizeFirst = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
