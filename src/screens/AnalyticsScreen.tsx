import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Header, Label, Metric, Pill, Screen } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { colorsFor } from '@/theme/theme';
import { displaySpeed } from '@/data/units';

function qualityFor(ping: number | null, jitter: number | null, loss: number | null): string {
  if (ping == null || jitter == null || loss == null) return 'Run a test';
  if (loss === 0 && ping < 60 && jitter < 10) return 'Excellent';
  if (loss <= 1 && ping < 120 && jitter < 30) return 'Good';
  if (loss <= 3 && ping < 220 && jitter < 60) return 'Fair';
  return 'Poor';
}

function RowText({ label, value, C }: { label: string; value: string; C: ReturnType<typeof colorsFor> }) {
  return <View style={[styles.row, { borderBottomColor: C.line }]}><Text style={{ color: C.subtext }}>{label}</Text><Text style={styles.rowValue} numberOfLines={2}><Text style={{ color: C.text, fontWeight: '700' }}>{value}</Text></Text></View>;
}

export default function AnalyticsScreen() {
  const { dark, test, network, ipInfo, currentServer, unit } = useApp(); const C = colorsFor(dark);
  const complete = test.phase === 'complete';
  const quality = complete ? qualityFor(test.ping, test.jitter, test.packetLoss) : 'Run a test';
  const server = currentServer ? [currentServer.city, currentServer.country, currentServer.colo].filter(Boolean).join(' · ') : 'Unavailable';
  const provider = network.type === 'Mobile data' ? network.carrier ?? ipInfo?.isp : ipInfo?.isp;
  return (
    <Screen>
      <Header title="Analytics" subtitle="Measured connection diagnostics" />
      <Card>
        <View style={styles.top}><View><Label>Latest download</Label><Text style={[styles.big, { color: C.text }]}>{complete ? displaySpeed(test.download, unit) : '--'} <Text style={[styles.small, { color: C.subtext }]}>{unit}</Text></Text></View><Pill tone={network.connected ? 'accent' : 'muted'}>{network.connected ? network.type : 'Offline'}</Pill></View>
        <Text style={[styles.caption, { color: C.subtext }]}>{complete ? 'Values are from the latest completed test on this connection.' : 'Complete a speed test to populate analytics.'}</Text>
      </Card>
      <View style={styles.grid}><Metric label="Upload" value={complete ? displaySpeed(test.upload, unit) : '--'} unit={unit} /><Metric label="Ping" value={complete ? test.ping ?? '--' : '--'} unit="ms" /><Metric label="Jitter" value={complete ? test.jitter ?? '--' : '--'} unit="ms" /><Metric label="Packet loss" value={complete ? test.packetLoss ?? '--' : '--'} unit="%" /></View>
      <Card>
        <Text style={[styles.cardTitle, { color: C.text }]}>Connection profile</Text>
        <View><RowText label="Measured quality" value={quality} C={C} /><RowText label="Transport" value={network.type === 'Mobile data' && network.networkGeneration ? `${network.type} · ${network.networkGeneration}` : network.type} C={C} /><RowText label="Signal strength" value={network.signal != null ? `${network.signal}%` : 'Unavailable'} C={C} /><RowText label="ISP / carrier" value={provider ?? 'Unavailable'} C={C} /><RowText label="Test server" value={network.connected ? server : 'Unavailable'} C={C} /></View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  big: { fontSize: 32, fontWeight: '800', marginTop: 6 },
  small: { fontSize: 13, fontWeight: '500' },
  caption: { fontSize: 11, lineHeight: 17, marginTop: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 16, marginBottom: 14 },
  cardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 14, paddingVertical: 13, borderBottomWidth: 1 },
  rowValue: { maxWidth: '58%', textAlign: 'right' },
});
