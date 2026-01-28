# Design Guidelines: Dua Companion App

## App Name: **Sukoon** (Arabic: سكون - meaning tranquility/peace)

## Brand Identity

**Purpose**: A modern dua companion that helps Muslims find the right supplication for any emotional state or life situation. The app bridges spiritual practice with contemporary UX, making timeless prayers accessible and beautifully presented.

**Aesthetic Direction**: **Editorial/Magazine meets Spiritual Minimalism**
- Spacious, breathing layouts inspired by Islamic calligraphy's use of negative space
- Sophisticated typography hierarchy
- Subtle, reverent use of geometric Islamic patterns
- Unforgettable element: **Context-aware dua recommendations** with emotion-driven navigation that feels like a spiritual companion, not a database

**Differentiation**: Unlike traditional dua apps that feel like reference books, Sukoon uses emotional intelligence to guide users to the right prayer. The "I am feeling..." entry point creates an intimate, supportive experience.

## Navigation Architecture

**Root Navigation**: Tab Bar (4 tabs with floating action button for quick dua search)

**Tabs**:
1. **Feelings** - Emotion/situation-based dua discovery (Home)
2. **Collections** - Browse all dua categories
3. **Favorites** - Saved duas
4. **Profile** - Settings, language preferences, display options

**Floating Action Button**: Quick search (overlays tab bar center)

## Screen-by-Screen Specifications

### 1. Feelings Screen (Home)
**Purpose**: Primary entry point - users select their current emotional state

**Layout**:
- Transparent header with greeting ("As-salamu alaykum") and settings icon (right)
- Scrollable grid of emotion cards (2 columns)
- Safe area: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- Emotion cards: Rounded rectangles with subtle Islamic geometric pattern overlay, emotion name, icon
- Each card is touchable with gentle press feedback (scale: 0.98)
- Empty state: "Connecting you to peace..." with illustration

### 2. Dua Category Screen
**Purpose**: Shows all duas for selected emotion/category

**Layout**:
- Default navigation header with category name, back button (left), filter icon (right)
- Scrollable list of dua cards
- Safe area: top = Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- Dua preview cards: Arabic text (first line), translation preview, bookmark icon
- Filter button opens bottom sheet for: Arabic only, Translation, Transliteration, All

### 3. Dua Detail Screen
**Purpose**: Full dua display with customizable visibility options

**Layout**:
- Transparent header with back button, share icon, bookmark icon
- Scrollable content
- Safe area: top = headerHeight + Spacing.xl, bottom = insets.bottom + Spacing.xl

**Components**:
- Arabic text (large, centered, with tashkeel)
- Transliteration (if enabled)
- Translation (if enabled, with language selector)
- Audio playback button (floating at bottom)
- Display toggle chips at top (Arabic, Translation, Transliteration)

### 4. Collections Screen
**Purpose**: Browse all dua categories alphabetically

**Layout**:
- Default header with "Collections" title, search icon (right)
- Scrollable list
- Safe area: top = Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- Category list items with icon, name, dua count
- Empty state: "No collections yet" with illustration

### 5. Favorites Screen
**Purpose**: Quick access to bookmarked duas

**Layout**:
- Default header with "Favorites" title
- Scrollable list
- Safe area: top = Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- Same dua preview cards as Category screen
- Empty state: "No favorites yet. Tap the bookmark icon to save duas." with illustration

### 6. Profile Screen
**Purpose**: Settings, language preferences, display defaults

**Layout**:
- Transparent header with "Profile" title
- Scrollable form
- Safe area: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- Avatar placeholder with name field
- Theme toggle (Light/Dark)
- Default translation language selector
- Default transliteration language selector
- Display preferences (default toggles for Arabic, Translation, Transliteration)
- About section with credit to islamestic.com
- App version

## Color Palette

**Light Mode**:
- Primary: #1E5C50 (deep teal - symbolizes calm, depth)
- Accent: #D4AF37 (gold - traditional Islamic art)
- Background: #FAFAF8 (warm white)
- Surface: #FFFFFF
- Text Primary: #1A1A1A
- Text Secondary: #666666
- Border: #E8E8E6

**Dark Mode**:
- Primary: #2D8B7A (lighter teal)
- Accent: #E8C870 (soft gold)
- Background: #121212
- Surface: #1E1E1E
- Text Primary: #F5F5F5
- Text Secondary: #A0A0A0
- Border: #2A2A2A

**Semantic**:
- Success: #4CAF50
- Error: #EF5350
- Arabic Text: #000000 (light) / #E8DCC8 (dark, warm beige for readability)

## Typography

**Font**: Google Font "Amiri" for Arabic (traditional, beautiful), "Inter" for UI/translations (modern, legible)

**Type Scale**:
- Display (Arabic dua): Amiri 28pt Bold
- Headline: Inter 20pt Semibold
- Body: Inter 16pt Regular
- Caption: Inter 14pt Regular
- Transliteration: Inter 15pt Medium Italic

## Assets to Generate

1. **icon.png** - App icon: Crescent moon integrated with abstract peaceful geometric pattern, teal and gold palette
2. **splash-icon.png** - Same as app icon, shown during launch
3. **empty-feelings.png** - Illustration: Gentle abstract heart with subtle Islamic star pattern, used on Feelings screen if no categories load
4. **empty-favorites.png** - Illustration: Open book with bookmark, used on Favorites screen empty state
5. **empty-collections.png** - Illustration: Organized shelves/library, used on Collections screen empty state
6. **welcome-bg.png** - Soft geometric Islamic pattern background for onboarding, used on first launch
7. **avatar-default.png** - Simple silhouette with Islamic arch frame, used in Profile screen

All illustrations should use the primary teal and gold accent colors with cream/beige supporting tones, maintaining the editorial/spiritual aesthetic.