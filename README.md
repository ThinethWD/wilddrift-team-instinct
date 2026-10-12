# WildDrift Team Instinct — four-move update (2.0)

## Deploy this update to your existing GitHub + Vercel site

Extract the ZIP. At the ROOT of your existing GitHub repository, select **Add file → Upload files** and drag in the extracted **public**, **lib** and **test** folders, plus **README.md**. Keep their folder names and filenames exactly as supplied. Commit all files together so the frontend and server update in the same deployment.

If you prefer uploading into each existing folder, upload the files INSIDE that folder. Do not create `public/public`, `lib/lib`, or `test/test`, and do not leave download suffixes such as `(1)` on filenames.

Wait for the latest Vercel Production deployment to show **Ready**. Refresh the participant site and open **Try a sample experience**. The welcome screen should say **About 2–3 minutes** and **Four moves**.

**No Supabase SQL, table deletion or environment-variable changes are needed.** Keep your existing Supabase and OpenAI connections. Existing completed records are preserved. Unfinished earlier 12-question sessions start the new four-move journey from the beginning; the same participant record is retained. Completed earlier reports remain readable and are labelled as earlier 12-decision snapshots. To repeat a completed live assessment, use a new test WhatsApp number or manage the test record separately; a sample experience can always be restarted without touching the database.

## Files replaced

- `public/app.js`: four participant moves; brief action cards; crew selection; reactions; existing registration and team flows.
- `public/model.js`: version 2.0, four questions, short colleague cards, four-point scoring, detailed evidence-grounded fallback reports, legacy result compatibility.
- `public/ui.js`: richer report display, copy text and browser-print PDFs; legacy report rendering.
- `public/admin.js`: new sample reports, version-aware team report updates, compatible individual report display.
- `public/styles.css`: compact mission scenes and readable report panels; all opening-panel text is white on navy.
- `public/index.html`: updated welcome metadata and cache-versioned assets; admin link remains hidden.
- `public/admin.html`: cache-versioned admin assets.
- `lib/backend.js`: detailed AI report instructions and response schema, anonymous four-decision/crew evidence, explicit new draft defaults and equal-member team aggregation across older/newer versions.
- `test/model.test.mjs`, `test/api.test.mjs`, `test/journey.test.mjs`: updated verification for the new model and journey.
- `README.md`: these deployment instructions.

Do not replace `supabase/setup.sql`, `vercel.json`, `package.json`, API handler, or your environment variables. They are intentionally absent from this update ZIP.

## The participant experience

1. **You’re on:** tap one of four project-desk actions.
2. **Three seats:** invite three fictional colleagues, then choose where YOU fit.
3. **Plot twist:** respond to a cancelled attraction and see a teammate's concern.
4. **You pulled it off:** tap one reply in a simulated group chat and reveal the snapshot.

There is no final reflection question, live countdown, performance score or leaderboard. Crew selections provide context for feedback; they do not add personality points. A participant may change selections before continuing or revisit an earlier move.

## Detailed reports

The report includes a short opening summary, teamwork pattern, two contributions, a possible pressure trade-off, selected crew interpretation, advice for working together, a next-week experiment and a reflection question. AI is asked to write approximately 350–450 words; length can vary. Reports are reflections based on limited evidence, not validated personality diagnoses. OpenAI receives the selected decisions and fictional crew cards, not participant names, company names or phone numbers.

If AI is unavailable, a personalised scoring-guide report of the same structure is generated. It uses actual selected choices and colleagues, not a generic dominant-type template. The report source is shown in the participant and admin views.

Individual PDF buttons use the browser's print dialog, as before. Review print preview before saving. The blue opening panel explicitly uses white text and print-color-adjust; browser print settings can still affect background printing.

Team report generation remains manual. Existing team reports are marked for update when the report version or completed member list changes. Mixed old/new results are aggregated as equal-member proportions, so 12-question respondents do not outweigh four-question respondents.

## Verification before inviting participants

- Start a fresh sample: complete four moves, select/swap colleagues, go back to revise, reveal the report, copy it and open PDF preview.
- Confirm the crew step cannot proceed until three colleagues and your own role are selected.
- Test on an actual phone: text, touch targets, crew seats and report header.
- Register a new live test participant, refresh midway, finish and confirm the report appears in the admin workspace.
- Create/join a team; generate a combined report for two completed members.
- Review any earlier completed report and confirm it still opens.

Automated checks cover all 256 four-answer combinations, validation, report evidence, legacy records, equal-member team aggregation, authentication, generation locking and the AI schema/privacy contract. External Supabase/OpenAI calls are mocked; real account connections and mobile/browser printing must be checked after deployment.

Local checks: `npm test`, `npm run build`. The build retains the existing zero-production-dependency approach and the existing deployment configuration.
