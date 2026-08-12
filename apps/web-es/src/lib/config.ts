/**
 * Application configuration
 */

export const CONFIG = {
  // API endpoint for lead submission
  // In production with Cloudflare, this points to the Worker
  // In development, falls back to local API route
  API_URL: process.env.NEXT_PUBLIC_WORKER_URL || '/api/lead',
  
  // Phone number for calls
  // TODO: inherited from the CA site. Swap in the Spanish-language intake number
  // (and its own CallRail company, if call tracking should be split by language).
  PHONE_NUMBER: '+1 213-674-5506',
  PHONE_LINK: 'tel:+12136745506',
};
