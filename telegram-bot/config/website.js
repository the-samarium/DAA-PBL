/**
 * Website Configuration
 * Centralized website URLs for redirects
 */

// Base URL for the Next.js application
// Update this when deploying to production
export const WEBSITE_BASE_URL = process.env.WEBSITE_BASE_URL || 'http://localhost:3000';

export const WEBSITE_ROUTES = {
  checkout: (harvesterId = null) => {
    return harvesterId 
      ? `${WEBSITE_BASE_URL}/checkout?harvesterId=${harvesterId}`
      : `${WEBSITE_BASE_URL}/checkout`;
  },
  myBookings: `${WEBSITE_BASE_URL}/dashboard/my-rented-equipments`,
  history: `${WEBSITE_BASE_URL}/history`,
  harvesters: `${WEBSITE_BASE_URL}/home/harvesters`
};

