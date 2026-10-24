---
doc: spec
status: approved
---

# Dose Card — Technical Spec

## How This Works, In Plain Language
Dose Card is one web page plus one small server function.

- **The page** (Next.js + React) holds everything the family member sees: the start buttons, the medicine list and the live card preview. The medicine list is kept in the browser's own storage (`localStorage`, a sticky note the browser keeps for this site), so a refresh doesn't lose it. Nothing else is saved anywhere.
- **The reader** (`/api/read`) is the one server function. The page shrinks the prescription photo and sends it there. The function asks Google's Gemini vision model to copy out the medicines in a fixed JSON shape, then checks that shape and sends it back. The photo isn't stored. The function exists only so the Gemini key stays on the server, never in the browser.
- **The card** is plain HTML and CSS drawn from the list. The page reads fixed translated labels ("Morning", "After food", "tablet" …) from one translations file, so changing language doesn't call the AI. Printing uses the browser's own print / save-as-PDF, with print styles that hide everything except the card.

Why this shape: a single page and a single function is the smallest set-up that keeps the key secret, works offline for typing and printing, and deploys to Vercel in one command. That gives judges a live link alongside the video.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.
1. **Upload or try the sample.** The family member taps **Upload prescription photo** or **Try a sample prescription**. The page loads the file (or `/sample/prescription.jpg`), shrinks it to at most 1600 px as a JPEG, and POSTs it to `/api/read`.
2. **The reader copies the medicines.** `/api/read` sends the image and an instruction to Gemini through the Vercel AI SDK (`generateText` + `Output.object`, schema below). It validates the result with zod and returns `{ medicines: [...] }`. Each field comes with an `unsure` flag.
3. **The list appears.** The page turns the result into rows. Rows with unsure fields show **Please check**, and the list is saved to `localStorage`.
4. **The family member checks and edits.** Each change updates the list, which updates the preview immediately and saves again.
5. **They pick a language** and, optionally, a name and phone number. The card re-renders using `translations.ts`.
6. **They print.** `window.print()` runs, and the print CSS shows only the card on A4.

If step 2 fails, the page shows the PRD's error message and adds one empty row. Typing and printing never depend on the reader.

## Stack
Reuses the versions already working in the learner's other Next.js project (FanDrive), to avoid setup surprises.
- **Next.js 16.4.2** (App Router), **React 19.3**, **TypeScript**. Docs: https://nextjs.org/docs. One framework gives both the page and the server function; the learner already knows it.
- **Tailwind CSS v4** for the app panel; plain CSS (`card.css`) for the card and print rules. Docs: https://tailwindcss.com/docs.
- **Vercel AI SDK 7** (`ai@7.0.138`) + **@ai-sdk/google 4.0.94**, used for the vision call. Docs: https://ai-sdk.dev/docs. The structured output gives a typed result rather than parsing free text.
- **zod 4**, to validate the reader's output. Docs: https://zod.dev.
- **Vitest 5**, for unit tests of the logic that turns rows into a card and of the translations file. Docs: https://vitest.dev.
- **Fonts:** Google Fonts' **Noto Sans** family, covering every script on the list. Docs: https://fonts.google.com/noto. The scripts and the matching Noto fonts:
  - Devanagari (Hindi, Marathi): Noto Sans Devanagari
  - Bengali: Noto Sans Bengali
  - Telugu: Noto Sans Telugu
  - Tamil: Noto Sans Tamil
  - Gujarati: Noto Sans Gujarati
  - Kannada: Noto Sans Kannada
  - Malayalam: Noto Sans Malayalam
  - Gurmukhi (Punjabi): Noto Sans Gurmukhi
  - Urdu and Arabic: Noto Naskh Arabic
  - Chinese: Noto Sans SC
  - Latin: Atkinson Hyperlegible, a typeface designed for low vision, for English and the Latin-script languages.

  Loaded with `next/font/google`, so they're self-hosted at build time.
