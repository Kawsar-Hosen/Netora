import { TestIds } from 'react-native-google-mobile-ads';

/**
 * Ad unit configuration for Netora (Android only).
 *
 * Development / testing builds use Google's official test ad unit IDs.
 * Production builds use the real AdMob ad units, enabled ONLY when the
 * build-time env var EXPO_PUBLIC_PRODUCTION_ADS is set to a truthy value
 * (e.g. `eas build --env EXPO_PUBLIC_PRODUCTION_ADS=1 ...`).
 *
 * Test ads work correctly with the real App ID declared in app.json, so no
 * production impressions are generated while testing on a real device.
 */
export const USE_PRODUCTION_ADS =
  process.env.EXPO_PUBLIC_PRODUCTION_ADS === '1' ||
  process.env.EXPO_PUBLIC_PRODUCTION_ADS === 'true';

/** Real production AdMob ad unit IDs (Android). */
const PRODUCTION_AD_UNITS = {
  banner: 'ca-app-pub-8665718760035175/3952957919',
  native: 'ca-app-pub-8665718760035175/6462882826',
  interstitial: 'ca-app-pub-8665718760035175/1329975644',
} as const;

/** Google official test ad unit IDs — never generate real revenue. */
const TEST_AD_UNITS = {
  banner: TestIds.BANNER,
  native: TestIds.NATIVE,
  interstitial: TestIds.INTERSTITIAL,
} as const;

export const AD_UNITS = USE_PRODUCTION_ADS ? PRODUCTION_AD_UNITS : TEST_AD_UNITS;

/** Interstitial pacing: show at most once every N completed tests. */
export const INTERSTITIAL_EVERY_N_TESTS = 2;
/** Interstitial pacing: minimum gap between two interstitials (ms). */
export const INTERSTITIAL_COOLDOWN_MS = 90_000;
