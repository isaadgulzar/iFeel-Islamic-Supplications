# Analytics Setup Guide - PostHog

## Overview

Your app now has **anonymous analytics** integrated using PostHog. This tracks user behavior without collecting personal information, helping you understand:

- How many people use the app daily/monthly
- Which duas are read most
- Which categories are popular
- Search patterns
- When users reach engagement milestones (10 duas, 50 duas, etc.)

---

## How It Works

### **Anonymous Tracking:**
- Each device gets a unique installation ID (stored locally)
- No personal info collected (no names, emails, IPs)
- All events tagged with this anonymous ID
- You see **trends**, not **identities**

### **What Gets Tracked:**

#### **Automatic Events:**
- `app_opened` - Every time app launches
- `milestone_reached` - When user hits 10, 50, 100 duas read, etc.

#### **User Action Events:**
- `dua_read` - When a dua is viewed (includes duaId, category)
- `favorite_added` - When user favorites a dua
- `favorite_removed` - When user unfavorites a dua
- `category_viewed` - When user taps on a feeling/category
- `search_performed` - When user searches (includes query, results count)

### **Local Stats (On-Device Only):**
Stored in AsyncStorage, never sent to server:
```json
{
  "appOpens": 15,
  "duasRead": 23,
  "favoriteCount": 7,
  "lastOpenDate": "2026-01-29",
  "emailPromptShown": false,
  "milestonesReached": ["10_duas_read", "5_favorites"]
}
```

---

## Setup Instructions

### **Step 1: Get PostHog API Key**

1. Go to https://app.posthog.com
2. Sign up for free account
3. Create a new project (select "Mobile App")
4. Copy your **Project API Key** from Settings → Project → API Keys

### **Step 2: Add API Key to Your App**

Open `src/lib/analytics.ts` and replace the placeholder:

```typescript
// Line 6-7
const POSTHOG_API_KEY = "__YOUR_POSTHOG_API_KEY__"; // ← Replace this
const POSTHOG_HOST = "https://us.i.posthog.com"; // US region (or 'https://eu.i.posthog.com' for EU)
```

**Example:**
```typescript
const POSTHOG_API_KEY = "phc_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9";
const POSTHOG_HOST = "https://us.i.posthog.com";
```

### **Step 3: Test It**

1. Run your app: `npm start`
2. On first launch, you'll see the consent modal
3. Tap "Allow Analytics"
4. Navigate around the app (read duas, add favorites, search)
5. Go to PostHog dashboard → Live Events
6. You should see events appearing in real-time!

---

## Understanding Your Dashboard

### **Key Metrics to Track:**

#### **1. Daily Active Users (DAU)**
```
PostHog → Insights → Trends
Event: app_opened
Filter: Unique users
Interval: Day
```

#### **2. Most Popular Duas**
```
PostHog → Insights → Trends
Event: dua_read
Group by: dua_id
Chart type: Bar
```

#### **3. Most Popular Categories**
```
PostHog → Insights → Trends
Event: category_viewed
Group by: category
Chart type: Pie
```

#### **4. Retention (How many users come back?)**
```
PostHog → Insights → Retention
Event: app_opened
Return event: app_opened
Interval: Day
```
Shows: Day 1 retention, Day 7 retention, Day 30 retention

#### **5. Search Analytics**
```
PostHog → Insights → Trends
Event: search_performed
Properties: query, results_count
```

#### **6. Engagement Milestones**
```
PostHog → Insights → Funnels
Steps:
1. app_opened
2. milestone_reached (milestone = 10_duas_read)
3. milestone_reached (milestone = 50_duas_read)
```

---

## Answering Your Questions

### **"How do we know they've used the app 10+ times?"**

**Answer:** Local stats tracking in `src/lib/analytics.ts`

```typescript
// Check in your code:
const stats = await getLocalStats();
console.log(stats.duasRead); // Number of duas read

if (stats.duasRead >= 10) {
  // Show email collection prompt
}
```

**Dashboard View:**
```
PostHog → Cohorts → Create Cohort
Name: "Engaged Users"
Filter: milestone_reached where milestone = 10_duas_read
```

### **"What category is read most?"**

**Dashboard:**
```
PostHog → Insights → Trends
Event: dua_read
Group by: category
Order by: Count (descending)
```

**You'll see:**
```
anxiety: 5,432 reads
gratitude: 3,221 reads
sleep: 2,109 reads
...
```

### **"How does it work without login? Device or IP?"**

**Answer:** **Device-based**, not IP-based.

```
Flow:
1. User installs app
2. PostHog generates UUID: "abc123-def456-ghi789"
3. Stored in device AsyncStorage (persists across app opens)
4. All events tagged with this UUID
5. Same device = same user (even across app closes)
6. Uninstall/reinstall = new UUID (counted as new user)

NO IP tracking, NO location data, NO device fingerprinting.
```

