import { useEffect, useState, type FormEvent } from 'react';
import { fetchAddresses, reverseGeocode, saveAddress } from './api';
import { MapPicker } from './components/MapPicker';
import { INDIAN_STATES } from './states';
import type { Address, AddressInput, GeocodedAddress, LatLng } from './types';

const BENGALURU: LatLng = { lat: 12.9716, lng: 77.5946 };

const EMPTY_ADDRESS: AddressInput = {
  area: '', house: '', city: '', state: '', pincode: '', landmark: '', lat: null, lng: null,
};

type TextField = Exclude<keyof AddressInput, 'lat' | 'lng' | 'state'>;

const TEXT_FIELDS: { name: TextField; label: string }[] = [
  { name: 'area', label: 'Area / Locality' },
  { name: 'house', label: 'House No. / Building' },
  { name: 'city', label: 'City' },
  { name: 'pincode', label: 'Pincode' },
  { name: 'landmark', label: 'Landmark' },
];

const matchState = (state: string): string =>
  INDIAN_STATES.find((option) => option.toLowerCase() === state.toLowerCase()) ?? '';

export const App = () => {
  const [address, setAddress] = useState<AddressInput>(EMPTY_ADDRESS);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [position, setPosition] = useState<LatLng>(BENGALURU);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    fetchAddresses().then(setSavedAddresses).catch((error: Error) => setStatusMessage(error.message));
  }, []);

  const applyGeocoded = (place: GeocodedAddress) => {
    setPosition({ lat: place.lat, lng: place.lng });
    setAddress((current) => ({
      ...current,
      area: place.area || current.area,
      city: place.city || current.city,
      state: matchState(place.state) || current.state,
      pincode: place.pincode || current.pincode,
      lat: place.lat,
      lng: place.lng,
    }));
  };

  const handlePick = async (picked: LatLng) => {
    setPosition(picked);
    setAddress((current) => ({ ...current, lat: picked.lat, lng: picked.lng }));
    setStatusMessage('Looking up address…');
    try {
      applyGeocoded(await reverseGeocode(picked.lat, picked.lng));
      setStatusMessage('');
    } catch {
      setStatusMessage('Could not find an address here. Fill the fields manually.');
    }
  };

  const updateField = (name: keyof AddressInput, value: string) =>
    setAddress((current) => ({ ...current, [name]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const saved = await saveAddress({ ...address, id: editingId });
      setSavedAddresses(await fetchAddresses());
      setEditingId(saved.id);
      setStatusMessage('Address saved.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Save failed');
    }
  };

  const editAddress = (saved: Address) => {
    setEditingId(saved.id);
    setAddress(saved);
    if (saved.lat !== null && saved.lng !== null) setPosition({ lat: saved.lat, lng: saved.lng });
  };

  const startNew = () => {
    setEditingId(undefined);
    setAddress(EMPTY_ADDRESS);
  };

  return (
    <main className="page">
      <form className="panel" onSubmit={handleSubmit}>
        <MapPicker position={position} onPick={handlePick} onSearchSelect={applyGeocoded} />

        <div className="grid">
          {TEXT_FIELDS.slice(0, 3).map(({ name, label }) => (
            <Field key={name} label={label}>
              <input value={address[name]} onChange={(event) => updateField(name, event.target.value)} required />
            </Field>
          ))}
          <Field label="State">
            <select value={address.state} onChange={(event) => updateField('state', event.target.value)} required>
              <option value="">Select state</option>
              {INDIAN_STATES.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </Field>
          {TEXT_FIELDS.slice(3).map(({ name, label }) => (
            <Field key={name} label={label}>
              <input
                value={address[name]}
                onChange={(event) => updateField(name, event.target.value)}
                required
                {...(name === 'pincode' && { inputMode: 'numeric', pattern: '\\d{6}', maxLength: 6 })}
              />
            </Field>
          ))}
        </div>

        <p className="hint">You can always correct the fields below. This does not change your Domicile State.</p>

        <div className="actions">
          {statusMessage && <span className="status">{statusMessage}</span>}
          {editingId && (
            <button type="button" className="secondary" onClick={startNew}>
              New address
            </button>
          )}
          <button type="submit">{editingId ? 'Update address' : 'Save address'}</button>
        </div>
      </form>

      <section className="panel">
        <h2>Saved addresses ({savedAddresses.length})</h2>
        {savedAddresses.map((saved) => (
          <button key={saved.id} type="button" className="saved-item" onClick={() => editAddress(saved)}>
            <strong>{saved.house}, {saved.area}</strong>
            <span>{saved.city}, {saved.state} {saved.pincode} · near {saved.landmark}</span>
          </button>
        ))}
      </section>
    </main>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="field">
    <span>
      {label}
      <em>*</em>
    </span>
    {children}
  </label>
);
