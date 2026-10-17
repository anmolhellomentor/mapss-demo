import type { GeocodedAddress } from './types';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
// Nominatim's usage policy requires an identifying User-Agent and at most 1 request/second.
const HEADERS = { 'User-Agent': 'hellomentor-maps-demo/0.1', 'Accept-Language': 'en' };

type NominatimPlace = {
  lat: string;
  lon: string;
  display_name: string;
  address?: Record<string, string | undefined>;
};

const firstOf = (address: Record<string, string | undefined>, keys: string[]): string =>
  keys.map((key) => address[key]).find(Boolean) ?? '';

const toGeocodedAddress = (place: NominatimPlace): GeocodedAddress => {
  const address = place.address ?? {};
  return {
    label: place.display_name,
    lat: Number(place.lat),
    lng: Number(place.lon),
    area: firstOf(address, ['suburb', 'neighbourhood', 'quarter', 'residential', 'road']),
    city: firstOf(address, ['city', 'town', 'village', 'county', 'state_district']),
    state: address.state ?? '',
    pincode: address.postcode ?? '',
  };
};

export const reverseGeocode = async (lat: number, lng: number): Promise<GeocodedAddress | null> => {
  const params = new URLSearchParams({ format: 'jsonv2', addressdetails: '1', lat: String(lat), lon: String(lng) });
  const response = await fetch(`${NOMINATIM_URL}/reverse?${params}`, { headers: HEADERS });
  if (!response.ok) return null;
  const place: NominatimPlace = await response.json();
  return place.lat ? toGeocodedAddress(place) : null;
};

export const searchPlaces = async (query: string): Promise<GeocodedAddress[]> => {
  const params = new URLSearchParams({ format: 'jsonv2', addressdetails: '1', countrycodes: 'in', limit: '5', q: query });
  const response = await fetch(`${NOMINATIM_URL}/search?${params}`, { headers: HEADERS });
  if (!response.ok) return [];
  const places: NominatimPlace[] = await response.json();
  return places.map(toGeocodedAddress);
};
