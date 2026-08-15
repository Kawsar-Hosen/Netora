import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import ServerMap from '@/components/ServerMap';
import { Card, Header, Label, Pill, Row, Screen } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { unavailable } from '@/data/network';
import { colorsFor } from '@/theme/theme';

function DetailSection({ icon, title, children }: { icon: keyof typeof Ionicons.glyphMap; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { dark } = useApp(); const C = colorsFor(dark);
  return (
    <View style={[styles.section, { borderBottomColor: C.line }]}>
      <Pressable accessibilityRole="button" onPress={() => setOpen(o => !o)} style={styles.sectionHead}>
        <Ionicons name={icon} size={18} color={C.accent} />
        <Text style={[styles.sectionTitle, { color: C.text }]}>{title}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={C.subtext} />
      </Pressable>
      {open && <View style={styles.sectionBody}>{children}</View>}
    </View>
  );
}

function Note({ children }: { children: React.ReactNode }) { const { dark } = useApp(); const C = colorsFor(dark); return <Text style={[styles.note, { color: C.subtext }]}>{children}</Text>; }

export default function NetworkScreen() {
  const { dark, network, test, currentServer, ipInfo, ipInfoState, refreshIpInfo } = useApp();
  const C = colorsFor(dark); const router = useRouter();
  const online = network.connected && network.internetReachable !== false;
  const serverCity = currentServer ? [currentServer.city, currentServer.country].filter(Boolean).join(', ') || currentServer.colo : null;
  const ping = test.ping;
  const quality = ping == null ? null : ping < 60 ? 'Excellent' : ping < 120 ? 'Good' : ping < 220 ? 'Fair' : 'Poor';
  const connectedVia = ipInfo && ipInfo.ipv4 && ipInfo.ipv6 ? 'IPv4 / IPv6' : ipInfo ? ipInfo.version : null;

  return (
    <Screen>
      <Header title="Network" subtitle="Server, connection and address details" />
      <Card style={styles.statusCard}>
        <View style={styles.statusLine}>
          <View style={[styles.dot, { backgroundColor: online ? C.success : C.danger }]} />
          <Text style={[styles.statusText, { color: C.text }]}>{online ? (network.type === 'Wi-Fi' ? 'Connected to Wi-Fi' : network.type === 'Mobile data' ? 'Connected to Mobile Data' : 'Connected') : 'No Internet Connection'}</Text>
          <Pill tone={online ? 'accent' : 'muted'}>{network.type}</Pill>
        </View>
        <View style={styles.statusMeta}>
          <View style={styles.statusMetaItem}><Label>Network type</Label><Text style={[styles.metaValue, { color: C.text }]}>{network.type === 'Mobile data' && network.networkGeneration ? `${network.type} · ${network.networkGeneration}` : network.type}</Text></View>
          <View style={styles.statusMetaItem}><Label>Connection quality</Label><Text style={[styles.metaValue, { color: C.text }]}>{quality ?? 'Not measured'}</Text></View>
        </View>
      </Card>

      <Card>
        <View style={styles.cardHead}>
          <Text style={[styles.cardTitle, { color: C.text }]}>Server location</Text>
          <Pressable accessibilityRole="button" onPress={() => router.push('/servers')} style={styles.change}><Text style={{ color: C.accent, fontWeight: '700', fontSize: 13 }}>Change</Text></Pressable>
        </View>
        {online && currentServer?.lat != null && currentServer.lon != null ? (
          <ServerMap lat={currentServer.lat} lon={currentServer.lon} label={serverCity ?? currentServer.colo ?? 'Test server'} />
        ) : (
          <View style={[styles.mapEmpty, { backgroundColor: C.surface }]}>
            {!online ? (<><Ionicons name="cloud-offline-outline" size={30} color={C.subtext} /><Text style={[styles.mapEmptyText, { color: C.subtext }]}>Server unavailable while offline.</Text></>) : !currentServer ? (<><ActivityIndicator color={C.accent} /><Text style={[styles.mapEmptyText, { color: C.subtext }]}>Detecting the current speed-test edge…</Text></>) : (<><Ionicons name="map-outline" size={30} color={C.subtext} /><Text style={[styles.mapEmptyText, { color: C.subtext }]}>Server coordinates are unavailable.</Text></>)}
          </View>
        )}
        <View style={[styles.serverLine, { borderBottomColor: C.line }]}>
          <Ionicons name="location" size={18} color={C.accent} />
          <Text style={[styles.serverCity, { color: C.text }]}>{online ? serverCity ?? currentServer?.colo ?? 'Detecting…' : 'Unavailable'}</Text>
        </View>
        <Row icon="server-outline" label="Test server" value={online ? currentServer ? `${currentServer.name}${currentServer.colo ? ` · ${currentServer.colo}` : ''}` : 'Auto / Best Server' : 'Unavailable'} />
        <Row icon="pulse-outline" label="Latency" value={online && ping != null ? `${ping} ms` : 'Unavailable'} />
        <Note>The map shows where the speed-test server runs, not your device location.</Note>
      </Card>

      <Card>
        <Text style={[styles.cardTitle, { color: C.text }]}>Connection</Text>
        {!online && <Text style={[styles.errorText, { color: C.danger }]}>No Internet Connection</Text>}
        {online && ipInfoState === 'loading' && <View style={styles.loadingLine}><ActivityIndicator color={C.accent} /><Text style={[styles.loadingText, { color: C.subtext }]}>Fetching network details…</Text></View>}
        {online && ipInfoState === 'error' && (
          <View style={styles.errorLine}>
            <Text style={[styles.errorText, { color: C.danger }]}>Could not reach the IP lookup service.</Text>
            <Pressable accessibilityRole="button" onPress={refreshIpInfo} style={[styles.retryBtn, { borderColor: C.accent }]}><Text style={{ color: C.accent, fontWeight: '700', fontSize: 13 }}>Retry</Text></Pressable>
          </View>
        )}
        {online && ipInfoState === 'disabled' && <View style={styles.errorLine}><Text style={[styles.loadingText, { color: C.subtext }]}>Public IP, ISP and ASN lookup is disabled in Privacy Settings.</Text><Pressable accessibilityRole="button" onPress={() => router.push('/privacy-settings')} style={[styles.retryBtn, { borderColor: C.accent }]}><Text style={{ color: C.accent, fontWeight: '700', fontSize: 13 }}>Privacy Settings</Text></Pressable></View>}
        {online && ipInfoState === 'ready' && ipInfo && (
          <>
            <Row icon="git-network-outline" label="Connected via" value={connectedVia ?? 'Unavailable'} />
            <Row icon="navigate-outline" label="Server location" value={serverCity ?? 'Unavailable'} />
            <Row icon="business-outline" label="Your network" value={`${ipInfo.isp} (${ipInfo.asn})`} />
            <Row icon="globe-outline" label="Your IP address" value={ipInfo.ip} />
          </>
        )}
        <Note>Network details come from an external IP lookup service. Netora never stores or uploads this information.</Note>
      </Card>

      <Card>
        <Text style={[styles.cardTitle, { color: C.text }]}>Additional details</Text>
        <DetailSection icon="wifi-outline" title="Wi-Fi">
          <Row icon="key-outline" label="SSID" value={unavailable(network.ssid)} />
          <Row icon="finger-print-outline" label="BSSID" value={unavailable(network.bssid)} />
          <Row icon="pulse-outline" label="Frequency" value={unavailable(network.frequency)} />
          <Row icon="git-branch-outline" label="Channel" value={unavailable(network.channel)} />
          <Row icon="radio-outline" label="Signal strength" value={network.signal != null ? `${network.signal}%` : unavailable(null)} />
          <Row icon="speedometer-outline" label="Link speed" value={unavailable(network.linkSpeed)} />
        </DetailSection>
        <DetailSection icon="phone-portrait-outline" title="Mobile network">
          <Row icon="business-outline" label="Carrier" value={unavailable(network.carrier ?? (network.type === 'Mobile data' ? ipInfo?.isp : null))} />
          <Row icon="cellular-outline" label="Network type" value={network.type === 'Mobile data' ? 'Mobile data' : 'Not active'} />
          <Row icon="analytics-outline" label="Generation" value={unavailable(network.networkGeneration)} />
          <Row icon="radio-outline" label="Signal strength" value={network.signal != null ? `${network.signal}%` : unavailable(null)} />
        </DetailSection>
        <DetailSection icon="globe-outline" title="Internet">
          <Row icon="git-network-outline" label="IPv4" value={online ? unavailable(ipInfo?.ipv4 ?? network.ipv4) : 'Unavailable'} />
          <Row icon="git-branch-outline" label="IPv6" value={online ? unavailable(ipInfo?.ipv6 ?? network.ipv6) : 'Unavailable'} />
          <Row icon="server-outline" label="DNS" value={unavailable(network.dns)} />
          <Row icon="home-outline" label="Gateway" value={unavailable(network.gateway)} />
          <Row icon="pulse-outline" label="Connection state" value={network.connected ? 'Connected' : 'Disconnected'} />
        </DetailSection>
        <Note>Some fields need Android location permission and device support.</Note>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusCard: { gap: 14 },
  statusLine: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  dot: { width: 9, height: 9, borderRadius: 4.5 },
  statusText: { fontWeight: '700', fontSize: 16, flex: 1 },
  statusMeta: { flexDirection: 'row', gap: 24 },
  statusMetaItem: { gap: 3, flex: 1 },
  metaValue: { fontSize: 14, fontWeight: '700' },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  change: { paddingVertical: 4, paddingHorizontal: 8 },
  mapEmpty: { height: 220, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 10 },
  mapEmptyText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  serverLine: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 13, borderBottomWidth: 1 },
  serverCity: { fontSize: 15, fontWeight: '700', flex: 1 },
  note: { fontSize: 11, lineHeight: 16, marginTop: 12 },
  loadingLine: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14 },
  loadingText: { fontSize: 13 },
  errorLine: { gap: 12, paddingVertical: 14 },
  errorText: { fontSize: 13, fontWeight: '600' },
  retryBtn: { alignSelf: 'flex-start', borderRadius: 18, borderWidth: 1.5, paddingHorizontal: 18, paddingVertical: 7 },
  section: { borderBottomWidth: 1 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 11, minHeight: 50 },
  sectionTitle: { flex: 1, fontSize: 14, fontWeight: '700' },
  sectionBody: { paddingBottom: 8 },
});
