import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useApp } from '@/context/AppContext';
import { colorsFor } from '@/theme/theme';

function buildMapHtml(lat: number, lon: number, label: string, dark: boolean, accent: string): string {
  const tiles = dark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  const background = dark ? '#182330' : '#e4ebe7';
  const labelEscaped = label.replace(/'/g, "\\'");
  return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"><style>html,body,#map{height:100%;width:100%;margin:0;padding:0}.leaflet-container{background:${background};font-family:Roboto,sans-serif}${dark ? '.leaflet-tile{filter:brightness(.85) contrast(1.05)}' : ''}.npin{background:transparent;border:none}</style></head><body><div id="map"></div><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script><script>var map=L.map('map',{center:[${lat},${lon}],zoom:6,attributionControl:true,zoomControl:false});L.control.zoom({position:'topright'}).addTo(map);L.tileLayer('${tiles}',{subdomains:'abcd',maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'}).addTo(map);var pin=L.divIcon({className:'npin',iconSize:[34,34],iconAnchor:[17,34],html:'<svg width="34" height="34" viewBox="0 0 24 24"><path d="M12 1.6C7.6 1.6 4 5.2 4 9.6c0 5.6 8 12.8 8 12.8s8-7.2 8-12.8c0-4.4-3.6-8-8-8z" fill="${accent}"/><circle cx="12" cy="9.4" r="2.8" fill="#ffffff"/></svg>'});L.marker([${lat},${lon}],{icon:pin,title:'${labelEscaped}'}).addTo(map);<\/script></body></html>`;
}

export default function ServerMap({ lat, lon, label, height = 220 }: { lat: number; lon: number; label: string; height?: number }) {
  const { dark } = useApp(); const C = colorsFor(dark);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timer.current = setTimeout(() => setFailed(true), 20000);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [attempt, lat, lon, dark]);

  const html = useMemo(() => buildMapHtml(lat, lon, label, dark, C.accent), [lat, lon, label, dark, C.accent]);
  const clearTimer = () => { if (timer.current) clearTimeout(timer.current); };

  return (
    <View style={[styles.container, { height, backgroundColor: C.surface }]}>
      {failed ? (
        <View style={styles.center}>
          <Ionicons name="map-outline" size={30} color={C.subtext} />
          <Text style={[styles.failText, { color: C.subtext }]}>Map could not load</Text>
          <Pressable accessibilityRole="button" onPress={() => { setLoading(true); setFailed(false); setAttempt(a => a + 1); }} style={[styles.retry, { borderColor: C.accent }]}>
            <Text style={{ color: C.accent, fontWeight: '700', fontSize: 13 }}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <WebView
            key={`${lat}-${lon}-${attempt}-${dark ? 'd' : 'l'}`}
            source={{ html }}
            style={styles.map}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            scrollEnabled
            setSupportMultipleWindows={false}
            onLoadStart={() => setLoading(true)}
            onError={() => { clearTimer(); setFailed(true); }}
            onHttpError={() => { clearTimer(); setFailed(true); }}
            onLoadEnd={() => { clearTimer(); setLoading(false); }}
          />
          {loading && (
            <View style={[styles.center, styles.overlay]}>
              <ActivityIndicator color={C.accent} />
              <Text style={[styles.failText, { color: C.subtext }]}>Loading map…</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden', borderRadius: 12, width: '100%' },
  map: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  failText: { fontSize: 13, fontWeight: '600' },
  retry: { borderRadius: 18, borderWidth: 1.5, paddingHorizontal: 18, paddingVertical: 7 },
});