---

## Privacy & Compliance

### **What's Collected:**
✅ Installation ID (anonymous UUID)
✅ Event names (dua_read, favorite_added, etc.)
✅ Event properties (duaId, category)
✅ Timestamps
✅ Device type (iOS/Android)
✅ App version

### **What's NOT Collected:**
❌ Personal information
❌ IP addresses (anonymized by default)
❌ Location data
❌ Device identifiers (IDFA, Android ID)
❌ Contacts, photos, or other sensitive data

### **User Control:**
- Consent modal on first launch
- Can change preference anytime in Settings (TODO: add this)
- Full data deletion on request

---

## Cost Breakdown

### **PostHog Free Tier:**
- 1 million events/month
- 1 year data retention
- Unlimited team members
- Session recordings: 5,000/month
- Feature flags: 1 million requests/month

### **Your Estimated Usage:**
```
100 users/day × 10 events/user = 1,000 events/day
× 30 days = 30,000 events/month

✅ Well within free tier (1M/month)
```

### **When to Upgrade:**
- 3,000+ daily active users → ~90k events/month (still free)
- 10,000+ daily active users → ~300k events/month (still free)
- 30,000+ daily active users → ~900k events/month (still free)
- 33,000+ daily active users → Need paid plan ($0.00031/event)

**Verdict:** Free for at least your first 2-3 years!

---

## Migration to Amplitude (When Needed)

When you hit 1M events/month consistently:

1. **Export PostHog data:**
   ```
   PostHog → Data Management → Batch Exports
   Export format: JSON
   ```

2. **Set up Amplitude:**
   ```bash
   npm install @amplitude/analytics-react-native
   ```

3. **Update `src/lib/analytics.ts`:**
   - Keep PostHog for session replay only
   - Send events to both platforms
   - Amplitude becomes primary analytics

4. **Benefits:**
   - Amplitude free tier: 10M events/month (10x more)
   - Better retention analysis
   - No data loss during migration

---

## Common Issues & Fixes

### **Events Not Showing Up:**

1. **Check API Key:**
   ```typescript
   // Verify in src/lib/analytics.ts
   console.log('PostHog Key:', POSTHOG_API_KEY);
   ```

2. **Check User Consent:**
   ```typescript
   // In app
   const consent = await getAnalyticsConsent();
   console.log('Consent:', consent); // Should be true
   ```

3. **Check Network:**
   - PostHog requires internet connection
   - Events are queued if offline, sent when online

4. **Check Host Region:**
   ```typescript
   // US: https://us.i.posthog.com
   // EU: https://eu.i.posthog.com
   ```

### **Too Many Events:**

If you're tracking too much:
```typescript
// In src/lib/analytics.ts
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (!posthog) return;

  // Add sampling (track only 10% of events)
  if (Math.random() > 0.1) return;

  posthog.capture(eventName, properties);
};
```

---

## Next Steps

### **Recommended Dashboard Setup:**

1. **Main Dashboard (Day-to-Day Monitoring):**
   - Daily Active Users (DAU)
   - Most read duas (last 7 days)
   - Top categories
   - Search queries

2. **Growth Dashboard (Weekly Review):**
   - User retention (D1, D7, D30)
   - Milestone completions
   - New vs returning users

3. **Alerts:**
   - DAU drops below X
   - Crash rate spikes
   - Search with 0 results increases

### **Advanced Features to Add Later:**

1. **Session Replay** (see how users navigate):
   ```typescript
   // Already enabled in PostHog init
   captureNativeAppLifecycleEvents: true
   ```

2. **Feature Flags** (gradual rollouts):
   ```typescript
   const showNewFeature = await posthog.isFeatureEnabled('new-duas-layout');
   ```

3. **A/B Testing** (email prompt timing):
   ```typescript
   const variant = await posthog.getFeatureFlag('email-prompt-timing');
   // variant: 'day-3' or 'day-7' or 'after-10-duas'
   ```

---

## Support

- **PostHog Docs:** https://posthog.com/docs
- **PostHog Community:** https://posthog.com/slack
- **Questions?** Check `src/lib/analytics.ts` comments

---

## Summary

✅ PostHog installed and configured
✅ Anonymous tracking (privacy-first)
✅ Tracks key events (dua reads, favorites, search)
✅ Local stats for engagement milestones
✅ Consent modal for user permission
✅ Free tier covers 1M events/month (2-3 years growth)
✅ Easy migration to Amplitude when needed

**Total cost:** $0 for foreseeable future

**Next:** Add your PostHog API key and start tracking!
