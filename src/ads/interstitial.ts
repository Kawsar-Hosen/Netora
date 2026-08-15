import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';
import {
  AD_UNITS,
  INTERSTITIAL_COOLDOWN_MS,
  INTERSTITIAL_EVERY_N_TESTS,
} from './adsConfig';
import { canRequestAds, nonPersonalizedOnly } from './ads';

let interstitial: InterstitialAd | null = null;
let completedTests = 0;
let lastShownAt = 0;

function build(): InterstitialAd {
  const ad = InterstitialAd.createForAdRequest(AD_UNITS.interstitial, {
    requestNonPersonalizedAdsOnly: nonPersonalizedOnly(),
  });
  ad.addAdEventListener(AdEventType.CLOSED, () => {
    // Preload the next interstitial after the current one is dismissed.
    interstitial = null;
    preloadInterstitial();
  });
  ad.addAdEventListener(AdEventType.ERROR, () => {
    interstitial = null;
  });
  return ad;
}

/** Loads an interstitial in the background so it is ready when eligible. */
export function preloadInterstitial(): void {
  if (!canRequestAds()) return;
  if (interstitial) return;
  try {
    interstitial = build();
    interstitial.load();
  } catch {
    interstitial = null;
  }
}

/**
 * Shows an interstitial only after a *completed* speed test, subject to:
 *  - ads are permitted (SDK initialized + consent),
 *  - the device is online,
 *  - one interstitial per INTERSTITIAL_EVERY_N_TESTS completed tests,
 *  - a minimum INTERSTITIAL_COOLDOWN_MS gap between two interstitials,
 *  - the ad is actually loaded.
 * Never shown while a test is running, offline, or on error.
 */
export function maybeShowInterstitialAfterTest(online: boolean): void {
  if (!canRequestAds() || !online) return;

  completedTests += 1;
  if (completedTests % INTERSTITIAL_EVERY_N_TESTS !== 0) {
    preloadInterstitial();
    return;
  }

  const now = Date.now();
  if (now - lastShownAt < INTERSTITIAL_COOLDOWN_MS) {
    preloadInterstitial();
    return;
  }

  if (interstitial && interstitial.loaded) {
    try {
      lastShownAt = now;
      interstitial.show();
    } catch {
      interstitial = null;
      preloadInterstitial();
    }
  } else {
    // Not ready this time — make sure one is loading for next time.
    preloadInterstitial();
  }
}
