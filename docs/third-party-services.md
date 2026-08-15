# Netora Third-Party Service Audit

Audit date: August 15, 2026

| Service | Purpose | Data necessarily disclosed | Stored by Netora | Key/secret |
|---|---|---|---|---|
| `speed.cloudflare.com` | Real download/upload/ping test and responding edge metadata | Public IP, standard request metadata, uploaded test bytes | Metrics/history only; public IP not stored | None |
| `www.cloudflare.com/cdn-cgi/trace` | IP version/edge fallback metadata | Public IP, standard request metadata | No | None |
| `ipapi.co` | Public IP/ISP/ASN/IP geolocation lookup (fallback chain) | Public IP, standard request metadata | No | None |
| `ipwho.is` | Public IP/ISP/ASN/IP geolocation fallback | Public IP, standard request metadata | No | None |
| `ipinfo.io` | Public IP/ISP/ASN/IP geolocation fallback | Public IP, standard request metadata | No | None |
| `airport-data.com` | Resolve Cloudflare edge airport code to server city/coordinates | Edge code, public IP/request metadata | Server label may be stored in local history after a test | None |
| `unpkg.com` | Load Leaflet JS/CSS in the map WebView | Public IP, standard request metadata | No | None |
| `basemaps.cartocdn.com` | Interactive map tiles | Public IP, tile coordinates, standard request metadata | No | None |
| OpenStreetMap/CARTO attribution | Map data licensing/attribution | No direct app API beyond CARTO tiles | No | None |
| Google AdMob (`com.google.android.gms.ads`) | Show advertisements (Banner, Native Advanced, Interstitial) | Advertising ID, IP, coarse location signals, standard ad request metadata | No | None (public App/Ad Unit IDs only) |
| Google UMP (`AdsConsent`) | EEA/regulated-region consent collection for ads | Consent choices (stored by SDK/on-device) | No | None |

## SDK audit

- Google Mobile Ads (AdMob) SDK via `react-native-google-mobile-ads` — Banner (Home, History), Native Advanced (Analytics), Interstitial (after a completed test, capped).
- Google User Messaging Platform (UMP) consent via the same package.
- No analytics/tracking SDK beyond ad measurement performed by AdMob.
- No crash reporting SDK.
- No authentication/account SDK.
- AsyncStorage stores history/preferences locally.
- NetInfo and Expo Network read Android network state.
- Expo Location is used only to request/check optional permission needed for SSID/BSSID; no GPS call is made.
- WebView renders the interactive server map.

## Security findings

- All remote URLs use HTTPS.
- No API tokens, keys, credentials, signing secrets, or backend secrets are present in source/config.
- AdMob App ID and Ad Unit IDs are public identifiers, not secrets.
- Development/testing builds use Google official test ad units; real production ad units are enabled only when `EXPO_PUBLIC_PRODUCTION_ADS` is set at build time.
- External IP lookup can be disabled in Privacy Settings.
- Runtime errors/timeouts produce unavailable/error states; example data is not substituted.
- Ads are never requested while a speed test is running, while offline, or on error.
