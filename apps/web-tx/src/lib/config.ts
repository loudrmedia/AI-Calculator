/**
 * Application configuration - TX version
 */

export const CONFIG = {
  // API endpoint for lead submission
  // In production with Cloudflare, this points to the Worker
  // In development, falls back to local API route
  API_URL: process.env.NEXT_PUBLIC_WORKER_URL || '/api/lead',

  // TODO(TX): This is still the CA (213) intake number, copied as a placeholder.
  // Update to the real TX intake number before launch.
  PHONE_NUMBER: '+1 213-674-5506',
  PHONE_LINK: 'tel:+12136745506',
};
