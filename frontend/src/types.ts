export type ApiResponse<T> = {
  success: boolean;
  code: string;
  status: number;
  message: string;
  data: T;
  errors: string[];
};

export type AddressInput = {
  area: string;
  house: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  lat: number | null;
  lng: number | null;
};

export type Address = AddressInput & { id: string; updatedAt: string };

export type GeocodedAddress = Pick<AddressInput, 'area' | 'city' | 'state' | 'pincode'> & {
  label: string;
  lat: number;
  lng: number;
};

export type LatLng = { lat: number; lng: number };
