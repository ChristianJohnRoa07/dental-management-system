const staticErrorRegistry = {
  SERVER_ERROR: {
    code: 'SERVER_ERROR',
    message: 'An unexpected server error occurred. Please try again later.',
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Missing or invalid required fields.',
  },
  CONFLICT_ERROR: {
    code: 'CONFLICT_ERROR',
    message: 'Username or Email is already taken.',
  },
  AUTH_ERROR: {
    code: 'AUTH_ERROR',
    message: 'Invalid username or password.',
  },
  FORBIDDEN_ERROR: {
    code: 'FORBIDDEN_ERROR',
    message: 'Admin access required to manage resource.',
  },
  TOKEN_NOT_FOUND: {
    code: 'TOKEN_NOT_FOUND',
    message: 'Token not found or has already been used.',
  },
  INVALID_TOKEN: {
    code: 'INVALID_TOKEN',
    message: 'Invalid token payload or expired.',
  },
  VERIFICATION_TOKEN_EXPIRED: {
    code: 'VERIFICATION_TOKEN_EXPIRED',
    message: 'Verification link has expired. Please request a new one.',
  },
} as const;

export const ERROR_CODES = Object.fromEntries(
  Object.entries(staticErrorRegistry).map(([key, value]) => [key, value.code])
) as { [K in keyof typeof staticErrorRegistry]: typeof staticErrorRegistry[K]['code'] };

export const ERROR_MESSAGES = Object.fromEntries(
  Object.entries(staticErrorRegistry).map(([key, value]) => [key, value.message])
) as { [K in keyof typeof staticErrorRegistry]: typeof staticErrorRegistry[K]['message'] };

export type EntityType = 'Patient' | 'Appointment' | 'Procedure' | 'User';

export const MIME_TYPES = {
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.gif':  'image/gif',
  '.pdf':  'application/pdf',
} as const;

export const DYNAMIC_ERRORS = {
  NOT_FOUND: (entity: EntityType) => ({
    code: 'NOT_FOUND_ERROR',
    message: `${entity} could not be found or does not exist.`,
  }),
} as const;


export type StaticErrorKey = keyof typeof staticErrorRegistry;
export type ErrorCode = typeof ERROR_CODES[StaticErrorKey] | 'NOT_FOUND_ERROR';