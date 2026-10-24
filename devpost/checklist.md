---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast (the learner asked for the fewest rounds; hands-on checks are still done at the checkpoints below)

## Slices

- [x] **1. You can type medicines and see the fridge card**
  Becomes usable: A running app where typing a medicine (name, amount, times, food) instantly shows it on an English card in coloured time-of-day rows with pictures and food markers.
  Why now: The card is the unique kernel, so it comes first. It also carries the scaffold (Next.js, Tailwind, palette, fonts), so every later slice has somewhere to land.
  PRD ref: `prd.md > Checking and editing medicines`, `prd.md > The card`, `prd.md > Look and Feel`, `prd.md > States and Boundaries` (first visit, no time ticked)
  Spec ref: `spec.md > Stack`, `spec.md > Look and Feel`, `spec.md > Medicine list`, `spec.md > Card preview`, `spec.md > Data Model`, `spec.md > File Structure`
  Build:
  - Scaffold the Next.js 16 app with pnpm, Tailwind v4 and Vitest.
  - `lib/types.ts`, and `lib/card.ts` with `buildCard`.
  - `components/icons.tsx`, `MedicineList.tsx` and `Card.tsx`.
  - `app/page.tsx` with the two-panel layout, and `globals.css` / `card.css` with the palette.
  - The first-visit example card.
  Verify (mechanical): `pnpm test` passes the `buildCard` tests: grouping, empty rows dropped, no-time medicines held back, a twice-a-day medicine in two rows. `pnpm build` succeeds. The dev server renders the page, and a medicine typed in the browser appears on the card (checked in Chrome).
  Learner check: Run `pnpm dev`, open http://localhost:3000, add two medicines (one twice a day, after food), and see whether the card looks like something you'd stick on a fridge.
  Commit: `Type medicines and see the fridge card`

