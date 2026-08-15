import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colorsFor } from '@/theme/theme';

export function LiveSpeedGraph({ value, testing, color, dark }: { value: number | null; testing: boolean; color: string; dark: boolean }) {
  const C = colorsFor(dark);
  const pulse = useRef(new Animated.Value(0.45)).current;
  const normalized = value == null ? 0 : Math.min(1, Math.max(0, value / 200));

  useEffect(() => {
    if (!testing) {
      pulse.stopAnimation();
      pulse.setValue(0.45);
      return;
    }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0.45, duration: 700, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [pulse, testing]);

  return (
    <View style={styles.wrap} accessibilityLabel={testing ? 'Live measured speed graph' : 'Speed graph'}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${normalized * 100}%`, backgroundColor: color }]} />
        <Animated.View style={[styles.liveDot, { backgroundColor: color, opacity: pulse, left: `${normalized * 100}%` }]} />
      </View>
      <View style={styles.captionRow}>
        <Text style={[styles.caption, { color: C.subtext }]}>0 Mbps</Text>
        <Text style={[styles.caption, { color: C.subtext }]}>{testing ? 'LIVE MEASUREMENT' : 'MEASURED THROUGHPUT'}</Text>
        <Text style={[styles.caption, { color: C.subtext }]}>200+</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', marginTop: 22 },
  track: { height: 4, borderRadius: 4, backgroundColor: 'rgba(127, 153, 165, 0.22)', position: 'relative', overflow: 'visible' },
  fill: { height: 4, borderRadius: 4 },
  liveDot: { position: 'absolute', top: -4, width: 12, height: 12, borderRadius: 6, marginLeft: -6 },
  captionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 9 },
  caption: { fontSize: 9, letterSpacing: 0.7, fontWeight: '700' },
});
