# App Store Submission Checklist

## ✅ What's Done

### Code & Features:
- [x] Error boundary for crash handling
- [x] Analytics with consent modal
- [x] All required assets (icons, splash screens)
- [x] Bundle IDs configured
- [x] Offline-first architecture
- [x] iOS Privacy Manifest (PrivacyInfo.xcprivacy)
- [x] Privacy Policy written
- [x] Store descriptions written

---

## 📋 What's Left

### 1. Privacy Policy Hosting (CRITICAL)
**Status:** ⚠️ Need to host online

**Options:**
- **A. GitHub Pages (Recommended - FREE)**
  ```bash
  # Create gh-pages branch
  git checkout --orphan gh-pages

  # Add HTML version of privacy policy
  # Convert PRIVACY_POLICY.md to HTML or use markdown viewer

  # Push and enable GitHub Pages in repo settings
  # URL will be: https://isaadgulzar.github.io/iFeel-Islamic-Supplications/privacy
  ```

- **B. Your Domain**
  - Host PRIVACY_POLICY.md on your website
  - URL: https://yoursite.com/ifeel/privacy

- **C. Simple HTML hosting**
  - Use Vercel, Netlify, or Cloudflare Pages (all free)

**Action:** Choose option A (GitHub Pages) and host within 1 hour

---

### 2. Developer Accounts (CRITICAL)
**Status:** ⚠️ Need to purchase

**iOS:**
- [ ] Sign up for Apple Developer Program
- [ ] Cost: $99/year
- [ ] URL: https://developer.apple.com/programs/
- [ ] Processing time: 24-48 hours
- [ ] Need: Credit card, Apple ID

**Android:**
- [ ] Sign up for Google Play Console
- [ ] Cost: $25 one-time
- [ ] URL: https://play.google.com/console/signup
- [ ] Processing time: Instant
- [ ] Need: Google account, credit card

**Action:** Purchase both accounts today

---

### 3. Screenshots (CRITICAL)
**Status:** ⚠️ Need to create

**Required:**

**iOS:**
- [ ] 3-10 screenshots for 6.5" display (1284×2778 px)
- [ ] 3-10 screenshots for 5.5" display (1242×2208 px)

**Android:**
- [ ] 2-8 phone screenshots (min 320px, max 3840px)
- [ ] 1 feature graphic (1024×500 px) - REQUIRED

**How to create:**
1. Run app on simulator/device
2. Navigate to key screens:
   - Feelings grid
   - Dua detail (Arabic + translation)
   - Favorites
   - Search
3. Take screenshots
4. Use design tool (Figma, Canva) to add text overlays:
   - "Find Peace Through Dua"
   - "100+ Authentic Supplications"
   - "Completely Free Forever"

**Tools:**
- iOS Simulator: Cmd+S
- Android Emulator: Screenshot button
- Design: Canva (free) or Figma

**Action:** Create screenshots this week

---

### 4. App Store Connect Setup (iOS)
**Status:** ⚠️ Waiting for developer account

**Steps:**
1. [ ] Log into App Store Connect
2. [ ] Click "My Apps" → "+"
3. [ ] Create new app:
   - Name: iFeel: Duas for Every Feeling
   - Primary Language: English
   - Bundle ID: com.isaadgulzar.ifeel
   - SKU: ifeel-islamic-supplications
4. [ ] Fill in App Information:
   - Subtitle: Authentic Islamic Supplications
   - Category: Lifestyle
   - Age Rating: 4+
   - Privacy Policy URL: (from step 1)
   - Support URL: https://github.com/isaadgulzar/iFeel-Islamic-Supplications
5. [ ] Upload screenshots
6. [ ] Add description (from STORE_LISTINGS.md)
7. [ ] Add keywords
8. [ ] Set pricing: Free

**Action:** Complete when developer account approved

---

### 5. Google Play Console Setup (Android)
**Status:** ⚠️ Waiting for developer account

**Steps:**
1. [ ] Log into Google Play Console
2. [ ] Click "Create app"
3. [ ] Fill details:
   - App name: iFeel: Duas for Every Feeling
   - Default language: English
   - App type: App
   - Free or Paid: Free
4. [ ] Complete Store Listing:
   - Short description: (from STORE_LISTINGS.md)
   - Full description: (from STORE_LISTINGS.md)
   - App icon: Upload icon.png
   - Feature graphic: Create 1024×500 image
   - Screenshots: Upload phone screenshots
5. [ ] Set content rating:
   - Complete questionnaire
   - Expect: Everyone rating
6. [ ] Add privacy policy URL
7. [ ] Select category: Lifestyle
8. [ ] Set up pricing & distribution: Free, All countries

**Action:** Complete when developer account approved

---

### 6. Build & Submit App

**iOS (via EAS Build):**
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Create iOS build
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

**Android (via EAS Build):**
```bash
# Create Android build
eas build --platform android

# Submit to Google Play
eas submit --platform android
```

**Action:** After accounts & screenshots ready

---

### 7. Beta Testing (RECOMMENDED)
**Status:** ⚠️ Optional but recommended