- **Package manager:** pnpm. Node 22+.

## Where It Runs and How Someone Tries It
- **Local:**
  1. Copy `.env.example` to `.env.local`.
  2. Set `GOOGLE_GENERATIVE_AI_API_KEY` to a key from https://aistudio.google.com/apikey.
  3. Run `pnpm install && pnpm dev` and open http://localhost:3000.
- **Deployed (chosen, optional for the rules):** Vercel, project `dosecard`. Run `vercel deploy --prod` and set `GOOGLE_GENERATIVE_AI_API_KEY` in Vercel's environment variables. Judges get a live link with **Try a sample prescription** and need no account.
- **Required for submission:**
  - a demo video under 3 minutes, public on YouTube or Vimeo, recorded from the live site;
  - a public GitHub repo with an MIT `LICENSE` that shows in the About box;
  - the repo contains `devpost/scope.md`, `prd.md` and `spec.md`.
- **Demo path to record:** sample → list appears → fix one field → switch to Hindi, then Tamil → Print preview.

## Look and Feel
Carried from `prd.md > Look and Feel`.

**Palette** (CSS variables in `globals.css`):

| Variable | Colour | Use |
|---|---|---|
| `--paper` | #FBF7F0 | warm off-white background |
| `--ink` | #1F2328 | text |
| `--muted` | #5B6470 | secondary text |
| `--line` | #E4DCCF | lines and borders |
| `--morning` | #FCE3CF | sunrise peach |
| `--afternoon` | #FFF1B8 | sun yellow |
| `--evening` | #F9D0C4 | dusk coral |
| `--night` | #2E3A6B, with white text | deep indigo |
| `--needed` | #E6EEF2 | "only when needed" row |
| `--accent` | #B4532A | warm terracotta, for buttons and "Please check" |

**Type:**
- On the card: medicine names in bold at 28–32 pt; amount and food text at 20 pt.
- In the app panel: 16 px.
- No pure black text on pure white.

**Pictures:** hand-drawn-style inline SVG icons in `icons.tsx`: sunrise, sun, sunset, moon, a plate with an arrow (before or after food), and a pill mark. No emoji, no icon library.

**Card layout:** one row per time of day, as a full-width band with its icon at left (about 64 px), the time label in both languages, then the medicine "tiles". Generous spacing, thin rounded borders, and no shadows on the card.

**App copy:** plain and warm, written to the family member. For example: "Check each medicine against the paper."

**Avoid:** gradients, glassmorphism, purple, emoji icons, dense tables.

## Components

### Start panel
- Implements `prd.md > The Core Journey` steps 1–2 and `prd.md > Reading the prescription`.
- Three buttons: Upload photo (a file input with `accept="image/*"` and `capture="environment"` for phone cameras), Try a sample, Type myself.
- Shrinks the image in a canvas and calls the reader client.

### Reader client (`lib/read.ts`, browser)
- `shrink(file): Promise<Blob>` and `readPrescription(blob): Promise<Medicine[]>`.
- Sends `multipart/form-data` to `/api/read` with a 45 s timeout.
- On any failure it throws a typed error that the page turns into the PRD's message.

### Reader function (`app/api/read/route.ts`, server)
- Implements `prd.md > Reading the prescription`.
- Accepts one image up to 4 MB and rejects other file types with a 400.
- Calls Gemini through a fallback chain of models (`gemini-3.5-flash`, then `gemini-3-flash-preview`, then `gemini-3.1-flash-lite`). The next model is tried on 429/503 errors or a timeout.
- Validates with `ReadResult` (zod) and maps the output into `Medicine` rows with new ids.
- Never logs the image or the result.
- The instruction tells the model to:
  - copy only the medicines on the paper and never add or guess;
  - turn common Indian prescription shorthand into times and food timing: `1-0-1` means Morning and Night; `OD` is once a day, `BD` twice, `TDS` three times, `HS` at bedtime, `SOS` only when needed; `AC` is before food and `PC` after food;
  - mark a field `unsure` when it is unclear or not written.

