/**
 * Form Validation and Input Sanitization Utility Helpers
 */

// Strict Indian Mobile Number Validation: 10 digits starting with 6, 7, 8, or 9
export const INDIAN_PHONE_REGEX = /^[6-9][0-9]{9}$/;

// Standard Email Validation
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Strong Password Validation (8-64 chars, 1 upper, 1 lower, 1 digit, 1 special char)
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

/**
 * Strips non-digit characters and caps input to 10 digits max.
 */
export const sanitizeIndianPhone = (input = '') => {
  if (!input) return '';
  return String(input).replace(/\D/g, '').slice(0, 10);
};

/**
 * Validates Indian Mobile Number with granular user feedback.
 */
export const validateIndianPhone = (value = '', required = true) => {
  const phone = String(value).trim();

  if (!phone) {
    return required ? 'Phone number is required.' : true;
  }

  if (/\D/.test(phone)) {
    return 'Phone number must contain digits only.';
  }

  if (phone.length < 10) {
    return 'Phone number must contain exactly 10 digits.';
  }

  if (phone.length > 10) {
    return 'Phone number must contain exactly 10 digits.';
  }

  const firstChar = phone.charAt(0);
  if (!['6', '7', '8', '9'].includes(firstChar)) {
    return 'Indian mobile numbers must start with 6, 7, 8, or 9.';
  }

  if (!INDIAN_PHONE_REGEX.test(phone)) {
    return 'Please enter a valid 10-digit Indian mobile number.';
  }

  return true;
};

/**
 * Evaluates password strength level.
 */
export const evaluatePasswordStrength = (password = '') => {
  if (!password) return { label: '', variant: 'secondary', percent: 0 };
  let score = 0;
  if (password.length >= 8) score += 25;
  if (/[A-Z]/.test(password)) score += 25;
  if (/[0-9]/.test(password)) score += 25;
  if (/[@$!%*?&]/.test(password)) score += 25;

  if (score <= 50) return { label: 'Weak', variant: 'danger', percent: score };
  if (score <= 75) return { label: 'Medium', variant: 'warning', percent: score };
  return { label: 'Strong', variant: 'success', percent: 100 };
};
