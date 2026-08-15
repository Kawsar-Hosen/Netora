# Netora — Google Play Store Release Preparation

**Developer:** XYTEEE
**Support email:** support@xyteee.com
**Website:** https://xyteee.com
**Privacy Policy:** https://xyteee.com/netora/privacy-policy
**Package:** `com.netora.networkutility`
**Version / versionCode:** 1.0.1 / 2
**Ads:** Google AdMob (Banner, Native Advanced, Interstitial) — test ads in the current build; real ads enabled only via `EXPO_PUBLIC_PRODUCTION_ADS=1` at build time.

---

## 1. Store Listing

### App name (title)
`Netora - Speed Test`
> Device display name is `Netora` (app.json `name`). The listing title above is recommended for search discoverability. Max 30 characters.

### Short description (max 80 characters)
`Netora - Wi-Fi and mobile data speed test with ping, jitter, packet loss and full network diagnostics.`

### Full description (max 4000 characters)

```
Netora is a fast, local-first speed test and network diagnostic tool for Android.

Run one-tap speed tests to measure download, upload, ping, jitter and packet loss. Netora works over Wi-Fi, mobile data and Ethernet, and keeps full control on your device.

FEATURES
• One-tap speed test — real download and upload throughput, clearly separated
• Latency analysis — ping, jitter and packet-loss estimation from real samples
• Live network details — Wi-Fi or mobile data, signal info, local IP, carrier and network generation
• Wi-Fi name (SSID/BSSID) — optional, shown locally when you grant permission
• Public network info — optional public IP, IP version, ISP, ASN and approximate city/country
• Server map — see the Cloudflare edge that serves your test, with map and edge details
• Full analytics — per-test breakdown and connection-quality grading
• History — browse, compare and delete past results; everything stays on your device
• Offline-aware — clear status and no interruptions when the network drops
• Dark and light themes — automatic or manual

PRIVACY BY DESIGN
Netora has no account system and no Netora backend. Speed-test history and preferences are stored only on your device. No GPS coordinates are read. External lookups are optional and never written to history. Netora contains ads served by Google AdMob; ad behavior and your choices are described in the Privacy Policy.

Requires Android 6.0 (API 23) or later. An internet connection is needed to run speed tests.
```

> Copy-paste ready. Play Store line-breaks are preserved from the text you paste.

### Category and tags
- **App category:** Tools
- **Tags (select up to 5):** Speed test, Wi-Fi, Internet, Network, Diagnostics

### Contact details (Play Console)
- Developer name: XYTEEE
- Contact email: support@xyteee.com
- Website: https://xyteee.com
- Privacy policy URL: https://xyteee.com/netora/privacy-policy

---

## 2. Graphics and Screenshots

| Asset | Specification | Source |
|---|---|---|
| App icon | 512x512 PNG (Play generates the round icon) | `assets/icon.png` (already used in the build) |
| Feature graphic | 1024x500 PNG, no transparent background, max 1MB | **REQUIRED — not created yet** |
| Phone screenshots | 2–8 per phone form factor, min 320px wide, recommended 1080x1920 (portrait) | **REQUIRED — take from the tested app** |
| 7-inch/10-inch tablet screenshots | Optional, 2–8 each | Optional |
| TV / Wear / Auto | Not required | N/A |

Screenshot guidance (Play will review them):
- Take real screenshots of Home (speed test), Analytics, Servers/map, History, Settings.
- No mock browsers, no placeholder frames, no unclear text overlays.
- Portrait 1080x1920 works for both 5.5" and 6.5" displays when exported via `adb exec-out screencap -p`.

`adb` capture command (device connected, USB debugging on):
```
adb exec-out screencap -p > home.png
```

---

## 3. Data Safety form (Play Console answers)

Declaration must match the released binary. Recommended answers:

| Question | Answer |
|---|---|
| Does your app collect or share any required user data? | Yes |
| Is all of the user data collected encrypted in transit? | Yes (all endpoints HTTPS) |
| Do you provide a way for users to request data deletion? | Yes — no server data exists; users delete local history in-app or clear app data. Select "Other in-app mechanisms" and explain. |
| Has this app been verified to comply with families policies? | No (not a child-directed app) |

Data types declared:

| Data type | Collected | Shared | Ephemeral | Stored by Netora | Reasons |
|---|---|---|---|---|---|
| IP address | Yes | Yes | Yes | No | Speed test, public-IP/ISP lookup, server routing, map |
| Approximate location (derived) | Yes | Yes | Yes | No | Derived by optional IP lookup; server map uses server location |
| App activity (speed metrics, latency) | Yes | No | No | Yes (locally in History) | Core functionality |
| Device/network identifiers (SSID/BSSID shown locally) | Yes | No | No | No | Optional Wi-Fi info, permission-gated |
| Advertising ID / device identifiers | Yes | Yes | Yes | No | AdMob ad serving and measurement |

