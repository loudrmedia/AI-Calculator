/**
 * Application configuration
 */

export const CONFIG = {
  // API endpoint for lead submission
  // In production with Cloudflare, this points to the Worker
  // In development, falls back to local API route
  API_URL: process.env.NEXT_PUBLIC_API_URL || '/api/lead',
  
  // Phone number for calls
  PHONE_NUMBER: '+1 213-674-5506',
  PHONE_LINK: 'tel:+12136745506',
};
