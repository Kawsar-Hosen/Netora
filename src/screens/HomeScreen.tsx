import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Card, Header, Pill, Screen } from '@/components/ui';
import { ConnectionQualityCard } from '@/components/ConnectionQualityCard';
import { MiniSpeedMeter } from '@/components/MiniSpeedMeter';
import { NetworkSpeedMeter } from '@/components/NetworkSpeedMeter';
import { useApp } from '@/context/AppContext';
import { colorsFor } from '@/theme/theme';

export default function HomeScreen() {
  const { dark, network, test, currentServer, unit, runTest } = useApp();
  const C = colorsFor(dark);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const compact = width < 350;
  const meterSize = Math.min(248, Math.max(218, width - 82));
  const liveSpeed = test.phase === 'testing'
    ? (test.metric === 'download' ? test.download : test.upload)
    : test.phase === 'complete' ? test.download : null;
  const status = test.phase === 'testing'
    ? `Measuring ${test.metric} · ${Math.round(test.progress * 100)}%`
    : test.phase === 'complete' ? 'Your latest measurement is ready'
    : test.phase === 'error' ? test.error
    : 'Measure your current internet performance';
  const connectionTitle = !network.connected || network.internetReachable === false
    ? 'No Internet Connection'
    : network.type === 'Wi-Fi' ? 'Connected to Wi-Fi'
    : network.type === 'Mobile data' ? 'Connected to Mobile Data'
    : `Connected via ${network.type}`;
  const connectionDetail = network.type === 'Wi-Fi'
    ? (network.ssid ?? 'Wi-Fi network')
    : network.type === 'Mobile data'
      ? [network.carrier, network.networkGeneration].filter(Boolean).join(' · ') || 'Cellular network'
      : network.connected ? 'Internet connection available' : 'Connect before starting a test';
  const serverLabel = currentServer
    ? [currentServer.city, currentServer.country, currentServer.colo ? `(${currentServer.colo})` : null].filter(Boolean).join(', ')
    : 'Auto / Best Server';

  return (
    <Screen>
      <Header
        title="Speed test"
        subtitle="Real throughput, clearly separated"
        action={<Pressable accessibilityLabel="Open settings" onPress={() => router.push('/settings')} style={styles.settings}><Ionicons name="settings-outline" size={22} color={C.text} /></Pressable>}
      />
      <View style={styles.networkLine}>
        <View style={[styles.dot, { backgroundColor: network.connected ? C.success : C.danger }]} />
        <View style={styles.networkCopy}>
          <Text style={[styles.networkName, { color: C.text }]} numberOfLines={1}>{connectionTitle}</Text>
          <Text style={[styles.networkDetail, { color: C.subtext }]} numberOfLines={1}>{connectionDetail}</Text>
        </View>
        <Pill tone="muted">{network.type}</Pill>
      </View>

      <Card style={styles.heroCard}>
        <NetworkSpeedMeter value={liveSpeed} phase={test.phase} dark={dark} size={meterSize} unit={unit} />
        <Text style={[styles.status, { color: test.phase === 'error' ? C.danger : C.subtext }]}>{status}</Text>
        <Pressable
          accessibilityRole="button"
          disabled={test.phase === 'testing' || !network.connected || network.internetReachable === false}
          onPress={runTest}
          style={({ pressed }) => [styles.testButton, { backgroundColor: C.accent, opacity: test.phase === 'testing' || !network.connected || network.internetReachable === false ? 0.55 : pressed ? 0.84 : 1 }]}
        >
          <Ionicons name={test.phase === 'testing' ? 'pulse' : 'play'} size={18} color={C.accentText} />
          <Text style={[styles.testButtonText, { color: C.accentText }]}>{!network.connected || network.internetReachable === false ? 'No internet connection' : test.phase === 'testing' ? 'Testing connection' : test.phase === 'error' ? 'Try again' : 'Start test'}</Text>
        </Pressable>
      </Card>

      <View style={[styles.miniMeters, compact && styles.miniMetersCompact]}>
        <MiniSpeedMeter kind="download" value={test.download} dark={dark} unit={unit} />
        <MiniSpeedMeter kind="upload" value={test.upload} dark={dark} unit={unit} />
      </View>

      <ConnectionQualityCard dark={dark} ping={test.ping} jitter={test.jitter} packetLoss={test.packetLoss} complete={test.phase === 'complete'} />
      <Card style={styles.serverCard}>
        <View style={styles.serverLine}><Ionicons name="server-outline" size={17} color={C.accent} /><Text style={[styles.serverText, { color: C.subtext }]} numberOfLines={1}>{network.connected ? serverLabel : 'Server unavailable offline'}</Text><Pressable onPress={() => router.push('/servers')}><Text style={[styles.serverAction, { color: C.accent }]}>Details</Text></Pressable></View>
        {test.phase === 'complete' && <Pressable onPress={() => router.push('/analytics')} style={styles.details}><Text style={[styles.detailsText, { color: C.accent }]}>View full analytics</Text><Ionicons name="arrow-forward" size={15} color={C.accent} /></Pressable>}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  settings: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  networkLine: { marginHorizontal: 20, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 9, height: 9, borderRadius: 4.5 },
  networkCopy: { flex: 1 },
  networkName: { fontSize: 14, fontWeight: '700' },
  networkDetail: { fontSize: 11, marginTop: 3 },
  heroCard: { alignItems: 'center', borderRadius: 18, paddingVertical: 20 },
  status: { fontSize: 12, marginTop: 17, textAlign: 'center', minHeight: 18 },
  testButton: { minHeight: 50, minWidth: 170, borderRadius: 25, paddingHorizontal: 25, marginTop: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  testButtonText: { fontSize: 14, fontWeight: '800' },
  miniMeters: { marginHorizontal: 20, marginBottom: 14, flexDirection: 'row', gap: 12 },
  miniMetersCompact: { flexDirection: 'column' },
  serverCard: { paddingVertical: 14 },
  serverLine: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  serverText: { flex: 1, fontSize: 12, fontWeight: '600' },
  serverAction: { fontSize: 12, fontWeight: '800' },
  details: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14, paddingTop: 13, borderTopWidth: 1, borderTopColor: 'rgba(127, 153, 165, 0.22)' },
  detailsText: { fontSize: 13, fontWeight: '800' },
});