Security practices:
- Data encrypted in transit: **Yes**
- User can request deletion: **Yes** (in-app history deletion / clear app data)
- Data sale: **No**
- Advertising: **Yes** — Google AdMob (Banner, Native Advanced, Interstitial); UMP consent form for EEA/UK/regulated regions, non-personalized ads when no consent
- Tracking: ad measurement only via AdMob; no separate tracking SDK

---

## 4. Ads declaration

- **Play Console → App content → Ads → "Does your app contain ads?" → Yes**
- Explains banner, native, and interstitial ads; interstitial only after a completed speed test with a frequency cap.

## 5. Content rating (ICRA questionnaire)

Recommended answers:
- App designed for all audiences; no user-generated content that requires a rating.
- **Violence:** None. **Sexual content:** None. **Language:** None (no foul language shown). **Controlled substances / tobacco / alcohol:** None.
- Result: **Everyone** (rating auto-computed).

## 6. Target audience

- **Primary age group:** 13+ (recommended; general utility with AdMob)
- **Intended audiences:** General audiences, not child-directed; no Google Play Families engagement.
- **App access:** Fully functional without an account or login — select "Users can use the app without logging in" / no sign-in required.
- **Government apps:** No.

## 7. App access (App content → App access)

- App has no login and no restricted areas — select **"All functionality is accessible without special access."**
- No account creation required to use the app.

## 8. Permissions declaration (App content → Permissions)

Verified against the actual release APK (`wtEopxmIo6sRSgZ8LQadKKb5zs6RRepTWg9obF9MCNE.apk`):

| Permission | Kind | Purpose | Notes |
|---|---|---|---|
| `ACCESS_NETWORK_STATE` | Normal | Detect connectivity/transport | Core feature |
| `ACCESS_WIFI_STATE` | Normal | Read Wi-Fi diagnostics | Core feature |
| `ACCESS_FINE_LOCATION` | Dangerous | Required by Android only for optional SSID/BSSID display | Permission-gated; core features work without it |
| `ACCESS_COARSE_LOCATION` | Dangerous | Auto-added with expo-location (comes with FINE) | Not requested on its own |
| `READ/WRITE_EXTERNAL_STORAGE` | Legacy | Auto-added by expo-file-system | `maxSdkVersion=32` — never prompts on Android 13+ |
| `INTERNET` | Normal | Networking (speed test, lookups, ads) | Core |
| `SYSTEM_ALERT_WINDOW` | Special | Auto-added by the Expo/RN template | Not used by the app at runtime; declare it if Play lists it |
| `VIBRATE`, `WAKE_LOCK`, `FOREGROUND_SERVICE` | Normal | Auto-added by RN/Expo runtime | No runtime prompt |
| `com.google.android.gms.permission.AD_ID` + `ACCESS_ADSERVICES_*` | Normal | Google AdMob advertising ID | Covered in Data Safety as Advertising ID |

Play Console declaration: the app does not request `SYSTEM_ALERT_WINDOW` at runtime, does not request storage at runtime on modern Android, and only requests location after the user opts in for Wi-Fi name access. No other dangerous permissions are requested.

## 9. Other Play Console fields

- **News app:** No.
- **Financial features:** No.
- **Health / sensitive data:** No.
- **Declaration (data safety) consistency:** Keep identical to section 3.
- **Store listing language:** English (en-US) primary; can add more later.
- **Play App Signing:** Enable (default). The EAS upload keystore (`OVmDwTdS9j`) is the upload key — **download and back it up** before first upload.

---

## 10. Final production configuration (already in repo)

`app.json`:
- `name`: Netora, `version`: 1.0.1, `versionCode`: 2
- `android.package`: com.netora.networkutility
- `android.permissions`: ACCESS_NETWORK_STATE, ACCESS_WIFI_STATE, ACCESS_FINE_LOCATION
- Plugins: expo-router, react-native-google-mobile-ads (real App ID `ca-app-pub-8665718760035175~4475702095`), expo-location, expo-splash-screen, expo-build-properties (compileSdk/targetSdk 36)

`eas.json` production profile: `buildType: app-bundle` (AAB) — validated by a finished EAS production build.

**Real ads:** NOT enabled yet. The production AAB must be rebuilt with:
```
eas build -p android --profile production --env EXPO_PUBLIC_PRODUCTION_ADS=1
```
immediately before the Play Store upload. The current build serves Google test ads.

## 11. Release-track plan

1. Internal testing track (optional): upload current test-ads AAB for a final team check.
2. Closed testing track (optional): invite testers for a staged rollout.
3. Production track: upload the real-ads AAB, run Play review.
4. Bump `versionCode` for every subsequent build (current: 2).
