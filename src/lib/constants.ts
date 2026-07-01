export const ERROR_CODES = {
  SERVER_ERROR: 'SERVER_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VERIFICATION_TOKEN_ERROR: 'VERIFICATION_TOKEN_ERROR',
} as const;

export const ERROR_MESSAGES = {
  SERVER_ERROR: 'An unexpected server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Missing or invalid required fields.',
  CONFLICT_ERROR: 'Username or Email is already taken.',
  AUTH_ERROR: 'Invalid username or password.',
  VERIFICATION_TOKEN_NOT_FOUND: 'Token not found or has already been used.',
  VERIFICATION_TOKEN_NOT_EXPIRED: 'Verification link has expired. Please request a new one.'
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];