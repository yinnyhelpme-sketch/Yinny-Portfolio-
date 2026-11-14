# Yinny Portfolio — Next.js + Vercel

A dark, blue-accented portfolio rebuilt from the existing Carrd portfolio structure.

## Included pages
- `/` — About, management experience, strengths, availability, and contact section.
- `/tools` — Sapphire, Dyno, and Discohook overview with official links.
- `/discord-server` — Separate documentation page with placeholders for the two existing document links.
- `/games` — Roblox public game statistics dashboard with current players, lifetime visits, and favorites.

## Before deploying
1. Replace `hello@example.com` in `app/components.tsx` and `app/page.tsx` with the preferred contact email (or replace the mailto links with a social profile).
2. In `app/discord-server/page.tsx`, replace the two `#` document links with the actual Google Docs or file URLs.
3. Review the About and experience wording and adjust any details that have changed since the Carrd version.

## Run locally
Install Node.js 18.17 or newer, then run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel
1. Create a new Git repository and upload the contents of this folder.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Keep the detected Next.js settings and select **Deploy**.
4. Add a custom domain in the Vercel project settings if desired.

## Roblox game statistics
The `/games` page loads public experiences from Roblox group ID `212251875` and accepts additional direct Roblox game-page URLs. It retrieves the group's public experience list using Roblox's group games endpoint, follows pagination, then reads public aggregate experience details. The dashboard refreshes every 60 seconds while open. The two supplied `share?code=...&type=ExperienceDetails` links could not be resolved by the available public page fetcher; open each link and copy the resulting regular `/games/PLACE_ID/...` URL into the dashboard. It does not expose private player information or private creator analytics. Roblox may rate-limit public requests or change its endpoints.

No environment variables are required for this starter portfolio.