- [x] **2. A prescription photo fills the list**
  Becomes usable: Upload a prescription photo, or press "Try a sample prescription", and the medicines appear as editable rows with "Please check" marks. If reading fails, a clear message appears and typing still works.
  Why now: The Gemini reader is the riskiest dependency (accuracy, Indian shorthand, free-tier limits), so we prove it straight after the kernel exists.
  PRD ref: `prd.md > Reading the prescription`, `prd.md > The Core Journey` (steps 1–3), `prd.md > States and Boundaries` (reading, can't be read, reader unavailable)
  Spec ref: `spec.md > Start panel`, `spec.md > Reader client (`lib/read.ts`, browser)`, `spec.md > Reader function (`app/api/read/route.ts`, server)`, `spec.md > External Services and Dependencies`, `spec.md > Important Failure Modes`
  Build:
  - Create the fictional sample prescription image `public/sample/prescription.jpg`, using Indian shorthand and labelled as a sample.
  - `lib/reader.ts`: prompt, zod schema and model fallback.
  - `app/api/read/route.ts`, plus `lib/read.ts` to shrink the image and call the route.
  - `StartPanel.tsx` with the reading, error and unavailable states.
  - Record `public/sample/reading.json` from a real run, as the labelled fallback for the sample.
  Verify (mechanical): Unit tests cover mapping the reader's output to rows and the unsure flags. A `curl` of the sample image to `/api/read` returns the sample's medicines with the correct times and food (compared with the paper). A non-image request returns 400. With the key removed, the sample still returns the saved reading, and an upload shows the error message (checked in Chrome).
  Learner check: Press "Try a sample prescription", compare every row with the sample image, fix one field, and watch the card update.
  Commit: `Read a prescription photo into the medicine list`

- [x] **3. The card speaks the grandparent's language and prints**
  Becomes usable: Pick any of the 16 languages and the card shows bilingual labels in the right script (Urdu/Arabic right to left). Add a name and an "If unsure, call" phone number. Print gives a one-page A4 card, and the list survives a refresh.
  Why now: Bilingual labels are part of the kernel, but they sit on top of a working card; printing and persistence finish the core journey.
  PRD ref: `prd.md > Languages`, `prd.md > The card` (header, footer, print), `prd.md > States and Boundaries` (closing and coming back)
  Spec ref: `spec.md > Translations (`lib/translations.ts`)`, `spec.md > Card details`, `spec.md > Print`, `spec.md > Saved list (`lib/storage.ts`)`, `spec.md > Stack` (fonts)
  Build:
  - `lib/translations.ts` covering 16 languages.
  - The Noto fonts per script in `layout.tsx`.
  - `CardDetails.tsx`.
  - `lang`/`dir` handling in `Card.tsx`.
  - The `@media print` rules.
  - `lib/storage.ts`, wired into the page.
  Verify (mechanical): Translation tests: every language has every label, and `dir` is correct. `pnpm build` passes. In Chrome:
  - Hindi, Tamil, Urdu and Chinese all render with no missing-glyph boxes.
  - Urdu reads right to left.
  - The print preview is one A4 page showing only the card.
  - A refresh keeps the list.
  Learner check: Switch the card to Hindi and then to your second-favourite language, read the Hindi labels for mistakes, and open the print preview.
  Commit: `Bilingual card in 16 languages, print and saved list`

- [x] **4. Anyone can try it from a live link**
  Becomes usable: A public Vercel URL where a judge can press "Try a sample prescription" and print a card with no account. The repo has an MIT licence and a README with run steps.
  Why now: Deploying is the last step because it only packages the working journey; it gives judges and the video a live site.
  PRD ref: `prd.md > What We're Building`
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`
  Build:
  - `LICENSE` (MIT), `README.md` (what it is, how to run, sample-data and translation notes), and `.env.example`.
  - Create the Vercel project `dosecard`, set `GOOGLE_GENERATIVE_AI_API_KEY` through stdin, and deploy to production.
  Verify (mechanical): The live URL returns 200, and `/api/read` with the sample returns medicines on the live site. The core journey works on the live site in Chrome at desktop and phone widths.
  Learner check: Open the live link on your phone, press "Try a sample prescription", and open the card.
  Commit: `README, licence and live deploy`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 2: sample prescription → list → card. Feedback: design too complex → tick chart chosen (see Revisions)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [x] Feedback: "there is no icon to tell that have to take half meds or full tablet like quantity". Each dose cell now draws one picture per unit (round tablets, capsules, drops, a measuring cup for syrup, inhaler puffs, sachets), with a half tablet as half a circle and its missing half dotted; amounts read "1½ tablets". `lib/dose.ts` + `tests/dose.test.ts`; checked in Chrome with ½, 1½ and 2 tablets, capsule, syrup, drops, puffs and sachet.
- [x] Feedback: "can u create a label to tell me what icon specify what thing". The card now ends with a bilingual "What the pictures mean" key listing only the pictures on that card (food markers, whole/half tablet, capsule, drop, ml cup, puff, sachet). `legendKeys()` in `lib/dose.ts` is tested. Printing also shrinks a tall card to fit one A4 page: 8 medicines + key print at 85% zoom, 258 mm of 273 mm.
- [x] Feedback: "before and after food looks complicated to understand". The pill→plate arrow pictures were replaced by coloured word tags with a fork-and-spoon icon (amber BEFORE FOOD, green AFTER FOOD, grey WITH FOOD), in both languages. Food entries were removed from the picture key because the tag says it in words. Checked in Chrome.
- [x] Feedback: "compare it with the latest code people have and rate it via judge", then "work on it and please make a good website". After comparing with Just These Buttons, Heat Meds and others, these were added:
  - a simpler medicine row (dose stepper with ½ steps, food buttons, unit and note behind a link);
  - a one-page site with a distinct chemist's-shop identity, two verified sourced facts, how it works, a proof section and safety;
  - an Evidence page. 17 fictional prescriptions were read once by the live reader: 72/72 medicines found, 287/288 details right, 0 made up. One miss (a 4 PM dose put under Evening) wasn't flagged. One answer-key error (सुबह-शाम) was found and corrected openly.

  `lib/eval.ts` is tested (28 tests in total). Both pages were checked at phone width with no sideways scroll.
- [x] Feedback: "i want 10 rating". The learner approved ("yes") adding a talking card and WhatsApp sharing:
  - A QR code on the card opens `/listen`, which has big time buttons and reads aloud in the card's language with the phone's voice, falling back to English.
  - Share on WhatsApp and Copy link.
  - The card lives only in the link's `#` fragment.

  `lib/share.ts` and `lib/speech.ts` are tested (36 tests in total). Checked in Chrome: QR → /listen → Hindi voice speaks, the current time is highlighted, and the print with the QR still fits one A4 page (250 mm at 82%).
- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence:
Route and stops:
Edit outcome:
Reflection:
Activity mode:

## Revisions
- The page grid needed `minmax(0,1fr)` columns, plus phone-sized chart text, so the chart fits a 390 px screen without sideways scrolling. Found while checking the live site at phone width.
- Live URL: https://dosecard.vercel.app (Vercel project `dosecard`). `vercel link` also added `.env*` to `.gitignore`; `!.env.example` was added so the example file stays in the repo.
- Noto Sans Devanagari loads with `weight: "variable"`. The static 400/700 weights fail the Turbopack build ("next/font/google queries have exactly one entry"); the other scripts use static weights.
- Saving waits until the saved list has been restored. In development React runs effects twice, and the empty first render was overwriting the saved list.
- Card design changed from picture tiles in time-of-day bands to a tick chart (medicines down the side, times across). At the first hands-on check the learner said the design "looks very complex" and asked for easy options. They chose the tick chart from four rendered designs. `buildCard` was replaced by `buildChart`; PRD > The card and spec > Card preview were updated.
