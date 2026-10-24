# Dose Card

Turns a prescription into a large, picture-based medicine timetable that a grandparent can read on the fridge. It's printed in English plus their own language, from 15 options.

Built for Devpost's **Build With AI: Basics** hackathon with the [Devpost Learn skill pack](https://github.com/challengepost/learn-ai-basics). The planning documents are in [`devpost/`](devpost): [scope](devpost/scope.md), [PRD](devpost/prd.md), [spec](devpost/spec.md) and the [build checklist](devpost/checklist.md).

## What it does

1. **Upload a photo of the prescription**, or press **Try a sample prescription**. Gemini's vision model copies out each medicine: name, amount, times of day and before/after food. It understands Indian shorthand like `1-0-1`, `OD`, `BD`, `HS`, `SOS`, `AC` and `PC`, and marks anything unclear **Please check**.
2. **Check each row against the paper** and fix anything wrong, or type the medicines in by hand.
3. **Pick the grandparent's language**. Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Kannada, Malayalam, Punjabi and Urdu are available, plus Spanish, French, Arabic, Chinese and Portuguese.
4. **Print** a one-page A4 tick chart: medicines down the side, Morning / Afternoon / Evening / Night across, with pictures for each time and for before or after food.

It never gives medical advice. It only copies the prescription, and the family member confirms every row.

## Run it

Needs Node 22+ and pnpm.

```bash
cp .env.example .env.local    # add your Gemini API key
pnpm install
pnpm dev                       # http://localhost:3000
pnpm test                      # unit tests
```

Without a key, typing and printing still work, and the sample prescription uses its saved reading.

## How it works

- **`app/page.tsx` + `components/`**: the single screen with the start buttons, medicine list, card details and live card preview. The list is saved in this browser's `localStorage` only.
- **`app/api/read/route.ts` + `lib/reader.ts`**: the one server function. It sends the photo to Gemini (`gemini-3.5-flash`, falling back to two other models) with a fixed JSON schema, then validates the result with zod. The photo is never stored or logged.
- **`lib/translations.ts`**: the fixed card labels for each language. Switching language is instant and never calls the AI.
- **`app/card.css`**: the card and the print rules, which print only the card on A4.

## Notes

- **Sample data:** `public/sample/prescription.jpg` is a fictional prescription made for this project. `public/sample/reading.json` is a real reading of it, used only if the live reader is unavailable, and is labelled "Sample reading (saved)" in the app.
- **Translations** were machine-drafted. Corrections from native speakers are very welcome.
- **Privacy:** no accounts and no database. The photo is sent once to Gemini for reading and isn't kept.

## Licence

[MIT](LICENSE)
