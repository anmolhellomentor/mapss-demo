import type { Address, AddressInput, ApiResponse, GeocodedAddress } from './types';

const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, init);
  const body: ApiResponse<T> = await response.json();
  if (!body.success) throw new Error([body.message, ...body.errors].join(': '));
  return body.data;
};

export const fetchAddresses = (): Promise<Address[]> => request('/api/addresses');

export const saveAddress = (address: AddressInput & { id?: string }): Promise<Address> =>
  request('/api/addresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(address),
  });

export const reverseGeocode = (lat: number, lng: number): Promise<GeocodedAddress> =>
  request(`/api/geocode/reverse?lat=${lat}&lng=${lng}`);

export const searchPlaces = (query: string): Promise<GeocodedAddress[]> =>
  request(`/api/geocode/search?q=${encodeURIComponent(query)}`);