### Medicine list
- Implements `prd.md > Checking and editing medicines`.
- One editable row per medicine:
  - text field for the name;
  - number + select for amount and unit;
  - five toggle chips for times: Morning, Afternoon, Evening, Night, When needed;
  - a select for food;
  - text for the note.
- Rows can be deleted, and a "+ Add medicine" button adds one.
- Unsure fields carry an accent outline and a "Please check" tag; editing a field clears its unsure flag.
- A row with no time selected shows "Pick when to take this".

### Card details
- Implements `prd.md > The card` (header and footer) and `prd.md > Languages`.
- The language select, an optional patient name, and an optional "If unsure, call" phone field.

### Card preview
- Implements `prd.md > The card` and `prd.md > States and Boundaries` (first visit).
- `buildCard(medicines, lang)` is a pure function in `lib/card.ts`. It returns the ordered time rows with their tiles, leaving out empty rows and rows that have no time.
- `<Card>` renders that result, setting `lang` and `dir` on the bilingual labels so Urdu and Arabic read right to left.
- On first visit it shows a faint example card with "Your card appears here".
- On a phone, the "See card" button scrolls to the preview.

### Translations (`lib/translations.ts`)
- Implements `prd.md > Languages`.
- A typed record per language code, holding:
  - the language's name in its own script;
  - the four time rows and "When needed";
  - the units (singular and plural);
  - the four food phrases;
  - the footer sentences ("If unsure, call", "Made on", "Copied from the prescription. Check with your doctor or pharmacist.");
  - `dir`.
- Languages: `en, hi, bn, mr, te, ta, gu, kn, ml, pa, ur, es, fr, ar, zh, pt`.
- Numbers display as Western digits for clarity.

### Print
- Implements `prd.md > The card` (print criterion).
- `@media print` with `@page { size: A4; margin: 12mm }`. Everything except `#card` is hidden, and background colours are kept with `print-color-adjust: exact`.
- The card scales down slightly beyond 8 medicines so it stays on one page.

### Saved list (`lib/storage.ts`)
- Implements `prd.md > States and Boundaries` ("Closing and coming back").
- `load()` and `save(state)` against `localStorage` key `dosecard:v1`, wrapped in try/catch. If storage is unavailable the app still works, but nothing is remembered.

## Data Model
```ts
type Time = "morning" | "afternoon" | "evening" | "night" | "needed";
type Food = "before" | "after" | "with" | "any";
type Unit = "tablet" | "capsule" | "ml" | "drops" | "puff" | "sachet" | "other";
type Medicine = {
  id: string; name: string; amount: number; unit: Unit;
  times: Time[]; food: Food; note: string;
  unsure: Partial<Record<"name" | "amount" | "times" | "food", true>>;
};
type AppState = { medicines: Medicine[]; lang: LangCode; patient: string; phone: string };
```
- **`AppState`:** lives in React state, mirrored to `localStorage` on every change and read back on load.
- **The photo:** exists only in memory for one request; nothing is kept on the server.
- **Translations:** static code.

