# ARISE SYSTEM (PWA)

## Run locally

### Option A: Quick open
1. Open `index.html` directly in a modern browser.
2. Note: service worker install may be limited in `file://` mode; core app still works.

### Option B: Recommended local server
```bash
cd arise-system
python3 -m http.server 8080
```
Open `http://localhost:8080`.

## Deploy (Netlify)
1. Push this folder to a Git repository.
2. In Netlify, import the repo.
3. Build command: *(leave empty)*
4. Publish directory: `arise-system`
5. Deploy.

## Convert to Android APK

### Trusted Web Activity (recommended)
1. Deploy PWA to HTTPS domain.
2. Use Bubblewrap:
   ```bash
   npm i -g @bubblewrap/cli
   bubblewrap init --manifest=https://your-domain/manifest.json
   bubblewrap build
   ```
3. Sign generated `.aab`/`.apk` and upload/install.

### WebView wrapper (fallback)
1. Create Android project in Android Studio.
2. Add a `WebView` loading your hosted PWA URL.
3. Enable offline behavior and install prompt fallback as needed.

## Future integrations
- OpenAI API adapter location: `modules/ai/systemVoice.js`
- Google Fit sync hook candidate: add service in `modules/core/`
- Notifications: extend `service-worker.js` and add Notification API prompt in `app.js`
- Cloud sync: replace `modules/data/storage.js` with hybrid local + remote adapter
