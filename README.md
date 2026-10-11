# WildDrift Team Instinct

A mobile-first conference experience with four workplace activities, 12 scored decisions, a final reflection, individual DISC-inspired snapshots and company-based teams. Prepared for **GitHub + Vercel + Supabase + OpenAI**.

## What is included

- Your supplied WildDrift logo; navy, white and red; Anton headings and Roboto body text.
- Name, company and WhatsApp registration; optional team code and team-name confirmation.
- Three colleague cards selected from six, branching curveball scenario, and group-chat activity.
- Equal-weight, server-calculated scoring; primary, blended, tied and balanced result handling.
- OpenAI Responses API report writing with structured output and `store: false`.
- Scoring-guide fallback if the AI service is unavailable. The result source is visible to admins and the participant is told when the scoring guide was used.
- Resume on the same browser, revision of choices before completion, one saved participant per WhatsApp number per event.
- Automatic company-based team names. Codes use two uppercase letters plus three numbers, e.g. AB007. Database uniqueness and retry handling prevent collisions.
- Team creation includes the creator automatically. Joining is available at registration or after completion. One team per participant per event.
- Private admin access restricted to **thineth@361.lk** by default.
- Individual report access, participant CSV export, combined-team generation, printable individual/team PDFs, WhatsApp draft link and a manual “mark as sent” action.
- Sample participant and admin experiences for reviewing without connected services.

This is a custom **DISC-inspired reflection**, not a validated psychometric assessment. It should not be used to make hiring, diagnosis or individual performance decisions.

## Current status

The source, schema and deployment configuration are complete. Build, JavaScript syntax and 16 automated scoring/API tests passed. These tests mock external services; real Supabase, OpenAI and Vercel connections have NOT been tested or provisioned. Browser visual/interaction QA was unavailable in this environment. Run the acceptance checklist below on iPhone Safari and Android Chrome before inviting real participants.

No GitHub repository or live deployment has been created. No secrets are included.

## 1. Create the Supabase project

1. In your Supabase account, create a new project for WildDrift Team Instinct. Keep it separate from your scoring portal.
2. Open **SQL Editor**, create a new query and run the complete contents of `supabase/setup.sql` **once**. This creates the database tables and transaction functions.
3. In **Authentication → Users**, add a user with email **thineth@361.lk**, a strong password and email confirmation enabled. Use Supabase’s current “Add user”/“Create user” action. Do not enable public admin signup.
4. From your project’s connection/API settings, obtain:
   - Project URL → `SUPABASE_URL`
   - Public anon/publishable API key → `SUPABASE_ANON_KEY`
   - Server-only service-role/secret API key → `SUPABASE_SERVICE_ROLE_KEY`
5. The app’s database records have Row Level Security enabled and no browser read/write grants. Only the server uses the privileged key. Never prefix the privileged key with `NEXT_PUBLIC_` or expose it in GitHub.

If you run the SQL again and see “already exists”, stop: do not delete existing tables. The setup is for a fresh project, not a destructive reset.

## 2. Add the code to GitHub

1. Create a **private**, empty GitHub repository named `wilddrift-team-instinct`.
2. Extract this package. Upload the contents of the `wilddrift-team-instinct` folder into the repository root, preserving the `public`, `api`, `lib`, `supabase`, `dev` and `test` directories.
3. The repository root must contain `package.json` and `vercel.json`, not another enclosing project folder.
4. Include `.env.example` and `.gitignore`. Never upload a filled `.env.local` file or an API key.

With Git installed, the equivalent is to initialise Git in the extracted project folder, commit the files, add your new repository as origin and push. The package deliberately has no production npm dependencies.

## 3. Deploy to Vercel

1. Add a new Vercel project and import that GitHub repository.
2. Choose **Other** as the framework. Use:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: 22.x
   - Repository root: the directory containing `package.json`
3. Add the following environment variables to the **Production** environment. If you also test preview deployments, configure them separately with a test event/database and the correct preview URL.

| Variable | Value |
| --- | --- |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only privileged Supabase key |
| `SUPABASE_ANON_KEY` | Your public Supabase key; used server-side for admin authentication |
| `OPENAI_API_KEY` | OpenAI project API key |
| `OPENAI_MODEL` | A Responses API model with structured-output support enabled for your OpenAI project |
| `ADMIN_EMAILS` | `thineth@361.lk` |
| `EVENT_ID` | `conference-2026` or a unique ID for this event |
| `EVENT_NAME` | Your event’s display name |
| `APP_URL` | Exact HTTPS production origin, such as `https://your-project.vercel.app` |
| `DEMO_MODE` | `false` |
| `REGISTRATION_HOURLY_LIMIT` | `300` initially; per shared IP per hour |

