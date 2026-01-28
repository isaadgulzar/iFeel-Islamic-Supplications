# Duas Data Structure

This directory contains all supplications (duas) organized by emotional category for better maintainability and scalability.

## Structure

```
src/data/duas/
├── index.ts          # Main export file - combines all categories
├── angry.ts          # Duas for feeling angry
├── anxious.ts        # Duas for feeling anxious
├── confused.ts       # Duas for feeling confused
├── depressed.ts      # Duas for feeling depressed
├── grateful.ts       # Duas for feeling grateful
├── lonely.ts         # Duas for feeling lonely
├── sad.ts            # Duas for feeling sad
├── scared.ts         # Duas for feeling scared
└── tired.ts          # Duas for feeling tired
```

## How to Add New Duas

### 1. Adding to an existing category

Edit the appropriate category file (e.g., `angry.ts`) and add a new dua object to the array:

```typescript
{
  id: "angry-5",                    // Unique ID (category-number)
  categoryId: "angry",               // Must match the category
  arabic: "أعوذ بالله...",           // Arabic text
  transliteration: {                 // Transliteration in all 5 languages
    en: "A'udhu billah...",
    ur: "اَعُوذُ بِاللّٰہِ...",
    id: "A'udzu billahi...",
    hi: "अऊज़ु बिल्लाहि...",
    bn: "আউযু বিল্লাহি...",
  },
  translation: {                     // Translation in all 5 languages
    en: "I seek refuge in Allah...",
    ur: "میں اللہ کی پناہ چاہتا ہوں...",
    id: "Aku berlindung kepada Allah...",
    hi: "मैं अल्लाह की शरण लेता हूँ...",
    bn: "আমি আল্লাহর কাছে আশ্রয় চাই...",
  },
  references: ["Quran 1:1", "Hadith"], // Optional: Array of references (can have multiple)
}
```

**Examples of references:**
- Single reference: `references: ["Quran 3:173"]`
- Multiple references: `references: ["Quran 21:87", "Dua of Prophet Yunus"]`
- Hadith collection: `references: ["Bukhari", "Muslim"]`
- No references: Omit the field entirely or use `references: []`

### 2. Creating a new category

1. Create a new file in `src/data/duas/` (e.g., `happy.ts`)
2. Follow this template:

```typescript
import { Dua } from "../../types";

export const happyDuas: Dua[] = [
  {
    // Your dua objects here
  },
];
```

3. Update `index.ts` to include the new category:
   - Import the new category: `import { happyDuas } from "./happy";`
   - Add to DUAS array: `...happyDuas,`
   - Add to DUAS_BY_CATEGORY object: `happy: happyDuas,`

## Usage in Code

The old import path still works thanks to the re-export in `src/data/duas.ts`:

```typescript
// All these still work:
import { DUAS } from "../data/duas";
import { getDuasByCategory } from "../data/duas";
import { getDuaById } from "../data/duas";

// New: You can also access by category directly
import { DUAS_BY_CATEGORY } from "../data/duas";
const angryDuas = DUAS_BY_CATEGORY.angry;
```

## Benefits

✅ **Organized**: Each category has its own file
✅ **Easy to find**: Want to edit angry duas? Go to `angry.ts`
✅ **Scalable**: Add hundreds of duas without one massive file
✅ **No conflicts**: Multiple people can work on different categories
✅ **Backward compatible**: Existing code continues to work
✅ **Better performance**: Can filter by category without searching the entire array
