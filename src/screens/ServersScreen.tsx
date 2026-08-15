import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '@/context/AppContext';
import { colorsFor } from '@/theme/theme';
import { Card, Header, Label, Pill, Screen } from '@/components/ui';

export default function ServersScreen() {
  const { dark, network, currentServer } = useApp();
  const C = colorsFor(dark);
  const location = currentServer ? [currentServer.city, currentServer.country].filter(Boolean).join(', ') || currentServer.colo || 'Unavailable' : 'Detected from the active connection';
  return (
    <Screen>
      <Header title="Test server" subtitle="Automatic edge selection for the active network" />
      <Card style={[styles.card, { borderColor: C.accent }]}>
        <View style={styles.line}>
          <View style={[styles.icon, { backgroundColor: C.line }]}><Ionicons name="flash-outline" size={20} color={C.accent} /></View>
          <View style={styles.copy}><Text style={[styles.name, { color: C.text }]}>Auto / Best Server</Text><Label>Routes to the available Cloudflare edge selected for this connection.</Label></View>
          <Pill>Active</Pill>
        </View>
        <View style={[styles.details, { borderTopColor: C.line }]}>
          <View><Label>Current edge</Label><Text style={[styles.value, { color: C.text }]}>{network.connected ? location : 'Unavailable'}</Text></View>
          <View><Label>Edge code</Label><Text style={[styles.value, { color: C.text }]}>{network.connected ? currentServer?.colo ?? 'Detecting…' : 'Unavailable'}</Text></View>
        </View>
      </Card>
      <Card><Text style={[styles.noteTitle, { color: C.text }]}>How selection works</Text><Text style={[styles.note, { color: C.subtext }]}>The test uses Cloudflare Anycast. Routing automatically chooses a healthy reachable edge based on the current Wi-Fi or mobile network. Netora reports the edge that actually answered; it does not pretend to pin the test to a city that the endpoint cannot guarantee.</Text></Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 2 },
  line: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 5 },
  name: { fontWeight: '800', fontSize: 16 },
  details: { flexDirection: 'row', gap: 24, borderTopWidth: 1, marginTop: 17, paddingTop: 15 },
  value: { fontSize: 13, fontWeight: '700', marginTop: 4 },
  noteTitle: { fontSize: 15, fontWeight: '800', marginBottom: 8 },
  note: { fontSize: 13, lineHeight: 20 },
});
