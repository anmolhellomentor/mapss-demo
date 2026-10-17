# Address map demo

A map-based address form for searching Indian locations, selecting a point on a map, reverse-geocoding it, and saving or editing addresses.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- Internet access for OpenStreetMap tiles and Nominatim geocoding

## Quick start

Clone the repository and run the initializer from the project root:

```bash
git clone https://github.com/anmolhellomentor/mapss-demo.git
cd mapss-demo
npm run init
```

This installs the locked backend and frontend dependencies when needed, then starts both development servers. Open [http://localhost:5173](http://localhost:5173). Stop the servers with `Ctrl+C`.

To install dependencies without starting the servers, run `npm run setup`. To start the servers afterward, run `npm run dev`. The backend and frontend can also be built with `npm run build`.

## Project layout

- `frontend/` — Vite, React, and React Leaflet UI on port 5173. Its `/api` requests are proxied to the backend.
- `backend/` — Next.js API service on port 3001. Address records are stored locally in `backend/data/addresses.json`; a fresh clone starts with an empty store.
- `scripts/` — setup-and-run and development server scripts.
- [`docs/API.md`](docs/API.md) — API endpoints and response format.

Saved addresses are local demo data, not a production database. The address store is excluded from version control and should not be used for sensitive information.
