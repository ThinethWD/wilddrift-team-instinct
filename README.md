# WildDrift Team Instinct — animated separate games (3.0)

## Deploy in this order

### 1. Apply the team limit to your existing Supabase project

Open `supabase/team-limit-10.sql` from this ZIP in a text editor. Copy its entire contents into **Supabase → SQL Editor → New query** and click **Run**.

This adds and backfills a member counter and installs a membership trigger. It preserves existing participants, teams, reports and admin accounts. It is safe to rerun. Do NOT rerun the original `setup.sql`, clear the database, or create a new project.

The maximum is **10 registered members, including the creator**. Participants still playing count toward the limit. The limit applies both to people joining at registration and to those joining after receiving their report. Atomic database increments prevent competing joins from claiming the same final place. Removing a participant from a team frees a place.

Existing teams already above 10 are preserved and cannot accept new members while at or above 10. No people are automatically removed.

### 2. Upload the site update to GitHub

At the **root/main folder** of your existing repository, select **Add file → Upload files**. Drag in the extracted **public**, **lib**, **test** and **supabase** folders, plus **README.md**. Commit them together.

The ZIP is a patch: upload its contents without deleting the other repository files. Keep the folder structure. Do not create `public/public` or leave suffixes such as `(1)` on filenames. The `public/vendor` folder must be included: it contains the self-hosted GSAP animation library.

Uploading the SQL file to GitHub does not execute it; step 1 in Supabase is required.

### 3. Verify the deployment

Wait for the latest Vercel Production deployment to show **Ready**. Open the site in a private window and register a test participant. You should see **Four games**, the Mystery Box, Build Your Crew, Broken Bridge and Victory Wall. There is no sample button or participant demo mode. Existing completed participants resume their stored reports; use a new test WhatsApp number if you need a new full run.

No new API keys, environment variables, npm dependencies or Vercel settings are needed. Keep `DEMO_MODE=false`; if your existing environment has it set to true, change it to false and redeploy. The app deliberately blocks live registration when server storage is disabled, rather than silently creating a sample.

## What changed

- Four separate mini-games replace the shared launch story.
- Vector illustrations and GSAP sequences replace emoji-only scenes.
- Mystery Box: the lid opens and the selected tool appears.
- Build Your Crew: illustrated characters arrive in the selected seats; tap and desktop drag-and-drop both work.
- Broken Bridge: detour, new crossing, coordination or inspection appears according to the labelled choice.
- Victory Wall: the chosen badge lands, followed by a brief confetti burst.
- Reduced-motion users see the same selected states without decorative animation.
- Participant sample access, `?demo=1` bypass, and public fictional admin workspace are removed. Normal participant registration and authenticated admin sign-in remain.
- Team lookup shows member counts and full status; database errors are translated into a clear full-team message.
- Reports now interpret the actual choices from four independent games. The deeper structure and white-on-navy report header remain.
- Completed older reports are preserved. Older unfinished journeys restart with the new games in the same participant record.
- The large introductory panel is hidden while playing or reading reports on phones, keeping the activity closer to the top of the page.

The three fictional crew seats are part of the mini-game; the ten-person limit applies to the real registered team, not those fictional seats.

## Updated files

`public/app.js`, `public/model.js`, `public/ui.js`, `public/admin.js`, `public/styles.css`, `public/index.html`, `public/admin.html`, new `public/animations.js`, new `public/vendor/gsap.min.js`, `lib/backend.js`, three `test/*.test.mjs` files, new `supabase/team-limit-10.sql`, and this README.

The patch does not replace the original database setup, package configuration, API handler or Vercel configuration. GSAP 3.13.0 is self-hosted and retains its upstream copyright and standard-license notice in the supplied vendor file. No animation-library account is required.

## Checks

`npm test` verifies model, API, journey, old-result compatibility, report evidence and full-team messages; `npm run build` uses the existing build configuration.

The SQL migration was executed against a local PostgreSQL-compatible engine: counter backfill, tenth/eleventh registration, competing last-slot requests, later joining, deletion freeing a slot, idempotent joining, transfers, creator inclusion, cross-event checks and rerunning the migration were tested.

Browser checks use fictional local registrations and mocked API endpoints. They verify GSAP loading under the production content-security policy, the four animated games, report rendering, sample removal, full-team controls, white report header, reduced motion and narrow layouts. These checks do not replace a live Supabase/OpenAI test.

After deployment, check one live individual journey and two live team members, then verify the team count in the admin workspace. Review PDF preview before saving as PDF, as before.
