import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colorsFor } from '@/theme/theme';
import { speedScale } from '@/data/speedTest';
import { displaySpeed } from '@/data/units';
import type { SpeedUnit } from '@/types/models';

export function MiniSpeedMeter({ kind, value, dark, unit }: { kind: 'download' | 'upload'; value: number | null; dark: boolean; unit: SpeedUnit }) {
  const C = colorsFor(dark);
  const color = kind === 'download' ? C.blue : dark ? '#B99CFF' : '#7654C7';
  const label = kind === 'download' ? 'Download' : 'Upload';
  const icon = kind === 'download' ? 'arrow-down-outline' : 'arrow-up-outline';
  const display = displaySpeed(value, unit);
  const progress = speedScale(value);
  const ticks = 12;
  return (
    <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.line }]}>
      <View style={styles.heading}><View style={[styles.icon, { backgroundColor: `${color}20` }]}><Ionicons name={icon} size={17} color={color} /></View><Text style={[styles.label, { color: C.subtext }]}>{label}</Text></View>
      <View style={styles.meterRow}>
        <View style={styles.miniDial}>
          {Array.from({ length: ticks }).map((_, index) => <View key={index} style={[styles.tickSlot, { transform: [{ rotate: `${-135 + (index / (ticks - 1)) * 270}deg` }] }]}><View style={[styles.miniTick, { backgroundColor: index < Math.round(progress * ticks) ? color : C.line }]} /></View>)}
          <View style={[styles.miniCore, { borderColor: C.line }]} />
        </View>
        <View style={styles.valueBlock}><Text style={[styles.value, { color: C.text }]}>{display}</Text><Text style={[styles.unit, { color: C.subtext }]}>{unit}</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 0, borderWidth: 1, borderRadius: 14, padding: 14 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 13, fontWeight: '700' },
  meterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 13, gap: 8 },
  miniDial: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center' },
  tickSlot: { position: 'absolute', width: 54, height: 54, alignItems: 'center' },
  miniTick: { width: 2, height: 7, borderRadius: 2, marginTop: 2 },
  miniCore: { width: 38, height: 38, borderRadius: 19, borderWidth: 1 },
  valueBlock: { alignItems: 'flex-end', flex: 1 },
  value: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  unit: { fontSize: 10, fontWeight: '700', marginTop: 1 },
});