**iOS - TestFlight:**
1. [ ] Build app via EAS
2. [ ] Upload to TestFlight (automatic via EAS)
3. [ ] Invite 10-20 beta testers
4. [ ] Collect feedback
5. [ ] Fix bugs
6. [ ] Submit final version

**Android - Internal Testing:**
1. [ ] Build app via EAS
2. [ ] Upload to Google Play Console
3. [ ] Add internal testers (email addresses)
4. [ ] Share test link
5. [ ] Collect feedback
6. [ ] Fix bugs
7. [ ] Promote to production

**Action:** Optional, adds 1 week to timeline

---

## 📅 Recommended Timeline

### Week 1 (This Week):
- [x] Day 1: Error boundary ✅
- [x] Day 1: Privacy manifest ✅
- [x] Day 1: Privacy policy ✅
- [x] Day 1: Store descriptions ✅
- [ ] Day 2: Host privacy policy online
- [ ] Day 2: Purchase developer accounts
- [ ] Day 3-4: Create screenshots
- [ ] Day 5: Set up App Store Connect
- [ ] Day 5: Set up Google Play Console

### Week 2:
- [ ] Day 6-7: Build app with EAS
- [ ] Day 8: Test builds thoroughly
- [ ] Day 9: Submit to App Store
- [ ] Day 9: Submit to Google Play
- [ ] Day 10-14: Wait for review

### Week 3-4:
- [ ] Review process (7-14 days)
- [ ] Respond to review feedback if needed
- [ ] App goes live! 🎉

**Total time:** 2-3 weeks

---

## 🚨 Critical Path (Must Do)

1. ✅ Privacy policy written
2. ⚠️ **Host privacy policy online** (1 hour)
3. ⚠️ **Buy developer accounts** (1 day processing)
4. ⚠️ **Create screenshots** (2-3 hours)
5. ⚠️ **Set up store listings** (2 hours)
6. ⚠️ **Build with EAS** (1 hour)
7. ⚠️ **Submit** (30 minutes)

**Total active work:** ~8 hours
**Total calendar time:** 2-3 weeks (mostly waiting)

---

## 💰 Costs Summary

| Item | Cost | Frequency |
|------|------|-----------|
| Apple Developer | $99 | Yearly |
| Google Play Console | $25 | One-time |
| Domain (optional) | $10-15 | Yearly |
| **Total Year 1** | **$124-139** | - |
| **Recurring (Year 2+)** | **$99-114** | Yearly |

**Note:** Can use GitHub Pages for privacy policy (FREE)

---

## 📧 Support Setup

**Email:** hello@saadgulzar.dev ✅ (already set up)

**Create:**
- [ ] Standard response templates (in STORE_LISTINGS.md ✅)
- [ ] GitHub Issues for bug reports
- [ ] FAQ page (optional)

---

## 🎯 Pre-Submission Tests

**Must verify:**
- [ ] App launches without crashes
- [ ] All duas load correctly
- [ ] Search works
- [ ] Favorites save/load
- [ ] Language switching works
- [ ] Analytics consent modal shows
- [ ] Error boundary catches crashes
- [ ] Works offline
- [ ] iOS build works on physical device
- [ ] Android build works on physical device

---

## 📱 After Submission

**If Approved:**
1. 🎉 Celebrate!
2. Share on social media
3. Ask friends/family to review
4. Monitor crash reports
5. Respond to user reviews
6. Plan updates

**If Rejected:**
1. Read rejection reason carefully
2. Fix issue
3. Respond to reviewer if needed
4. Resubmit
5. Average: 1-2 rejections is normal

---

## 🔧 Common Rejection Reasons & Fixes

**iOS:**
1. **Missing privacy policy** → Already done ✅
2. **Privacy manifest missing** → Already done ✅
3. **Crashes on launch** → Test thoroughly
4. **Incomplete metadata** → Use STORE_LISTINGS.md ✅
5. **Missing age rating** → Set to 4+ ✅

**Android:**
1. **Privacy policy missing** → Already done ✅
2. **Feature graphic missing** → Create 1024×500 image
3. **Content rating incomplete** → Fill questionnaire
4. **Crashes** → Test thoroughly
5. **Permissions not explained** → Check AndroidManifest.xml

---

## ✅ Final Checklist Before Submit

- [ ] Privacy policy hosted and URL working
- [ ] Screenshots created and uploaded
- [ ] Store descriptions added
- [ ] Developer accounts active
- [ ] App builds successfully
- [ ] App tested on real device (iOS & Android)
- [ ] No crashes in testing
- [ ] All features work offline
- [ ] Error boundary tested
- [ ] Analytics consent tested
- [ ] Privacy manifest in iOS build
- [ ] Bundle IDs match store listings
- [ ] App version is 1.0.0
- [ ] Support email works (hello@saadgulzar.dev)

---

## 🎉 You're Almost There!

**What's done:** 90% of the work
**What's left:** Mostly logistics (accounts, screenshots, hosting)
**Time needed:** ~8 hours of active work + 2 weeks waiting

**Next steps:**
1. Host privacy policy (1 hour)
2. Buy developer accounts (30 min)
3. Create screenshots (2-3 hours)
4. Submit! (30 min)

Good luck! May Allah accept this effort and make it beneficial for the ummah. 🤲
