# Netora — Speed Test

A lightweight internet speed test app for Android, built with **Expo (React Native) + TypeScript**, with **Google AdMob** integration.

> **Play Store:** `Netora - Speed Test` (package `com.netora.networkutility`)
> **Privacy Policy:** https://xyteee.com/netora/privacy-policy

## Features

- ⚡ Internet speed test (download / upload / ping)
- 🗺️ Server & network info (IP, ISP, region, coordinates)
- 📊 Test history with analytics screen
- 🌙 Native dark UI design
- 🛡️ Privacy toggle — control network info sharing
- 🎯 Configurable test settings (threads, payload, auto-start)

## AdMob Integration

- **Banner** — Home & History screens
- **Native** — Analytics screen
- **Interstitial** — shown after every 2nd completed test (90s cooldown, never during a test / offline / error)
- **UMP consent** handled via `react-native-google-mobile-ads`

Ads are **test ads by default**. Real AdMob IDs are only used when the build-time env var `EXPO_PUBLIC_PRODUCTION_ADS=1` is set (production profile in `eas.json`):

```json
"production": {
  "env": { "EXPO_PUBLIC_PRODUCTION_ADS": "1" }
}
```

## Tech Stack

| | |
|---|---|
| Framework | Expo SDK 57 |
| UI | React Native 0.86 / React 19.2 |
| Language | TypeScript |
| Navigation | expo-router |
| Ads | react-native-google-mobile-ads 16 (ads SDK 24.6.0) |
| Storage | @react-native-async-storage/async-storage |
| Network | expo-network, expo-location, @react-native-community/netinfo |

## Project Structure

```
netora/
├── app/                 # expo-router screens
├── src/
│   ├── ads/             # AdMob config + ad components
│   ├── components/      # reusable UI components
│   ├── context/         # app state (history, settings, interstitial gating)
│   ├── screens/         # feature screens
│   ├── theme/           # colors, typography
│   ├── utils/           # helpers, formatters
│   └── types/           # TypeScript types
├── assets/              # icons, splash
├── store-assets/        # Play Store graphics, listing text, screenshot helper
├── docs/                # release / privacy / data-safety docs
├── app.json             # Expo config (compileSdk/targetSdk 36, AdMob app id)
└── eas.json             # EAS build profiles (preview = APK, production = AAB)
```

## Getting Started

```bash
npm install
npm start          # start Metro
npm run android    # run on Android device/emulator
```

## Scripts

```bash
npm run typecheck   # TypeScript check
npm run lint        # expo lint
npx expo-doctor     # project health check
```

## Building

```bash
# Test APK (test ads)
npx eas-cli build -p android --profile preview

# Production AAB (real ads — used for Play Store release)
npx eas-cli build -p android --profile production
```

## Build Configuration

- `compileSdk / targetSdk`: **36** (required by `androidx.core:1.18.0`)
- `buildToolsVersion`: 36.0.0
- Android-only — the app is not configured for iOS.

## Documentation

| Doc | Purpose |
|---|---|
| `docs/play-store-release.md` | Full Google Play Console release checklist (listing, data safety, content rating, permissions) |
| `docs/privacy-policy.md` | Privacy policy source |
| `docs/google-play-data-safety.md` | Data Safety form answers |
| `docs/third-party-services.md` | Third-party services inventory |
| `store-assets/store-listing.txt` | Copy-paste store listing text |
| `store-assets/capture-screenshots.sh` | Screenshot capture helper |
