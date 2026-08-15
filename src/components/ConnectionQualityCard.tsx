import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Label, Pill } from '@/components/ui';
import { colorsFor } from '@/theme/theme';

export function ConnectionQualityCard({ dark, ping, jitter, packetLoss, complete }: { dark: boolean; ping: number | null; jitter: number | null; packetLoss: number | null; complete: boolean }) {
  const C = colorsFor(dark);
  const display = (value: number | null, unit: string) => value == null ? `-- ${unit}` : `${value} ${unit}`;
  return (
    <Card style={styles.card}>
      <View style={styles.header}><View><Text style={[styles.title, { color: C.text }]}>Connection quality</Text><Label>Response and stability</Label></View><Pill tone={complete ? 'accent' : 'muted'}>{complete ? 'Measured' : 'Not tested'}</Pill></View>
      <View style={styles.metrics}>
        <View style={styles.metric}><Ionicons name="flash-outline" size={17} color={C.success} /><Label>Ping</Label><Text style={[styles.value, { color: C.text }]}>{display(ping, 'ms')}</Text></View>
        <View style={styles.metric}><Ionicons name="pulse-outline" size={17} color={C.warning} /><Label>Jitter</Label><Text style={[styles.value, { color: C.text }]}>{display(jitter, 'ms')}</Text></View>
        <View style={styles.metric}><Ionicons name="alert-circle-outline" size={17} color={C.danger} /><Label>Packet loss</Label><Text style={[styles.value, { color: C.text }]}>{display(packetLoss, '%')}</Text></View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: 17 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 16, fontWeight: '800' },
  metrics: { flexDirection: 'row', gap: 10, marginTop: 22 },
  metric: { flex: 1, gap: 6 },
  value: { fontSize: 15, fontWeight: '800' },
});
