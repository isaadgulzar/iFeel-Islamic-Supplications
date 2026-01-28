# Sukoon - Islamic Dua Companion App

## Overview
Sukoon (Arabic: سكون - meaning tranquility/peace) is a mobile app that helps Muslims find the right supplication (dua) for any emotional state or life situation. Inspired by islamestic.com's "I am feeling" concept, reimagined as a beautiful native mobile experience.

## Current State
- **Version**: 1.0.0 (MVP)
- **Status**: Complete - Emotion-based dua discovery app with multi-language support

## Key Features
- Emotion-based dua navigation ("I am feeling...")
- Multi-language translations (English, Urdu, Indonesian, Hindi, Bengali)
- Transliteration support for all languages
- Customizable display options (Arabic only, translation, transliteration)
- Favorites system with local persistence
- Light/Dark mode support
- Beautiful Arabic typography with Amiri font

## Tech Stack
- **Frontend**: React Native + Expo
- **Backend**: Express.js (minimal - static landing page)
- **Storage**: AsyncStorage for local preferences and favorites
- **Fonts**: Amiri (Arabic), Inter (UI)
- **State Management**: React Context + React Query

## Project Structure
```
client/
├── App.tsx                    # Main app with font loading and providers
├── components/                # Reusable UI components
│   ├── DuaCard.tsx           # Dua preview card
│   ├── FeelingCard.tsx       # Emotion grid card
│   ├── DisplayOptionChip.tsx # Toggle chips for display preferences
│   ├── EmptyState.tsx        # Empty state with illustration
│   ├── LanguageSelector.tsx  # Language picker modal
│   └── SettingsRow.tsx       # Settings list item
├── constants/
│   └── theme.ts              # Colors, spacing, typography, feeling colors
├── context/
│   └── PreferencesContext.tsx # Global preferences state
├── data/
│   ├── feelings.ts           # Feelings/emotions data
│   └── duas.ts               # Duas database
├── lib/
│   └── storage.ts            # AsyncStorage utilities
├── navigation/               # React Navigation setup
├── screens/
│   ├── FeelingsScreen.tsx    # Home - emotion grid
│   ├── DuaCategoryScreen.tsx # Duas for a feeling
│   ├── DuaDetailScreen.tsx   # Full dua view
│   ├── CollectionsScreen.tsx # Browse all categories
│   ├── FavoritesScreen.tsx   # Saved duas
│   └── ProfileScreen.tsx     # Settings
└── types/
    └── index.ts              # TypeScript types
```

## Design System
- **Primary Color**: #1E5C50 (deep teal)
- **Accent Color**: #D4AF37 (gold)
- **Arabic Font**: Amiri (elegant, traditional)
- **UI Font**: Inter (modern, legible)
- See `design_guidelines.md` for full design specs

## Running the App
1. Backend: `npm run server:dev` (port 5000)
2. Frontend: `npm run expo:dev` (port 8081)
3. Scan QR code with Expo Go to test on device

## Future Enhancements
- Audio playback for duas
- More duas and feelings
- Cloud sync for favorites
- Push notification reminders
- Search functionality
- Share duas feature
