# Marea Alta

A one-page pressure washing website concept for Santo Domingo, Dominican Republic.
The visual system, contact details, package prices, social handles, and domain are sample values and must be matched to the actual business before launch.

## Run locally

- `npm install` installs dependencies.
- `npm run dev` starts Vite with hot reload (usually `http://localhost:5173`).
- `npm run build` creates the production build in `dist/`.
- `npm run preview` serves the production build locally.

## Build and deploy

Netlify uses [netlify.toml](netlify.toml): build command `npm run build`, publish folder `dist/`. Connect the GitHub repository to Netlify for deploy previews and production deploys, or install/authenticate the Netlify CLI and run `npx netlify deploy` for a preview. Use `npx netlify deploy --prod` only when the client is ready to publish.

Set `VITE_LEAD_ENDPOINT` in Netlify’s environment variables to the client’s Formspree endpoint to send quote requests directly. If unset, the form creates a prefilled email draft to the `VITE_LEAD_EMAIL` recipient. Copy `.env.example` to `.env` for local configuration. Never commit `.env` or endpoint credentials.

## Customize before launch

- **Brand:** Change the brand name, phone, service area, package text, social links, and footer in `src/main.js`. Replace `public/marea-alta-mark.svg` and `public/marea-alta-social.svg` with the client’s logo and share image. Update the LocalBusiness JSON-LD and Open Graph URLs in `index.html` to the verified live domain, and confirm every phone, service-area, insurance, and social profile detail.
- **Colors and type:** Edit the CSS custom properties at the top of `src/styles.css`. They control the navy background, panel colors, soap-yellow accent, text colors, typefaces, spacing, and radii.
- **Images:** Replace the clearly named files in `public/images/` with licensed, same-framing before/after photography. Keep the filenames or update their references in `src/main.js`. The current SVG files are visual placeholders, not job photos. Image prompts are in `docs/image-prompts.md`.
- **Prices:** Edit the surface cost model in `updateQuote()` in `src/main.js` and the three package starting prices in the packages section in that file. Keep the package prices in the JSON-LD `makesOffer` list in `index.html` in sync. Confirm the currency and local tax treatment with the client.
- **Form endpoint:** See “Build and deploy.” The form currently supports Formspree via `VITE_LEAD_ENDPOINT`, plus a mailto fallback. Replace the example email with the business inbox.

## Quality checks

Run `npm run build`, then check the page at 390px and 1440px. The `output/playwright/` folder contains recent viewport captures.