4. If you do not yet know the Vercel URL, deploy once to obtain it, set `APP_URL`, then **redeploy**. Registration rejects requests from another origin. Choose one canonical domain, redirect alternative domains to it and use it for the QR code.
5. Do not leave `DEMO_MODE=true` for the conference: that mode deliberately does not save server records.
6. Open `/admin` and sign in using the Supabase admin user created earlier.

The OpenAI API key belongs to an OpenAI Platform project. API usage is billed separately from a ChatGPT subscription. Configure your project’s usage/budget settings and choose an available model before enabling live reports. This build does not depend on a particular model name; it is set through `OPENAI_MODEL`.

### Live versus sample mode

- With working Supabase credentials, normal registration saves records in Supabase.
- Without the database configuration, normal registration stays disabled and a sample experience is offered.
- “Try a sample experience” uses fictional details, local browser storage and scoring-guide reports. It never contacts the AI API or saves participants on the server.
- In a sample join flow, use `AB482`.
- An admin can explore fictional sample records without signing in; no real records are returned.
- Missing AI configuration or an AI error uses the scoring-guide fallback. Check `report_source` in the admin workspace and configure both AI variables before the event.

## Local review

Install Node 22 or newer. No npm dependency installation is required.

```
npm test
npm run build
npm run dev
```

Open `http://localhost:3000`. Without `.env.local`, only sample interactions are available. To test the database locally, copy `.env.example` to `.env.local`, fill it privately, and set `APP_URL=http://localhost:3000`.

## Conference acceptance checklist

1. **Individual journey:** Register a test number, play all four challenges, select three colleagues, revise an earlier answer, refresh midway and confirm progress resumes. Finish, copy the snapshot and save a PDF. Refresh after completion and confirm the saved report returns. Confirm an attempted duplicate registration cannot reveal the original report.
2. **Team journey:** Create a team after completion. Confirm its name matches the creator’s company and its code has two letters plus three numbers. On a second device, enter the code, check the displayed team name, confirm and finish. Test joining after an individual snapshot. Confirm another company can have a separate team without a name collision. A team needs at least two completed members for a combined report.
3. **Admin journey:** Verify an unauthorised person cannot see real records. Sign in as the allowed admin, view individual reports, export CSV, generate a combined report and save its PDF. Complete another teammate and confirm the report is marked out of date. Update it, open the WhatsApp draft, manually attach the PDF and send it, then mark it sent.

Also test unreadable/invalid team codes, invalid phone numbers, a brief network outage, blocked clipboard permissions and the AI fallback. PDF buttons open the browser print dialog: choose **Save as PDF** or the phone’s print/share-to-PDF option. This is not an automatic server PDF attachment service.

## Operating rules

- Team codes enable joining, not access to teammates’ reports.
- The creator receives the combined report; admins can see individual reports. Marketing consent is independent of assessment/team-reporting agreement.
- Saved reports use score version 1.0. Changing question content or thresholds for a later event should use a new score version and event ID.
- Team report generation records the included member IDs and timestamp. New completed members make that report out of date. Generation is manual; WhatsApp sending is manual.
- The admin workspace shows up to 1,000 participants/teams per event. This exceeds the planned 100; pagination should be added if operating larger events.
- Report writing sends activity choices/scores and reflection to OpenAI, not participant names, company names or phone numbers.
- Sessions are held in HttpOnly cookies; participant session tokens are hashed in the database. Admin sessions are revalidated against Supabase and the email allowlist. Admins sign in again after token expiry.
- Same-browser progress caching supports short connection interruptions. Clearing cookies loses the resumable identity. WhatsApp numbers are not treated as passwords; cross-device recovery is not implemented. Ask an admin for assistance instead of exposing an existing snapshot through its phone number.
- There is no automatic data-expiry schedule. Agree WildDrift’s retention period and provide a reachable contact for removal requests before the live launch. An administrator can handle records through Supabase; the UI has no deletion control.

## Files

- `public/`: participant/admin interfaces, approved activity content and shared scoring.
- `api/handler.js`: Vercel API entry point, method and origin checks.
- `lib/backend.js`: Supabase records, private sessions, unique team codes and OpenAI reporting.
- `supabase/setup.sql`: fresh-project database setup and access restrictions.
- `test/`: meaningful scoring, validation, authentication and API contract tests.
- `dev/`: local development and static build scripts.

## Documentation references

- https://vercel.com/docs/functions/runtimes/node-js
- https://vercel.com/docs/git/vercel-for-github
- https://vercel.com/docs/environment-variables/managing-environment-variables
- https://supabase.com/docs/guides/database/secure-data
- https://supabase.com/docs/reference/javascript/auth-signinwithpassword
- https://developers.openai.com/api/docs/guides/structured-outputs
