import { reverseGeocode } from '@/lib/nominatim';
import { fail, ok } from '@/lib/respond';

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get('lat'));
  const lng = Number(searchParams.get('lng'));
  if (!searchParams.get('lat') || !searchParams.get('lng') || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return fail('lat and lng are required numbers', 400);
  }

  const address = await reverseGeocode(lat, lng);
  return address ? ok(address) : fail('No address found for this point', 404);
};
