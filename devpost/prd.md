---
doc: prd
status: approved
---

# Dose Card — Product Requirements

A one-page web app for a family member caring for a grandparent: turn a prescription into a large, picture-based medicine timetable in English plus the grandparent's language, ready to print and stick on the fridge.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey
Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

1. The family member opens the app. The first screen says in one line what it does and who it's for. It offers two ways to start: **Upload prescription photo** and **Try a sample prescription**. A third option, **Type medicines myself**, adds an empty row.
2. They upload a photo, or press the sample. A short "Reading the prescription…" state shows. Then the medicines appear as editable rows.
3. They check each row against the paper and fix anything wrong. Fields the reader wasn't sure about are highlighted "Please check".
4. They choose the grandparent's language. Optionally they add the patient's name and a family phone number for "If unsure, call …".
5. As they edit, the card preview on the same screen updates live.
6. They press **Print card**, which prints or saves an A4 PDF. That's success: a clean card with medicines grouped into time-of-day rows, ready for the fridge.

## Screens and Layout
One screen, two panels:
- **Left: Medicines.** Start buttons, the language picker, optional name and phone fields, and the list of medicine rows.
- **Right: Card preview.** Exactly what will print.
- **On a phone:** the panels stack, medicines first, with a "See card" button that jumps to the preview.
- **When printing:** only the card prints, with no app chrome.

## Look and Feel
Source: `scope.md > Inspiration & Identity`.
- **Feel:** warm, calm and very legible, like a well-designed hospital wayfinding sign, not a tech app. Never generic AI-app styling: no purple gradients, no glassy cards, no emoji as icons.
- **Paper:** an off-white, warm background, with dark ink text at high contrast.
- **Card layout: a tick chart (chosen by the learner after the first hands-on check, when the first tile design "looks very complex").** Medicines go down the side and the times of day go across as columns, each with its own picture. The dose appears in a coloured box under the time it's due. Morning is sunrise peach, Afternoon sun yellow, Evening dusk coral, Night deep indigo with a moon, so the grandparent can find "now" by colour alone.
- **Type:** big and rounded, with medicine names in bold. The card must stay readable from about an arm's length away. Every chosen language is shown in its own script.
- **Food markers:** a plate with an arrow, meaning before food or after food, plus the words.
- **The app panel:** quiet and plain, so the card is the star.

## Features and Behavior

### Reading the prescription
Source: `scope.md > The POC Boundary`.
- As a family member, I want to photograph the prescription and get the medicines filled in, so I don't have to type everything.
  - [ ] After a photo is uploaded, medicine rows appear with name, dose, times of day, food timing and any short note (e.g. "for 5 days").
  - [ ] The reader leaves out things that aren't medicines (doctor's name, clinic address, diagnosis).
  - [ ] Any field the reader wasn't sure of is visibly marked "Please check".
  - [ ] Pressing **Try a sample prescription** loads a built-in sample photo and runs the same flow, so judges need nothing of their own.

### Checking and editing medicines
- As a family member, I want to correct anything the reader got wrong, because the paper is the truth.
  - [ ] Each row has editable fields:
    - name, as on the box;
    - amount, a number plus unit (tablet, capsule, ml, drops, puff, sachet);
    - times: tick any of Morning, Afternoon, Evening, Night, or "Only when needed";
    - food: Before food, After food, With food or Any time;
    - an optional short note.
  - [ ] Rows can be added and deleted; editing a field removes its "Please check" mark.
  - [ ] Everything works with no photo at all (type-it-yourself path).

### The card
Source: `scope.md > The Unique Kernel`.
- As a grandparent, I want to look at the card and know what to take now, without asking anyone.
  - [ ] Four time-of-day columns (Morning, Afternoon, Evening, Night), each with its picture. A medicine taken twice a day shows its dose in both columns, coloured by time.
  - [ ] An "Only when needed" column appears only if a medicine needs it.
  - [ ] Each medicine row shows its name in large bold type, without "Tab."/"Cap.", plus the food marker. The dose cell shows the amount (e.g. "1 tablet", with that many pill marks).
  - [ ] Row titles, amounts, units and food words appear in English **and** the chosen language. Medicine names stay as printed on the box.
  - [ ] The header shows the patient's name if given. The footer shows "If unsure, call …" if a phone number is given, the date the card was made, and "Copied from the prescription. Check with your doctor or pharmacist."
  - [ ] Times with no dose show a faint dash, so the chart stays easy to scan.
  - [ ] Print shows only the card, fitting on one A4 page for up to about 8 medicines.

### Languages
Source: `scope.md > The POC Boundary`.
- **Indian:** Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Urdu.
- **World:** Spanish, French, Arabic, Chinese, Portuguese.
- Plus English only.
- [ ] Switching language updates the preview immediately.
- [ ] Right-to-left scripts (Urdu, Arabic) read correctly.
- [ ] Short notes the family member typed are shown as typed. No automatic translation of free text in this version.

## States and Boundaries
- **First visit:** no medicines yet. The preview shows a faint example card with a "Your card appears here" label, and the start buttons are prominent.
- **Reading:** a calm progress message. The page stays usable, and the family member can start typing instead.
- **Photo can't be read or has no medicines:** "We couldn't find medicines in this photo. Try a clearer photo or type them in." One empty row is added.
- **Reader unavailable** (no connection or service down): the same message, plus "You can still type the medicines". Typing and printing keep working.
- **A medicine with no time ticked:** the row is marked "Pick when to take this", and it doesn't appear on the card until fixed.
- **Closing and coming back:** the current list stays in this browser only, so a refresh doesn't lose the work. Nothing goes to any server except the photo, sent once for reading.
- **Privacy:** the photo isn't kept after reading. No accounts.

## Product Decisions
- **Hindi and many other languages on the card, not English only.** Learner: "it should support multiple famous languages".
- **The card is for grandparents; the app is for the family member.** From `scope.md > Who It's For`.
- **Always check before printing; never advise.** Safety: the app copies the prescription and never suggests doses. From `scope.md > Explicitly Cut`.
- **Agent proposals the learner approved in review ("yes"):**
  - The one-screen, two-panel layout with a live preview.
  - The time-row colours and pictures in Look and Feel.
  - The optional patient name and "If unsure, call" phone number.
  - Pill marks showing the amount.
  - Keeping the list in this browser between visits.

## What We're Building
- One-screen app, with photo reading, the sample prescription and manual entry.
- An editable medicine list with "Please check" marks.
- A live card preview with time rows, pictures, food markers and bilingual labels in 15 languages plus English.
- A one-page print or PDF.
- The empty, error and unavailable states above.

## Deferred From the POC
- **Translating free-text notes:** needs another AI call and a review step. Notes are shown as typed.
- **Reminders and alarms:** needs notifications and scheduling; the card itself is the proof.
- **WhatsApp or link sharing:** the PDF can be shared by hand for now.
- **Several family members' cards:** needs saved profiles.

## Possible Later Enhancements
- Read-aloud of the card for low-vision users.
- A card entirely in one language.
- Larger-print and high-contrast variants.
- More languages.

## Non-Goals
- **No medical advice, dose checking or drug-interaction warnings:** unsafe to guess.
- **No accounts or server storage of health data:** judges get in instantly, and there's less privacy risk.
- **No native app:** the web page is enough.

## Open Questions
None blocking `4-spec`.
