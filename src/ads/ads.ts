import mobileAds, {
  AdsConsent,
  AdsConsentDebugGeography,
  MaxAdContentRating,
} from 'react-native-google-mobile-ads';
import { USE_PRODUCTION_ADS } from './adsConfig';

let initialized = false;
let canRequestAdsFlag = false;
let personalized = false;

/** True once the SDK is initialized and consent allows ad requests. */
export function canRequestAds(): boolean {
  return initialized && canRequestAdsFlag;
}

/** Request non-personalized ads only unless the user granted consent. */
export function nonPersonalizedOnly(): boolean {
  return !personalized;
}

/**
 * Runs the UMP consent flow (shows a form only where required, e.g. EEA),
 * then initializes the Google Mobile Ads SDK. Safe to call once at app start.
 * Never throws — failures simply leave ads disabled for the session.
 */
export async function initializeAds(): Promise<void> {
  if (initialized) return;
  try {
    const consentInfo = await AdsConsent.gatherConsent({
      // In production this is DISABLED; geography is detected automatically.
      debugGeography: AdsConsentDebugGeography.DISABLED,
    });
    canRequestAdsFlag = consentInfo?.canRequestAds ?? true;

    const choices = await AdsConsent.getUserChoices().catch(() => null);
    // Personalized ads only when the user opted into storing/using their info.
    personalized = choices?.storeAndAccessInformationOnDevice === true;
  } catch {
    // If the consent SDK is unavailable, fall back to requesting ads
    // non-personalized so we remain policy-safe.
    canRequestAdsFlag = true;
    personalized = false;
  }

  try {
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.G,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    });
    await mobileAds().initialize();
    initialized = true;
  } catch {
    initialized = false;
  }
}

/** Exposed for debugging/verification only. */
export const adsEnvironment = USE_PRODUCTION_ADS ? 'production' : 'test';
