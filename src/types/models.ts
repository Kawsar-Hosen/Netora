export type NetworkType = 'Wi-Fi' | 'Mobile data' | 'Offline' | 'Unknown';
export type TestPhase = 'idle' | 'testing' | 'complete' | 'error';
export type ThemeMode = 'light' | 'dark' | 'system';
export type SpeedUnit = 'Mbps' | 'MB/s';

export interface NetworkSnapshot {
  name: string;
  type: NetworkType;
  connected: boolean;
  localIp: string | null;
  gateway: string | null;
  dns: string | null;
  ipv4: string | null;
  ipv6: string | null;
  signalDbm: number | null;
  signal: number | null;
  linkSpeed: string | null;
  carrier: string | null;
  cellularGeneration: string | null;
  ssid: string | null;
  bssid: string | null;
  frequency: string | null;
  channel: string | null;
  internetReachable: boolean | null;
  networkGeneration: string | null;
}

export interface TestServerInfo { name: string; city: string | null; country: string | null; countryCode: string | null; colo: string | null; asn: string | null; ip: string | null; lat: number | null; lon: number | null; }
export interface Server { id: string; name: string; location: string; city: string; country: string; countryCode: string; lat: number; lon: number; latency: number; status: 'Recommended' | 'Available'; }
export interface SpeedResult { id: string; date: string; time: string; download: number; upload: number; ping: number; jitter: number; packetLoss: number; networkType: NetworkType; networkName: string; server: string; }
export interface TestState { phase: TestPhase; progress: number; metric: 'download' | 'upload' | 'ping'; download: number | null; upload: number | null; ping: number | null; jitter: number | null; packetLoss: number | null; error: string | null; server: TestServerInfo | null; }
