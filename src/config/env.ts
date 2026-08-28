declare global {
  interface Window {
    __ENV__?: Record<string, string | undefined>
  }
}

/**
 * Runtime env (EC2 / Docker compose via /env.js) with Vite .env fallback for local dev.
 */
export function getEnv(key: string): string {
  const runtime = typeof window !== 'undefined' ? window.__ENV__?.[key] : undefined
  if (runtime != null && runtime !== '') {
    return runtime.trim()
  }
  const buildTime = import.meta.env[key]
  return typeof buildTime === 'string' ? buildTime.trim() : ''
}

export const env = {
  apiUrl: () => getEnv('VITE_API_URL'),
  googleMapsApiKey: () => getEnv('VITE_PUBLIC_GOOGLE_MAPS_API_KEY'),
  technicianAccessToken: () => getEnv('VITE_TECHNICIAN_USER_ACCESS_TOKEN'),
  technicianRefreshToken: () => getEnv('VITE_TECHNICIAN_USER_REFRESH_TOKEN'),
  invoiceAccessToken: () => getEnv('VITE_INVOICE_ACCESS_TOKEN'),
  b2bUrl: () => getEnv('VITE_B2B_URL'),
  ecommerceApiUrl: () => getEnv('VITE_ECOMMERCE_API_URL'),
}
