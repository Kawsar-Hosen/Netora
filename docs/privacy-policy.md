# Netora Privacy Policy

**Effective date:** August 15, 2026  
**App:** Netora for Android  
**Package:** `com.netora.networkutility`

Netora is a local-first network diagnostic utility. This policy describes what the app reads, what information leaves the device, and what Netora stores.

## Information Netora Handles

Netora reads Android network state to identify whether Wi-Fi, mobile data, or no internet is active. When Android makes fields available, Netora may display Wi-Fi signal strength, link speed, frequency, channel, local IP, mobile carrier, and cellular generation. Speed tests measure download throughput, upload throughput, ping, jitter, and failed latency samples used as packet loss.

## Optional Wi-Fi Identifiers

Wi-Fi SSID and BSSID require Android foreground location permission. Netora requests this permission only after you choose **Enable Wi-Fi name access** in Privacy Settings. Netora does not request or read GPS coordinates. Denying the permission does not affect speed tests, mobile data support, public network lookup, server detection, or other diagnostics.

## Optional External Network Details

When **Public network details** is enabled, Netora contacts external IP lookup services to display the current public IP, IP version, ISP, ASN, and approximate IP-derived city/country. The result is held in memory for the current connection and is not written to Netora history. You can disable these lookups in Privacy Settings.

The app may use the following fallback providers: `ipapi.co`, `ipwho.is`, and `ipinfo.io`. Each provider necessarily receives your public IP and standard HTTPS request metadata. Their own privacy policies govern their processing.

## Speed Test Server and Map

Speed testing uses `speed.cloudflare.com`. Cloudflare Anycast selects the edge that answers on the current network. Netora reads the returned edge code and may contact `airport-data.com` to resolve that code to a city and map coordinates. The interactive map loads Leaflet resources from `unpkg.com` and CARTO/OpenStreetMap tiles. Server location is not your physical GPS location.

## Local Storage

Test history and preferences are stored locally using Android application storage. History contains measured speeds, latency results, connection type/name, and the responding server label. Netora has no account system and no Netora backend. You can delete individual history items or clear all history. Local data remains until deletion, app data is cleared, or the app is uninstalled.

## Sharing, Advertising, and Analytics

Netora shows advertisements through **Google AdMob** (banner, native, and interstitial formats). To serve and measure ads, Google AdMob may access your device's advertising ID, IP address, and coarse ad-request signals. Netora does not store this information and does not operate its own analytics or tracking SDK.

Interstitial ads are shown only after a completed speed test, with a frequency cap, and never while a test is running, while offline, or on error.

For users in the EEA, the UK, and other regulated regions, Netora presents a Google User Messaging Platform (UMP) consent form before requesting ads. If you do not consent to personalized ads, only non-personalized ads are requested. You can review Google's advertising practices at https://policies.google.com/technologies/ads.

Netora does not sell personal information. External infrastructure providers receive standard request information when your device contacts their service.

## Security

Netora uses HTTPS for network lookups, speed tests, edge resolution, and map resources. Public IP/ISP/ASN results are not persisted by Netora. No secret API keys are embedded in the app.

## Children

Netora is a general network utility and is not directed to children.

## Changes

This policy may be updated when app features or service providers change. The effective date identifies the current version.

## Contact and Public URL

- Support email: `support@xyteee.com`
- Public policy URL: `https://xyteee.com/netora/privacy-policy`
