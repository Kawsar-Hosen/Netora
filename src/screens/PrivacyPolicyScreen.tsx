import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Header, Screen } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { colorsFor } from '@/theme/theme';

const sections = [
  ['Information Netora handles', 'Netora reads Android network state to identify whether Wi-Fi, mobile data or no internet is active. When Android makes fields available, Netora may display Wi-Fi signal, link speed, frequency, channel, local IP, mobile carrier and network generation. Speed tests measure download throughput, upload throughput, ping, jitter and failed latency samples used as packet loss.'],
  ['Optional Wi-Fi identifiers', 'Wi-Fi SSID and BSSID require Android foreground location permission. Netora requests this permission only after you choose Enable Wi-Fi name access in Privacy Settings. Netora does not request or read GPS coordinates. Denying permission does not affect speed tests, mobile data support or other network diagnostics.'],
  ['External network details', 'When Public network details is enabled, Netora contacts IP lookup services to display your public IP, IP version, ISP, ASN and approximate IP-derived city/country. This information is held in memory for the current connection and is not written to Netora history. You can disable these lookups at any time.'],
  ['Speed-test server and map', 'Speed testing uses speed.cloudflare.com. Cloudflare Anycast chooses the edge that answers on your current network. Netora reads the returned edge code and may contact airport-data.com to resolve that code to a city and map coordinates. The interactive map loads Leaflet resources and CARTO/OpenStreetMap map tiles. Server location is not your physical GPS location.'],
  ['Local storage', 'Test history and preferences are stored locally on your device using AsyncStorage. History contains measured speeds, latency results, connection type/name and the responding server label. Netora has no account system and no Netora backend. You can delete individual history items or clear all history.'],
  ['Sharing, advertising and analytics', 'Netora contains no advertising SDK, behavioral analytics SDK or tracking SDK. Netora does not sell personal information. External infrastructure providers necessarily receive your public IP and standard request metadata when your device contacts their service; their handling is governed by their own policies.'],
  ['Security and retention', 'Netora uses HTTPS for network lookups, speed tests, edge resolution and map resources. Public IP/ISP/ASN lookup results are not persisted by Netora. Locally stored history remains until you delete it or uninstall/clear application data. No secret API keys are embedded in the app.'],
  ['Children and changes', 'Netora is a general network utility and is not directed to children. This policy may be updated when features or service providers change. The effective date shown below identifies this version.'],
  ['Contact', 'Before Google Play publication, the developer must add a monitored support email and public HTTPS Privacy Policy URL to the store listing and hosted policy.'],
] as const;

export default function PrivacyPolicyScreen() {
  const { dark } = useApp(); const C = colorsFor(dark);
  return <Screen><Header title="Privacy Policy" subtitle="Effective August 15, 2026" /><Card><Text style={[styles.lead, { color: C.text }]}>Netora is designed for local-first network diagnostics. This policy describes what the Android app reads, what leaves the device, and what is stored.</Text></Card>{sections.map(([title, body]) => <View key={title} style={styles.section}><Text style={[styles.title, { color: C.text }]}>{title}</Text><Text style={[styles.body, { color: C.subtext }]}>{body}</Text></View>)}</Screen>;
}

const styles = StyleSheet.create({
  lead: { fontSize: 14, lineHeight: 22, fontWeight: '600' },
  section: { marginHorizontal: 20, marginBottom: 22 },
  title: { fontSize: 15, fontWeight: '800', marginBottom: 7 },
  body: { fontSize: 13, lineHeight: 21 },
});
