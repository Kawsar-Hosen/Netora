# Google Play Data Safety Preparation — Netora

This document is a preparation worksheet, not legal advice. Final Play Console answers must match the exact release binary and current Google definitions.

## App identity

- App: Netora
- Package: `com.netora.networkutility`
- Version: `1.0.0` (`versionCode` 1)
- Platform: Android only

## Collection summary

Netora has no account, ads, analytics, or Netora backend. Test history and preferences remain on-device. However, network functionality sends requests directly from the device to third-party services. Under Google Play definitions, data transmitted off-device may count as collected even if Netora does not retain it.

### Likely disclosures

| Data type | Why processed | Required/optional | Stored by Netora | Shared/sold |
|---|---|---|---|---|
| IP address | Speed test, public-IP/ISP lookup, server routing, map requests | Speed test/map required for those features; public lookup optional | No (history excludes IP) | Sent to service providers; not sold |
| Approximate location | Derived by optional IP lookup; server map uses server coordinates, not user GPS | Optional for public network details | No | Lookup provider returns/processes it |
| App activity / diagnostics | Measured speed, ping, jitter, packet loss | User-initiated functionality | Stored locally in History | Not sent to Netora backend; test bytes/requests go to Cloudflare |
| Device/network identifiers | Wi-Fi SSID/BSSID shown locally when permission granted | Optional | Not stored in history | Not transmitted by Netora intentionally |

## Security practices

- Data encrypted in transit: Yes, all app endpoints use HTTPS.
- User can request deletion: No account/server-side data exists; users can delete local history in-app or clear/uninstall app data.
- Data sale: No.
- Advertising: No.
- Tracking: No.

## Permissions declaration

- `ACCESS_NETWORK_STATE`: detect connectivity/transport.
- `ACCESS_WIFI_STATE`: read available Wi-Fi diagnostics.
- `ACCESS_FINE_LOCATION`: optional Android requirement for SSID/BSSID only. Requested in context after an explicit user action; core features work when denied.

## Store submission checklist

- [ ] Publish `privacy-policy.html` at a stable public HTTPS URL.
- [ ] Add monitored support email to policy and Play listing.
- [ ] Reconfirm every endpoint/SDK in the final release binary.
- [ ] Complete Play Console Data Safety using the then-current definitions.
- [ ] Explain optional location permission in the permission declaration if requested by Play review.
- [ ] Confirm no analytics/crash SDK is added before release.
