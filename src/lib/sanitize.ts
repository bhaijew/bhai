/**
 * Input sanitization and defense helpers against XSS, injection, and invalid data
 */

export function sanitizeString(input: unknown, maxLength = 1000): string {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    // Remove null bytes and dangerous control characters
    .replace(/\0/g, '')
    // Strip HTML tags to prevent stored XSS
    .replace(/<[^>]*>/g, '')
    // Limit length to avoid denial of service payloads
    .slice(0, maxLength);
}

export function sanitizeEmail(email: unknown): string {
  if (typeof email !== 'string') return '';
  const cleaned = email.trim().toLowerCase();
  // Basic RFC 5322 regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(cleaned) ? cleaned.slice(0, 150) : '';
}

export function sanitizePhone(phone: unknown): string {
  if (typeof phone !== 'string') return '';
  // Only allow digits, plus, spaces, dashes, parentheses
  return phone.replace(/[^\d+()\-\s]/g, '').trim().slice(0, 30);
}

export function sanitizePrice(price: unknown): number {
  const num = Number(price);
  if (isNaN(num) || num < 0 || num > 10000000) {
    return 0;
  }
  return Math.round(num * 100) / 100;
}
