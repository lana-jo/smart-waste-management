export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_MIN_LENGTH = 8;

export const GENERIC_ERROR_MESSAGE = "Periksa kembali isian form.";

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}
