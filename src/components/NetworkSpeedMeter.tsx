import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colorsFor } from '@/theme/theme';
import { speedScale } from '@/data/speedTest';
import { LiveSpeedGraph } from '@/components/LiveSpeedGraph';
import { displaySpeed } from '@/data/units';
import type { SpeedUnit } from '@/types/models';

const TICKS = 54;

export function NetworkSpeedMeter({ value, phase, dark, size, unit }: { value: number | null; phase: 'idle' | 'testing' | 'complete' | 'error'; dark: boolean; size: number; unit: SpeedUnit }) {
  const C = colorsFor(dark);
  const pulse = useRef(new Animated.Value(0.55)).current;
  const activeTicks = Math.round(speedScale(value) * TICKS);
  const display = displaySpeed(value, unit);

  useEffect(() => {
    if (phase !== 'testing') {
      pulse.stopAnimation();
      pulse.setValue(0.55);
      return;
    }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 850, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0.55, duration: 850, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [phase, pulse]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.eyebrow, { color: C.subtext }]}>CURRENT THROUGHPUT</Text>
          <Text style={[styles.title, { color: C.text }]}>Network Speed</Text>
        </View>
        <Animated.View style={[styles.liveBadge, { borderColor: C.line, opacity: phase === 'testing' ? pulse : 1 }]}>
          <View style={[styles.liveDot, { backgroundColor: phase === 'testing' ? C.success : C.subtext }]} />
          <Text style={[styles.liveText, { color: C.subtext }]}>{phase === 'testing' ? 'LIVE' : phase === 'complete' ? 'DONE' : 'READY'}</Text>
        </Animated.View>
      </View>
      <View style={[styles.dial, { width: size, height: size * 0.88 }]}>
        {Array.from({ length: TICKS }).map((_, index) => {
          const angle = -135 + (index / (TICKS - 1)) * 270;
          const active = index < activeTicks;
          return (
            <View key={index} style={[styles.tickSlot, { width: size, height: size * 0.88, transform: [{ rotate: `${angle}deg` }] }]}>
              <View style={[styles.tick, { backgroundColor: active ? (index % 3 === 0 ? C.blue : C.accent) : C.line, opacity: active ? 1 : 0.62 }]} />
            </View>
          );
        })}
        <View style={[styles.innerCircle, { borderColor: C.line, width: size * 0.7, height: size * 0.7, borderRadius: size * 0.35, marginTop: size * 0.056 }]}>
          <View style={styles.numberRow}>
            <Text style={[styles.number, { color: C.text, fontSize: Math.max(40, size * 0.19) }]}>{display}</Text>
            <Text style={[styles.unit, { color: C.subtext }]}>{unit}</Text>
          </View>
          <Text style={[styles.state, { color: C.subtext }]}>{phase === 'testing' ? 'Testing connection…' : phase === 'complete' ? 'Test complete' : phase === 'error' ? 'Test unavailable' : 'Ready when you are'}</Text>
          <Ionicons name={phase === 'testing' ? 'pulse-outline' : 'radio-outline'} size={18} color={phase === 'testing' ? C.accent : C.subtext} style={styles.centerIcon} />
        </View>
      </View>
      <LiveSpeedGraph value={value} testing={phase === 'testing'} color={C.accent} dark={dark} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center' },
  headerRow: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { fontSize: 9, letterSpacing: 1.5, fontWeight: '800' },
  title: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 16, paddingHorizontal: 9, paddingVertical: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveText: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  dial: { alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  tickSlot: { position: 'absolute', alignItems: 'center' },
  tick: { width: 3, height: 10, borderRadius: 2, marginTop: 4 },
  innerCircle: { borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  numberRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5 },
  number: { fontWeight: '800', letterSpacing: -2 },
  unit: { fontSize: 13, fontWeight: '700' },
  state: { fontSize: 12, marginTop: 7 },
  centerIcon: { marginTop: 12 },
});