## File Structure
```
dosecard/
├── app/
│   ├── layout.tsx          # fonts (Noto family + Atkinson Hyperlegible), metadata
│   ├── page.tsx            # the one screen: start panel, list, details, preview
│   ├── globals.css         # Tailwind + palette variables
│   ├── card.css            # card layout + @media print rules
│   └── api/read/route.ts   # the reader: image → Gemini → validated medicines
├── components/
│   ├── StartPanel.tsx      # upload / sample / type buttons + reading state
│   ├── MedicineList.tsx    # editable rows, Please-check marks
│   ├── CardDetails.tsx     # language, patient name, phone
│   ├── Card.tsx            # the printable card
│   └── icons.tsx           # sunrise, sun, sunset, moon, plate, pill SVGs
├── lib/
│   ├── types.ts            # Medicine, AppState, Time, Food, Unit
│   ├── card.ts             # buildCard(): rows → ordered time bands
│   ├── translations.ts     # 16 languages of fixed labels
│   ├── read.ts             # browser: shrink image, call /api/read
│   ├── reader.ts           # server: prompt, zod schema, model fallback
│   └── storage.ts          # localStorage load/save
├── public/sample/prescription.jpg   # fictional sample prescription (labelled sample)
├── tests/                  # vitest: card.test.ts, translations.test.ts, reader.test.ts
├── devpost/                # scope, prd, spec, checklist, app map
├── .env.example            # GOOGLE_GENERATIVE_AI_API_KEY=
├── LICENSE                 # MIT
└── README.md               # what it is, how to run, sample-data note
```

## External Services and Dependencies
- **Google Gemini API, through @ai-sdk/google.**
  - Call: `generateText({ model: google(id), output: Output.object({ schema: ReadResult }), messages: [{ role: "user", content: [{ type: "text", text: PROMPT }, { type: "image", image: bytes, mediaType: "image/jpeg" }] }] })`.
  - `ReadResult` is `{ medicines: { name, amount, unit, times, food, note, unsure: string[] }[] }`.
  - Key: `GOOGLE_GENERATIVE_AI_API_KEY`, server only.
  - Docs: https://ai.google.dev/gemini-api/docs and https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai.
  - Limits and cost: the free tier is about 20 requests per model per day (per the learner's FanDrive notes), and the fallback chain spreads that across 3 models. Not verified today; check early in the build.
- **Google Fonts** through `next/font`: downloaded at build time, no runtime calls.
- **Vercel:** hosting. The free Hobby plan is enough.

## Important Failure Modes
- **The free Gemini quota runs out while judges try the sample.** For the sample image only, `/api/read` returns a stored reading of that same sample image, `public/sample/reading.json`, recorded from a real run. The page labels it "Sample reading (saved)". Uploaded photos still need the live reader.
- **A handwritten or blurry prescription is misread.** Unsure fields are marked, the family member must check every row, and the footer says to check with the pharmacist. Nothing is ever added that isn't on the paper (prompt rule + review).
- **A script renders as boxes because its font is missing.** Each language uses its own Noto font, and a translations test checks that every language has every label.

## What Was Simplified and Why
- **Fixed translated labels** instead of translating everything with AI. Labels are the only text that needs translating; medicine names stay as on the box. It's instant, works offline and can't hallucinate. The fuller version would translate free-text notes with a review step.
- **The browser's print / save-as-PDF** instead of a PDF library. It gives the same A4 output with no dependency.
- **`localStorage`** instead of accounts or a database. It's a single-user tool and keeps health data off servers.
- **A saved reading for the sample** as a fallback only, clearly labelled. The live reading is still the default.

## Decisions and Open Issues
**Agent recommendations the learner approved in review:**
- Next.js on Vercel, with Gemini as the reader.
- Fixed translated labels.
- The saved sample-reading fallback.

**Implementation details derived from the PRD:**
- the shorthand rules in the reader's instruction;
- Noto fonts per script;
- the `localStorage` key.

**Learner uncertainty:** none raised; the learner asked to move fast.

**Build-time checks the agent will run:**
- **Reading accuracy:** how well the reader handles Indian shorthand (`1-0-1`, `BD`, `SOS`). Check by reading the sample prescription and confirming every row matches the paper.
- **Translations:** labels are AI-drafted, so the Hindi labels get a spot-check by the learner. The README says the other translations are machine-drafted and welcome corrections.
- **Gemini limits:** current free-tier limits and model IDs, to confirm on the first call.

- **Gemini key:** the learner chose to reuse FanDrive's key rather than make a new one. Accepted trade-off: both apps share one free daily limit. The fallback chain and the saved sample reading reduce the risk.

**Open questions from the PRD:** none.
