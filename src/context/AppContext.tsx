import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { readNetwork } from '@/data/network';
import { fetchCurrentEdge, fetchIpInfo, type IpInfo } from '@/data/ipInfo';
import { measureConnection } from '@/data/speedTest';
import type { NetworkSnapshot, SpeedResult, SpeedUnit, TestServerInfo, TestState, ThemeMode } from '@/types/models';

const initialTest: TestState = { phase: 'idle', progress: 0, metric: 'download', download: null, upload: null, ping: null, jitter: null, packetLoss: null, error: null, server: null };
type ContextValue = { dark: boolean; theme: ThemeMode; setTheme: (v: ThemeMode) => void; unit: SpeedUnit; setUnit: (v: SpeedUnit) => void; network: NetworkSnapshot; history: SpeedResult[]; test: TestState; currentServer: TestServerInfo | null; selectedServer: string; setSelectedServer: (v: string) => void; externalNetworkInfo: boolean; setExternalNetworkInfo: (v: boolean) => void; runTest: () => void; removeResult: (id: string) => void; clearHistory: () => void; refreshNetwork: () => void; ipInfo: IpInfo | null; ipInfoState: 'disabled' | 'loading' | 'ready' | 'error'; refreshIpInfo: () => void; };
const fallback: NetworkSnapshot = { name: 'Checking connection', type: 'Unknown', connected: false, localIp: null, gateway: null, dns: null, ipv4: null, ipv6: null, signalDbm: null, signal: null, linkSpeed: null, carrier: null, cellularGeneration: null, ssid: null, bssid: null, frequency: null, channel: null, internetReachable: null, networkGeneration: null };
const AppContext = createContext<ContextValue | null>(null);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme(); const [theme, setTheme] = useState<ThemeMode>('system'); const [unit, setUnit] = useState<SpeedUnit>('Mbps'); const [network, setNetwork] = useState(fallback); const [history, setHistory] = useState<SpeedResult[]>([]); const [test, setTest] = useState(initialTest); const [currentServer, setCurrentServer] = useState<TestServerInfo | null>(null); const [selectedServer, setSelectedServer] = useState('auto'); const [externalNetworkInfo, setExternalNetworkInfoState] = useState(true); const externalNetworkInfoRef = useRef(true); const [ipInfo, setIpInfo] = useState<IpInfo | null>(null); const [ipInfoState, setIpInfoState] = useState<'disabled' | 'loading' | 'ready' | 'error'>('loading'); const previousConnection = useRef<string | null>(null); const requestId = useRef(0);
  const dark = theme === 'dark' || (theme === 'system' && system === 'dark');
  const refreshNetwork = () => { readNetwork().then(setNetwork).catch(() => setNetwork(fallback)); };
  const refreshIpInfo = () => { if (!externalNetworkInfoRef.current) { setIpInfo(null); setIpInfoState('disabled'); return; } setIpInfoState('loading'); fetchIpInfo().then(info => { setIpInfo(info); setIpInfoState('ready'); }).catch(() => { setIpInfoState('error'); }); };
  const setExternalNetworkInfo = (enabled: boolean) => { externalNetworkInfoRef.current = enabled; setExternalNetworkInfoState(enabled); if (!enabled) { setIpInfo(null); setIpInfoState('disabled'); } else refreshIpInfo(); };
  useEffect(() => {
    let active = true;
    const refreshForConnection = async () => {
      const id = ++requestId.current;
      const snapshot = await readNetwork().catch(() => fallback);
      if (!active || id !== requestId.current) return;
      const connectionKey = `${snapshot.type}|${snapshot.localIp ?? ''}|${snapshot.carrier ?? ''}|${snapshot.cellularGeneration ?? ''}`;
      if (previousConnection.current && previousConnection.current !== connectionKey) { setTest(initialTest); setCurrentServer(null); setIpInfo(null); }
      previousConnection.current = connectionKey;
      setNetwork(snapshot);
      if (!snapshot.connected || snapshot.internetReachable === false) {
        setIpInfo(null); setIpInfoState('error'); setCurrentServer(null); setTest(initialTest);
        return;
      }
      if (externalNetworkInfoRef.current) setIpInfoState('loading'); else { setIpInfo(null); setIpInfoState('disabled'); }
      Promise.allSettled([externalNetworkInfoRef.current ? fetchIpInfo() : Promise.resolve(null), fetchCurrentEdge()]).then(([infoResult, edgeResult]) => {
        if (!active || id !== requestId.current) return;
        if (externalNetworkInfoRef.current) { if (infoResult.status === 'fulfilled' && infoResult.value) { setIpInfo(infoResult.value); setIpInfoState('ready'); } else setIpInfoState('error'); }
        setCurrentServer(edgeResult.status === 'fulfilled' ? edgeResult.value : null);
      });
    };
    let unsubscribe: (() => void) | null = null;
    Promise.all([AsyncStorage.getItem('netora-history'), AsyncStorage.getItem('netora-preferences')]).then(([savedHistory, savedPreferences]) => { if (savedHistory) setHistory(JSON.parse(savedHistory)); if (savedPreferences) { const preferences = JSON.parse(savedPreferences) as { theme?: ThemeMode; unit?: SpeedUnit; externalNetworkInfo?: boolean }; if (preferences.theme) setTheme(preferences.theme); if (preferences.unit) setUnit(preferences.unit); const enabled = preferences.externalNetworkInfo !== false; externalNetworkInfoRef.current = enabled; setExternalNetworkInfoState(enabled); setSelectedServer('auto'); } }).catch(() => undefined).finally(() => { if (!active) return; refreshForConnection(); unsubscribe = NetInfo.addEventListener(() => { refreshForConnection(); }); });
    return () => { active = false; unsubscribe?.(); };
  }, []);
  useEffect(() => { AsyncStorage.setItem('netora-history', JSON.stringify(history)).catch(() => undefined); }, [history]);
  useEffect(() => { AsyncStorage.setItem('netora-preferences', JSON.stringify({ theme, unit, server: selectedServer, externalNetworkInfo })).catch(() => undefined); }, [externalNetworkInfo, selectedServer, theme, unit]);
  const runTest = async () => {
    if (test.phase === 'testing') return;
    setTest({ ...initialTest, phase: 'testing' });
    try {
      const result = await measureConnection(
        (metric, progress) => setTest(current => ({ ...current, metric, progress })),
        (metric, mbps) => setTest(current => ({ ...current, metric, download: metric === 'download' ? Number(mbps.toFixed(1)) : current.download, upload: metric === 'upload' ? Number(mbps.toFixed(1)) : current.upload })),
      );
      const rounded = { download: Number(result.download.toFixed(1)), upload: Number(result.upload.toFixed(1)), ping: Number(result.ping.toFixed(0)), jitter: Number(result.jitter.toFixed(1)), packetLoss: Number(result.packetLoss.toFixed(1)) };
      setCurrentServer(result.server); setTest({ phase: 'complete', progress: 1, metric: 'upload', ...rounded, error: null, server: result.server });
      const serverName = result.server ? [result.server.name, result.server.city, result.server.country, result.server.colo].filter(Boolean).join(' · ') : 'Unavailable';
      setHistory(h => [{ id: String(Date.now()), date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }), time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }), ...rounded, networkType: network.type, networkName: network.name, server: serverName }, ...h]);
    } catch (error) { setTest({ ...initialTest, phase: 'error', error: error instanceof Error ? error.message : 'The speed test failed.' }); }
  };
  const value = { dark, theme, setTheme, unit, setUnit, network, history, test, currentServer, selectedServer, setSelectedServer, externalNetworkInfo, setExternalNetworkInfo, runTest, removeResult: (id: string) => setHistory(h => h.filter(x => x.id !== id)), clearHistory: () => setHistory([]), refreshNetwork, ipInfo, ipInfoState, refreshIpInfo };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() { const value = useContext(AppContext); if (!value) throw new Error('useApp must be used within AppProvider'); return value; }
