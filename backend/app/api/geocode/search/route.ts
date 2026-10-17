import { searchPlaces } from '@/lib/nominatim';
import { fail, ok } from '@/lib/respond';

const MIN_QUERY_LENGTH = 3;

export const GET = async (request: Request) => {
  const query = new URL(request.url).searchParams.get('q')?.trim() ?? '';
  if (query.length < MIN_QUERY_LENGTH) return fail(`q must be at least ${MIN_QUERY_LENGTH} characters`, 400);
  return ok(await searchPlaces(query));
};
