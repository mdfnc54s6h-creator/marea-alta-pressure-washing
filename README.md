# Marea Alta

Premium pressure washing concept for Santo Domingo, Dominican Republic.

## Run locally

- `npm run dev` starts Vite with hot reload.
- `npm run build` creates the production build in `dist/`.
- `npm run preview` serves the production build locally.

## Quote request delivery

The instant quote calculator works without a backend and builds a prefilled email draft as a fallback. Copy `.env.example` to `.env` and replace `VITE_LEAD_EMAIL` with the business inbox.

For direct form delivery, create a free form at [Formspree](https://formspree.io/), copy its endpoint into `VITE_LEAD_ENDPOINT` in `.env`, then restart the Vite server. The form sends the customer details, selected surfaces, home size, condition, and current estimate as `FormData`. Replace the Formspree URL with the client’s real endpoint before launch. Never commit `.env`.

The visible estimate is an illustrative planning range; update the surface rates and multipliers in `src/main.js` to match the client’s real pricing before publishing.
