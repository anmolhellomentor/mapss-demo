import { randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Address, AddressInput } from './types';

const DATA_FILE = path.join(process.cwd(), 'data', 'addresses.json');

export const readAddresses = async (): Promise<Address[]> => {
  let raw: string;
  try {
    raw = await readFile(DATA_FILE, 'utf8');
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return [];
    throw error;
  }
  const parsed: unknown = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
};

const writeAddresses = async (addresses: Address[]): Promise<void> => {
  await writeFile(DATA_FILE, JSON.stringify(addresses, null, 2));
};

export const saveAddress = async (input: AddressInput, id?: string): Promise<Address> => {
  const addresses = await readAddresses();
  const address: Address = { ...input, id: id ?? randomUUID(), updatedAt: new Date().toISOString() };
  const index = addresses.findIndex((existing) => existing.id === address.id);
  if (index === -1) addresses.push(address);
  else addresses[index] = address;
  await writeAddresses(addresses);
  return address;
};
