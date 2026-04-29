/**
 * Nominatim Geocoding Utility
 *
 * Centralized geocoding module for OpenStreetMap Nominatim API.
 * Implements 1100ms debounce to respect Nominatim's 1 req/sec rate limit.
 * Client-side compatible — uses only standard browser APIs (fetch, Promise, Date).
 *
 * Usage in Astro <script> blocks:
 *   import { geocodeAddress } from '@/lib/geo';
 *   const coords = await geocodeAddress('Dili, Timor-Leste');
 */

export type GeocodeResult = { lat: number; lng: number } | null;

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';
const DEBOUNCE_MS = 1100;

let lastCallTime = 0;

// For testing only — resets debounce state between test runs
export function __resetGeoState() {
  lastCallTime = 0;
}

/**
 * Validate that latitude and longitude are within valid ranges.
 * Latitude must be between -90 and 90.
 * Longitude must be between -180 and 180.
 */
export function validateCoordinates(lat: number, lng: number): boolean {
  if (isNaN(lat) || isNaN(lng)) return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  return true;
}

/**
 * Calculate distance between two points using Haversine formula.
 * Returns distance in kilometers.
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Geocode an address string to lat/lng using OpenStreetMap Nominatim.
 * Implements debouncing: if called within 1100ms of the last call, waits out the remaining time.
 *
 * @param address - The address to geocode (e.g. "Dili" or "Aileu, Timor-Leste")
 * @returns { lat, lng } on success, null on failure or no results
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const now = Date.now();
  const elapsed = now - lastCallTime;

  // Debounce: wait out remaining time if called within DEBOUNCE_MS of last call
  if (elapsed < DEBOUNCE_MS) {
    await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_MS - elapsed));
  }

  lastCallTime = Date.now();

  const url = `${NOMINATIM_BASE}?format=json&q=${encodeURIComponent(address + ', Timor-Leste')}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': 'TIMORLIST/1.0' },
    });
  } catch {
    // Network error
    return null;
  }

  if (!response.ok) {
    return null;
  }

  let results: Array<{ lat: string; lon: string }>;
  try {
    results = await response.json();
  } catch {
    return null;
  }

  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  const first = results[0];
  return {
    lat: parseFloat(first.lat),
    lng: parseFloat(first.lon),
  };
}
