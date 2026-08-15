import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AD_UNITS } from '@/ads/adsConfig';
import { canRequestAds, nonPersonalizedOnly } from '@/ads/ads';

/**
 * Anchored adaptive banner used at the bottom of Home and History.
 * Renders nothing when ads cannot be requested (no consent / not initialized)
 * or when the ad fails to load, so it never leaves an empty gap.
 */
export function BannerAdView() {
  const [failed, setFailed] = useState(false);
  if (!canRequestAds() || failed) return null;
  return (
    <View style={styles.wrap}>
      <BannerAd
        unitId={AD_UNITS.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: nonPersonalizedOnly() }}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, marginBottom: 14, minHeight: 50 },
});
