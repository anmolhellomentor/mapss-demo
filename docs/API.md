# API reference

The API is served by the backend at `http://localhost:3001`. When using the Vite frontend, its `/api` proxy forwards requests to that backend.

All responses use the same envelope:

```json
{
  "success": true,
  "code": "OK",
  "status": 200,
  "message": "OK",
  "data": {},
  "errors": []
}
```

Error responses set `success` to `false`, provide a message and errors, and set `data` to `null`.

## `GET /api/addresses`

Returns all locally saved addresses. An empty store returns an empty array.

## `POST /api/addresses`

Creates an address, or updates one when an existing `id` is included.

```json
{
  "area": "Indiranagar",
  "house": "10 Main Road",
  "city": "Bengaluru",
  "state": "Karnataka",
  "pincode": "560038",
  "landmark": "Metro station",
  "lat": 12.9784,
  "lng": 77.6408
}
```

`area`, `house`, `city`, `state`, `pincode`, and `landmark` are required strings; `pincode` must be six digits. `lat` and `lng` may be numbers or `null`. An update includes the returned `id`. Creates return HTTP 201; updates return HTTP 200.

## `GET /api/geocode/search?q=...`

Searches Indian locations using OpenStreetMap Nominatim. The `q` parameter must contain at least three characters. Returns up to five matches.

## `GET /api/geocode/reverse?lat=...&lng=...`

Looks up an address for the supplied latitude and longitude. Both parameters must be finite numbers.

Geocoding uses the public Nominatim service and is subject to its availability and usage policy. Do not use this demo's geocoding setup for high-volume production traffic.
