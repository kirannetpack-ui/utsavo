/**
 * UTSAVO Security Utilities
 * Defensive programming, XSS prevention, URL validation, and input sanitization.
 */

// Basic regex to strip harmful HTML / script tags
const HTML_TAG_REGEX = /<[^>]*>?/gm;
const SCRIPT_INJECTION_REGEX = /javascript:|data:text\/html|vbscript:|onload=|onerror=|onclick=|onmouseover=/gi;

/**
 * Strips script tags, HTML elements, and javascript: protocols from user inputs.
 */
export function sanitizeText(input: unknown, maxLength = 2000): string {
  if (typeof input !== 'string') {
    if (input === null || input === undefined) return '';
    return String(input).slice(0, maxLength);
  }
  
  // Trim and limit length
  let sanitized = input.trim().slice(0, maxLength);
  
  // Strip HTML tags
  sanitized = sanitized.replace(HTML_TAG_REGEX, '');
  
  // Neutralize script injection prefixes
  sanitized = sanitized.replace(SCRIPT_INJECTION_REGEX, '');
  
  return sanitized;
}

/**
 * Validates and sanitizes a URL.
 * Only allows http:, https:, and relative / data:image/ safe image protocols.
 */
export function sanitizeUrl(url: unknown, defaultFallback = ''): string {
  if (typeof url !== 'string' || !url.trim()) return defaultFallback;
  
  const trimmed = url.trim();
  
  // Disallow javascript:, vbscript:, and harmful protocols
  if (/^(javascript|vbscript|data:(?!image\/)):/i.test(trimmed)) {
    return defaultFallback;
  }
  
  try {
    // If it's a relative path, ensure it doesn't have sneaky schemes
    if (trimmed.startsWith('/') || trimmed.startsWith('data:image/')) {
      return trimmed;
    }
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return defaultFallback;
  } catch {
    // Invalid URL format
    return defaultFallback;
  }
}

/**
 * Validates a Nepali phone number (98XXXXXXXX or 97XXXXXXXX, or landline 01XXXXXXX).
 */
export function validatePhoneNepal(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s-+()]/g, '');
  // Matches mobile (98XXXXXXXX, 97XXXXXXXX) or with country code 977
  return /^(977)?(98\d{8}|97\d{8}|01\d{7})$/.test(cleaned);
}

/**
 * Validates 9-digit PAN/VAT number used in Nepal.
 */
export function validatePanNumber(pan: string): boolean {
  if (!pan) return false;
  const cleaned = pan.trim();
  return /^\d{9}$/.test(cleaned);
}

/**
 * Deep sanitization for user-submitted object properties.
 */
export function sanitizeObject<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === 'string'
        ? sanitizeText(item)
        : item && typeof item === 'object'
        ? sanitizeObject(item)
        : item
    ) as unknown as T;
  }
  
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof value === 'string') {
      result[key] = sanitizeText(value);
    } else if (value && typeof value === 'object') {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }
  
  return result as T;
}
