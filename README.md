<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/0814b490-4eb7-4046-9504-b524f4449abb

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` builds the app and publishes `dist/` to GitHub Pages on every push to `main` (it can also be run manually from the Actions tab).

One-time setup: in **Settings → Pages**, set **Source** to **GitHub Actions**.

The site will be available at `https://<owner>.github.io/<repo>/`.

## Development

- `npm run dev`: start the dev server
- `npm test`: run the unit tests (game rules in `src/game/`)
- `npm run lint`: type-check
- `npm run build:dictionaries`: regenerate the word lists in `src/dictionaries/`

Code layout: `src/App.tsx` is the app shell (settings, stats, dialogs, mode switching); each game mode lives in `src/modes/`; UI text is in `src/i18n/`.
