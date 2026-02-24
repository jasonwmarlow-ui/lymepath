# LymePath

LymePath is a focused React app starter for organizing health-related action pathways.
It includes a clean feature baseline with filtering, sorting, and test coverage.

## Stack

- React 19
- Create React App scripts
- Testing Library + Jest

## Run Locally

```bash
npm install
npm start
```

App runs at [http://localhost:3000](http://localhost:3000).

To use a backend API, create `.env.local`:

```bash
cp .env.example .env.local
```

Set `REACT_APP_PATHWAYS_API_URL` to your endpoint before starting the app.

## Scripts

- `npm start`: launch development server
- `npm test`: run tests
- `npm run build`: create production build

## Project Structure

- `src/App.js`: top-level composition and UI controls
- `src/api/pathwaysApi.js`: fetches pathways from `/pathways.json` with fallback
- `src/components/`: reusable UI components
- `src/hooks/`: behavior and state management hooks
- `src/data/`: seed data for pathway cards
- `public/pathways.json`: API-like static payload used by the app

## Data Behavior

- App fetches pathways from `REACT_APP_PATHWAYS_API_URL` when configured.
- Default endpoint is `/pathways.json` when no env var is set.
- If fetch fails, it falls back to local seed data in `src/data/pathways.js`.
- Filter state is persisted in `localStorage` under `lymepath.filters`.
- API response can be either an array of pathways or `{ "pathways": [...] }`.

## Next Changes You Can Add

- Replace local `src/data/pathways.js` data with API-backed data.
- Persist filter preferences in local storage.
- Add route-level pages for dashboard and details.
