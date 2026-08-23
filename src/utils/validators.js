// Form validation utilities (Lectures 55-60)
export const validators = {
  required: (value) => (!value || !value.toString().trim() ? 'This field is required' : ''),

  email: (value) => {
    if (!value) return 'Email is required';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) ? '' : 'Please enter a valid email';
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  },

  confirmPassword: (value, password) => {
    if (!value) return 'Please confirm your password';
    return value === password ? '' : 'Passwords do not match';
  },

  number: (value, { min, max, label = 'Value' } = {}) => {
    const num = parseFloat(value);
    if (isNaN(num)) return `${label} must be a number`;
    if (min !== undefined && num < min) return `${label} must be at least ${min}`;
    if (max !== undefined && num > max) return `${label} must be at most ${max}`;
    return '';
  },

  name: (value) => {
    if (!value || !value.trim()) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  }
};

export const validateForm = (values, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const error = rules[field](values[field], values);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });

  return { errors, isValid };
};
