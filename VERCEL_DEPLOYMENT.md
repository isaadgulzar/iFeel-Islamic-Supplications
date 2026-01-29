# Deploying iFeel Static Pages to Vercel

## ✅ All Emails Updated

Email changed from `isaadgulzar@gmail.com` to `hello@saadgulzar.dev` in:
- ✅ Privacy Policy (HTML & Markdown)
- ✅ Store Listings
- ✅ Support page
- ✅ Homepage
- ✅ All documentation

---

## 🚀 Standalone Vercel Deployment (RECOMMENDED)

Deploy the `docs/` folder as a separate Vercel project for static HTML pages only.

### **What You'll Get:**
```
Privacy Policy URL:
https://ifeel-duas.vercel.app/privacy.html

Support URL:
https://ifeel-duas.vercel.app/support.html

Homepage:
https://ifeel-duas.vercel.app/
```

### **Later (when you buy ifeel.so):**
```
Privacy Policy URL:
https://ifeel.so/privacy.html

Support URL:
https://ifeel.so/support.html
```

---

## 📋 Deployment Steps (5 minutes)

### **Method 1: Deploy via Vercel Dashboard (Easiest)**

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/new
   - Log in with your account

2. **Import GitHub Repo:**
   - Click "Import Project"
   - Select this GitHub repo: `isaadgulzar/iFeel-Islamic-Supplications`
   - Click "Import"

3. **Configure Project:**
   ```
   Project Name: ifeel-duas
   Framework Preset: Other
   Root Directory: ./docs
   Build Command: (leave empty)
   Output Directory: (leave empty)
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait 30 seconds
   - Done! 🎉

5. **Get Your URLs:**
   ```
   Privacy Policy:
   https://ifeel-duas.vercel.app/privacy.html

   Support:
   https://ifeel-duas.vercel.app/support.html

   Homepage:
   https://ifeel-duas.vercel.app/
   ```

---

### **Method 2: Deploy via Vercel CLI**

```bash
# Install Vercel CLI (if you don't have it)
npm i -g vercel

# From this repo's root directory
cd docs/

# Deploy
vercel

# Follow prompts:
# - Project name: ifeel-duas
# - Link to existing project? No
# - Deploy!
```

**Production deploy:**
```bash
vercel --prod
```

---

### **Method 3: Auto-Deploy on Push**

Already set up! Just push to GitHub:

```bash
git add docs/
git commit -m "Update privacy policy"
git push origin main

# Vercel auto-deploys the docs/ folder
```

---

## 🎯 Adding Custom Domain (Later)

When you buy `ifeel.so`:

1. **Go to Vercel Project Settings:**
   - Select `ifeel-duas` project
   - Click "Domains"

2. **Add Domain:**
   ```
   ifeel.so
   www.ifeel.so
   ```

3. **Update DNS Records:**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Follow Vercel's instructions

4. **Update App Store URLs:**
   ```
   OLD: https://ifeel-duas.vercel.app/privacy.html
   NEW: https://ifeel.so/privacy.html
   ```

Both App Store and Google Play allow URL updates after submission.

---

## ✅ What You Get

### **Now (Free .vercel.app domain):**
```
Privacy Policy: https://ifeel-duas.vercel.app/privacy.html
Support: https://ifeel-duas.vercel.app/support.html
Homepage: https://ifeel-duas.vercel.app/
```

### **Later (When you buy ifeel.so):**
```
Privacy Policy: https://ifeel.so/privacy.html
Support: https://ifeel.so/support.html
Homepage: https://ifeel.so/
```

### **Benefits:**
- ✅ Static HTML pages only (no web app needed)
- ✅ Fast deployment (< 5 minutes)
- ✅ Free hosting on Vercel
- ✅ Auto-deploys on git push
- ✅ Easy to add custom domain later
- ✅ Email matches domain: `hello@saadgulzar.dev`

---

## 📋 Next Steps

1. **Deploy now** (5 minutes):
   ```bash
   # Option 1: Vercel Dashboard
   https://vercel.com/new
   → Import GitHub repo
   → Set root directory to ./docs
   → Deploy

   # Option 2: Vercel CLI
   cd docs/
   vercel --prod
   ```

2. **Use in App Store submission:**
   ```
   Privacy Policy URL:
   https://ifeel-duas.vercel.app/privacy.html

   Support URL:
   https://ifeel-duas.vercel.app/support.html
   ```

3. **Later (when buying ifeel.so):**
   - Add custom domain in Vercel
   - Update app store URLs
   - Done!

---

## 🚀 Ready to Deploy?

**Recommended:** Use Vercel Dashboard (Method 1) - it's the easiest!

Just go to https://vercel.com/new and import this repo with `./docs` as root directory. Takes 2 minutes!
