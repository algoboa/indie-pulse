// Centralized validation utilities for Indie Pulse

// Email validation with proper RFC 5322 compliant regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Password requirements
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates an email address
 */
export const validateEmail = (email: string): ValidationResult => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return { isValid: false, error: 'メールアドレスを入力してください' };
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { isValid: false, error: '有効なメールアドレスを入力してください' };
  }

  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'メールアドレスが長すぎます' };
  }

  return { isValid: true };
};

/**
 * Validates a password with strength requirements
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'パスワードを入力してください' };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return { isValid: false, error: `パスワードは${PASSWORD_MIN_LENGTH}文字以上必要です` };
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return { isValid: false, error: `パスワードは${PASSWORD_MAX_LENGTH}文字以下にしてください` };
  }

  return { isValid: true };
};

/**
 * Validates password confirmation
 */
export const validatePasswordConfirm = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: 'パスワードを確認してください' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'パスワードが一致しません' };
  }

  return { isValid: true };
};

/**
 * Validates a display name
 */
export const validateDisplayName = (name: string): ValidationResult => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return { isValid: false, error: '名前を入力してください' };
  }

  if (trimmedName.length < 1) {
    return { isValid: false, error: '名前は1文字以上必要です' };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, error: '名前は50文字以下にしてください' };
  }

  return { isValid: true };
};

/**
 * Sanitizes user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
