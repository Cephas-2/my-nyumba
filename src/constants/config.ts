// App-wide settings. Nothing here is Kenya-specific in the architecture:
// change currency/locale here (later: per-user or per-property from Supabase).
export const APP_CONFIG = {
  name: 'My Nyumba',
  tagline: 'Your home. Your rent. Your relationship.',
  currency: { code: 'KES', symbol: 'KSh' },
  locale: 'en-GB',
  supportEmail: 'support@mynyumba.app',
  supportPhone: '+254 700 000 000',
} as const;
