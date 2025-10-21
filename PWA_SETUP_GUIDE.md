# MealCreator PWA Setup Guide

Your MealCreator website is now a **Progressive Web App (PWA)**! 🎉

## What Changed?

✅ **Added PWA Support** - Your website can now be installed as an app  
✅ **Offline Functionality** - Core pages cached for offline access  
✅ **Service Worker** - Handles caching and offline behavior  
✅ **App Shortcuts** - Quick access to Find Meal, Pantry, and Shopping List  
✅ **Native App Feel** - Full-screen mode, app icon, splash screen

## Files Added

1. **`public/manifest.json`** - PWA configuration and metadata
2. **`public/sw.js`** - Service Worker for offline support and caching
3. **`public/browserconfig.xml`** - Windows tile configuration
4. **`app/layout.tsx`** - Updated with PWA metadata and service worker registration

## How to Test Your PWA

### On Desktop (Chrome/Edge)

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Open in Chrome:** http://localhost:3001

3. **Look for install button:**
   - Check the address bar for an install icon (⊕ or computer icon)
   - Or: Chrome Menu → "Install MealCreator..."

4. **Install the app:**
   - Click the install button
   - The app will open in its own window without browser chrome!

5. **Test features:**
   - Close and reopen from Start Menu/Dock
   - Try offline mode (DevTools → Network → Offline checkbox)
   - Check service worker (DevTools → Application → Service Workers)

### On Android

1. **Deploy your app** or use a tunneling tool like `ngrok` to test locally:
   ```bash
   # In one terminal
   npm run dev
   
   # In another terminal (if using ngrok)
   ngrok http 3001
   ```

2. **Open in Chrome on Android** using your deployed URL or ngrok URL

3. **Install prompt:**
   - A banner will appear: "Add MealCreator to Home screen"
   - Or: Chrome Menu (⋮) → "Install app" or "Add to Home screen"

4. **Test:**
   - App opens full-screen
   - Green theme color in status bar
   - Can be found in app drawer
   - Works offline!

### On iOS (iPhone/iPad)

1. **Open in Safari** (not Chrome - iOS requires Safari for PWA installation)

2. **Install steps:**
   - Tap the Share button (□↑)
   - Scroll down and tap "Add to Home Screen"
   - Edit the name if desired
   - Tap "Add"

3. **Features:**
   - App icon on home screen
   - Opens in full-screen mode
   - No Safari UI

**Note:** iOS has more limited PWA support than Android/Desktop. Some advanced features may not work.

## Verifying Your PWA

### Chrome DevTools Lighthouse Audit

1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Progressive Web App" category
4. Click "Analyze page load"
5. Review PWA checklist (should get high score!)

### Check Service Worker

1. DevTools → Application tab → Service Workers
2. You should see: `https://localhost:3001/sw.js` - Status: **activated and running**
3. Try "Offline" checkbox to test offline functionality

### Check Manifest

1. DevTools → Application tab → Manifest
2. Verify all fields are populated correctly:
   - Name: "MealCreator - Meal Planning & Pantry Management"
   - Short name: "MealCreator"
   - Icons: showing
   - Theme color: #10b981 (green)

## Customization

### Change App Icons

Replace `/public/images/meal-creator-logo.png` with your icons:
- **192x192px** - Minimum size for Android
- **512x512px** - Recommended size for high-res devices
- Use PNG format with transparency

**Pro tip:** Use a tool like [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator) to create all sizes.

### Change Theme Color

Edit the theme color in:
- `app/layout.tsx` - Line 69: `themeColor: '#10b981'`
- `public/manifest.json` - Line 7: `"theme_color": "#10b981"`

### Modify Cached Pages

Edit `public/sw.js` - Lines 7-15 to add/remove pages from offline cache:
```javascript
const STATIC_ASSETS = [
  '/',
  '/home',
  '/find-meal',
  // Add more pages here
];
```

## App Shortcuts

Three shortcuts are pre-configured:
1. **Find Meal** → `/find-meal`
2. **Pantry** → `/pantry`  
3. **Shopping List** → `/shopping-list`

Long-press the app icon to access shortcuts (Android/Windows).

## What Works Offline

✅ **Cached pages:** Home, Find Meal, Meals, Pantry, Shopping List  
✅ **Previously loaded data:** Meals, pantry items you've viewed  
✅ **Static assets:** CSS, images, fonts  
⚠️ **Not cached:** Real-time API calls (until you implement offline queue)

## Advanced Features (Optional)

### Push Notifications

The service worker has push notification handlers ready. To enable:
1. Request notification permission from users
2. Set up a push notification service (Firebase Cloud Messaging, OneSignal, etc.)
3. Send push messages from your backend

### Background Sync

Allows queuing actions when offline and syncing when back online.  
Basic structure is in `public/sw.js` - see the `sync` event listener.

### Offline Form Submissions

Extend the service worker to:
1. Queue form submissions when offline
2. Sync them via Background Sync when online
3. Show user feedback about pending actions

## Troubleshooting

### "Install" button doesn't appear
- Service worker must be served over HTTPS (or localhost)
- Check Console for service worker registration errors
- Make sure manifest.json is accessible at `/manifest.json`
- PWA criteria must be met (use Lighthouse to check)

### Changes not appearing
- Service workers cache aggressively
- In DevTools → Application → Service Workers:
  - Click "Unregister"
  - Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
  - Or check "Update on reload" during development

### iOS not showing install option
- Must use Safari (not Chrome or other browsers)
- HTTPS required (except localhost)
- Manifest must meet Apple's requirements

### Offline mode not working
- Check service worker is active (DevTools → Application)
- Review cached resources (DevTools → Application → Cache Storage)
- Check service worker Console for errors

## Production Deployment

When deploying to production:

1. **Ensure HTTPS** - Required for service workers (except localhost)
2. **Update manifest.json** - Set correct `start_url` if not at root
3. **Cache busting** - Update `CACHE_NAME` in `sw.js` when making changes
4. **Test thoroughly** - Test install, offline, and shortcuts on all platforms

## Resources

- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev - PWA](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/) - Tools and testing
- [Service Worker Cookbook](https://serviceworke.rs/) - Examples

---

**Your app is now installable!** 🚀  
Share the URL with users and they can install it on any device.

