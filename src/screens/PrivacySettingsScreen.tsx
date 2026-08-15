import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Card, Header, Row, Screen } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { colorsFor } from '@/theme/theme';

type PermissionState = 'checking' | 'granted' | 'denied';

export default function PrivacySettingsScreen() {
  const { dark, externalNetworkInfo, setExternalNetworkInfo, refreshNetwork, clearHistory } = useApp();
  const C = colorsFor(dark); const router = useRouter();
  const [permission, setPermission] = useState<PermissionState>('checking');

  useEffect(() => { Location.getForegroundPermissionsAsync().then(result => setPermission(result.granted ? 'granted' : 'denied')).catch(() => setPermission('denied')); }, []);

  const requestWifiAccess = async () => {
    const result = await Location.requestForegroundPermissionsAsync().catch(() => null);
    setPermission(result?.granted ? 'granted' : 'denied');
    if (result?.granted) refreshNetwork();
  };

  return (
    <Screen>
      <Header title="Privacy settings" subtitle="Control optional network information" />
      <Card>
        <View style={styles.settingRow}>
          <View style={[styles.icon, { backgroundColor: C.line }]}><Ionicons name="globe-outline" size={19} color={C.accent} /></View>
          <View style={styles.copy}><Text style={[styles.title, { color: C.text }]}>Public network details</Text><Text style={[styles.body, { color: C.subtext }]}>Use external lookup services to show public IP, ISP, ASN and approximate IP-based network region.</Text></View>
          <Switch value={externalNetworkInfo} onValueChange={setExternalNetworkInfo} trackColor={{ false: C.line, true: C.accent }} thumbColor={dark ? C.text : '#FFFFFF'} />
        </View>
        <Text style={[styles.note, { color: C.subtext }]}>Turning this off does not disable speed testing, automatic speed-test edge detection, or map tiles. Public IP/ISP/ASN fields become Unavailable.</Text>
      </Card>
      <Card>
        <Text style={[styles.title, { color: C.text }]}>Wi-Fi identifiers</Text>
        <Text style={[styles.body, { color: C.subtext }]}>Android requires foreground location permission before apps can read Wi-Fi SSID and BSSID. Netora never requests or reads GPS coordinates. This permission is optional.</Text>
        <View style={[styles.permission, { borderColor: C.line }]}><View style={[styles.statusDot, { backgroundColor: permission === 'granted' ? C.success : C.warning }]} /><Text style={[styles.permissionText, { color: C.text }]}>{permission === 'checking' ? 'Checking permission…' : permission === 'granted' ? 'Wi-Fi identifier access enabled' : 'Wi-Fi identifiers unavailable'}</Text></View>
        {permission !== 'granted' ? <Pressable accessibilityRole="button" onPress={requestWifiAccess} style={[styles.button, { backgroundColor: C.accent }]}><Text style={[styles.buttonText, { color: C.accentText }]}>Enable Wi-Fi name access</Text></Pressable> : <Pressable onPress={() => Linking.openSettings()}><Text style={[styles.link, { color: C.accent }]}>Manage in Android settings</Text></Pressable>}
      </Card>
      <Card>
        <Row icon="document-text-outline" label="Privacy Policy" value="Read policy" onPress={() => router.push('/privacy-policy')} />
        <Row icon="trash-outline" label="Clear local test history" value="Remove" onPress={clearHistory} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1 },
  title: { fontSize: 15, fontWeight: '800' },
  body: { fontSize: 12, lineHeight: 18, marginTop: 5 },
  note: { fontSize: 11, lineHeight: 17, marginTop: 14 },
  permission: { borderWidth: 1, borderRadius: 9, minHeight: 44, marginTop: 15, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 9 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  permissionText: { fontSize: 12, fontWeight: '700' },
  button: { minHeight: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  buttonText: { fontSize: 13, fontWeight: '800' },
  link: { fontSize: 13, fontWeight: '800', marginTop: 16 },
});
