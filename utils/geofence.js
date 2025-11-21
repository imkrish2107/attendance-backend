// backend_node/utils/geofence.js
// Utility functions for geofencing (Haversine distance etc.)

/**
 * Convert degrees to radians
 * @param {number} deg
 * @returns {number}
 */
function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Haversine formula to compute distance between two lat/lng points in meters
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} distance in meters
 */
function distanceMeters(lat1, lon1, lat2, lon2) {
  lat1 = Number(lat1);
  lon1 = Number(lon1);
  lat2 = Number(lat2);
  lon2 = Number(lon2);

  if (
    Number.isNaN(lat1) ||
    Number.isNaN(lon1) ||
    Number.isNaN(lat2) ||
    Number.isNaN(lon2)
  ) {
    throw new Error("Invalid lat/lng provided to distanceMeters");
  }

  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Check if given lat/lng is within radius (meters) of a location object.
 * location can be { lat, lng, radius } OR (lat, lng, radius) parameters can be supplied
 *
 * Usage:
 *   isWithinRadius(userLat, userLng, { lat: 12.9, lng: 80.1, radius: 50 })
 *
 * @param {number} userLat
 * @param {number} userLng
 * @param {object|number} locationOrLat - object or number (targetLat)
 * @param {number} [maybeLng] - (targetLng) if passing numbers
 * @param {number} [maybeRadius] - radius in meters if passing numbers
 * @returns {boolean}
 */
function isWithinRadius(userLat, userLng, locationOrLat, maybeLng, maybeRadius) {
  let targetLat, targetLng, radius;

  if (
    typeof locationOrLat === "object" &&
    locationOrLat !== null &&
    "lat" in locationOrLat
  ) {
    targetLat = Number(locationOrLat.lat);
    targetLng = Number(locationOrLat.lng || locationOrLat.lon || locationOrLat.longitude);
    radius = Number(locationOrLat.radius || locationOrLat.rad || 0);
  } else {
    targetLat = Number(locationOrLat);
    targetLng = Number(maybeLng);
    radius = Number(maybeRadius || 0);
  }

  const d = distanceMeters(userLat, userLng, targetLat, targetLng);
  return d <= radius;
}

/**
 * Given an array of location objects [{ _id?, id?, name?, lat, lng, radius }, ...]
 * returns the nearest location and distance in meters
 *
 * @param {number} userLat
 * @param {number} userLng
 * @param {Array<object>} locations
 * @returns {{ location: object|null, distance: number|null }}
 */
function nearestLocation(userLat, userLng, locations = []) {
  if (!Array.isArray(locations) || locations.length === 0) {
    return { location: null, distance: null };
  }

  let best = null;
  let bestDist = Infinity;

  for (const loc of locations) {
    const lat = Number(loc.lat);
    const lng = Number(loc.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) continue;
    const d = distanceMeters(userLat, userLng, lat, lng);
    if (d < bestDist) {
      bestDist = d;
      best = loc;
    }
  }

  return { location: best, distance: bestDist === Infinity ? null : bestDist };
}

/**
 * Check if inside ANY of the provided locations (returns matched location or null)
 * @param {number} userLat
 * @param {number} userLng
 * @param {Array<object>} locations
 * @returns {object|null} matched location (first that matches)
 */
function findContainingLocation(userLat, userLng, locations = []) {
  for (const loc of locations) {
    try {
      if (isWithinRadius(userLat, userLng, loc)) return loc;
    } catch (err) {
      // ignore invalid loc
      continue;
    }
  }
  return null;
}

module.exports = {
  toRad,
  distanceMeters,
  isWithinRadius,
  nearestLocation,
  findContainingLocation,
};
