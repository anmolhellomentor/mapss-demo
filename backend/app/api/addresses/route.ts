import { fail, ok } from '@/lib/respond';
import { readAddresses, saveAddress } from '@/lib/store';
import { parseAddressInput } from '@/lib/validate';

export const GET = async () => ok(await readAddresses());

export const POST = async (request: Request) => {
  const body: unknown = await request.json().catch(() => null);
  const { input, errors } = parseAddressInput(body);
  if (!input) return fail('Invalid address', 400, errors);

  const id = typeof body === 'object' && body && 'id' in body && typeof body.id === 'string' ? body.id : undefined;
  return ok(await saveAddress(input, id), 'Address saved', id ? 200 : 201);
};
