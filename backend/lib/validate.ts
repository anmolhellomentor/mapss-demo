import type { AddressInput } from './types';

const PINCODE_PATTERN = /^\d{6}$/;
const REQUIRED_FIELDS = ['area', 'house', 'city', 'state', 'pincode', 'landmark'] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toCoordinate = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

export const parseAddressInput = (
  body: unknown
): { input: AddressInput; errors: [] } | { input: null; errors: string[] } => {
  if (!isRecord(body)) return { input: null, errors: ['Body must be a JSON object'] };

  const errors: string[] = [];
  const text = (field: (typeof REQUIRED_FIELDS)[number]): string => {
    const value = body[field];
    if (typeof value !== 'string' || !value.trim()) {
      errors.push(`${field} is required`);
      return '';
    }
    return value.trim();
  };

  const input: AddressInput = {
    area: text('area'),
    house: text('house'),
    city: text('city'),
    state: text('state'),
    pincode: text('pincode'),
    landmark: text('landmark'),
    lat: toCoordinate(body.lat),
    lng: toCoordinate(body.lng),
  };

  if (input.pincode && !PINCODE_PATTERN.test(input.pincode)) errors.push('pincode must be 6 digits');

  return errors.length ? { input: null, errors } : { input, errors: [] };
};
