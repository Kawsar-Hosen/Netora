import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
} from 'react-native-google-mobile-ads';
import { AD_UNITS } from '@/ads/adsConfig';
import { canRequestAds, nonPersonalizedOnly } from '@/ads/ads';
import { useApp } from '@/context/AppContext';
import { colorsFor } from '@/theme/theme';

/**
 * Native Advanced ad rendered as a Netora-style card (Analytics screen).
 * Clearly labelled "Sponsored" per AdMob policy. Renders nothing until an
 * ad is available, and cleans up the native ad on unmount.
 */
export function NativeAdCard() {
  const { dark } = useApp();
  const C = colorsFor(dark);
  const [ad, setAd] = useState<NativeAd | null>(null);

  useEffect(() => {
    let mounted = true;
    let loaded: NativeAd | null = null;
    if (canRequestAds()) {
      NativeAd.createForAdRequest(AD_UNITS.native, {
        requestNonPersonalizedAdsOnly: nonPersonalizedOnly(),
      })
        .then((nativeAd) => {
          if (!mounted) {
            nativeAd.destroy();
            return;
          }
          loaded = nativeAd;
          setAd(nativeAd);
        })
        .catch(() => undefined);
    }
    return () => {
      mounted = false;
      loaded?.destroy();
    };
  }, []);

  if (!ad) return null;

  return (
    <NativeAdView nativeAd={ad} style={[styles.card, { backgroundColor: C.surface, borderColor: C.line }]}>
      <View style={styles.header}>
        {ad.icon?.url ? (
          <NativeAsset assetType={NativeAssetType.ICON}>
            <Image source={{ uri: ad.icon.url }} style={styles.icon} />
          </NativeAsset>
        ) : (
          <View style={[styles.icon, styles.iconFallback, { backgroundColor: C.line }]}>
            <Ionicons name="megaphone-outline" size={18} color={C.subtext} />
          </View>
        )}
        <View style={styles.headText}>
          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <Text numberOfLines={1} style={[styles.headline, { color: C.text }]}>{ad.headline}</Text>
          </NativeAsset>
          {ad.advertiser ? (
            <NativeAsset assetType={NativeAssetType.ADVERTISER}>
              <Text numberOfLines={1} style={[styles.advertiser, { color: C.subtext }]}>{ad.advertiser}</Text>
            </NativeAsset>
          ) : null}
        </View>
        <View style={[styles.badge, { backgroundColor: C.line }]}>
          <Text style={[styles.badgeText, { color: C.subtext }]}>Sponsored</Text>
        </View>
      </View>

      <NativeMediaView style={styles.media} resizeMode="cover" />

      {ad.body ? (
        <NativeAsset assetType={NativeAssetType.BODY}>
          <Text numberOfLines={2} style={[styles.body, { color: C.subtext }]}>{ad.body}</Text>
        </NativeAsset>
      ) : null}

      <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
        <View style={[styles.cta, { backgroundColor: C.accent }]}>
          <Text style={[styles.ctaText, { color: C.accentText }]}>{ad.callToAction}</Text>
        </View>
      </NativeAsset>
    </NativeAdView>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 20, borderRadius: 10, borderWidth: 1, padding: 17, marginBottom: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  icon: { width: 38, height: 38, borderRadius: 9 },
  iconFallback: { alignItems: 'center', justifyContent: 'center' },
  headText: { flex: 1 },
  headline: { fontSize: 14, fontWeight: '700' },
  advertiser: { fontSize: 11, marginTop: 3 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  media: { width: '100%', height: 140, borderRadius: 8, marginTop: 13, overflow: 'hidden' },
  body: { fontSize: 12, lineHeight: 18, marginTop: 12 },
  cta: { marginTop: 14, borderRadius: 22, minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  ctaText: { fontSize: 14, fontWeight: '800' },
});
