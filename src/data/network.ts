import * as Network from 'expo-network';
import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';
import type { NetworkSnapshot, NetworkType } from '@/types/models';

const channels5Ghz: Record<number, number> = { 5180: 36, 5200: 40, 5220: 44, 5240: 48, 5260: 52, 5280: 56, 5300: 60, 5320: 64, 5500: 100, 5520: 104, 5540: 108, 5560: 112, 5580: 116, 5600: 120, 5620: 124, 5640: 128, 5660: 132, 5680: 136, 5700: 140, 5720: 144, 5745: 149, 5765: 153, 5785: 157, 5805: 161, 5825: 165 };

function channelFromFrequency(frequency: number): string | null {
  if (frequency >= 2400 && frequency < 2500) return String(Math.round((frequency - 2407) / 5));
  const channel = channels5Ghz[frequency];
  return channel ? String(channel) : null;
}

export async function readNetwork(): Promise<NetworkSnapshot> {
  const [state, netInfo] = await Promise.all([Network.getNetworkStateAsync(), NetInfo.fetch().catch(() => null)]);
  const ip = await Network.getIpAddressAsync().catch(() => null);
  let locationGranted = false;
  try { locationGranted = (await Location.getForegroundPermissionsAsync()).granted; } catch { /* unavailable on some Expo clients */ }
  const connected = netInfo?.isConnected ?? state.isConnected ?? false;
  const type: NetworkType = !connected ? 'Offline' : netInfo?.type === 'wifi' || state.type === Network.NetworkStateType.WIFI ? 'Wi-Fi' : netInfo?.type === 'cellular' || state.type === Network.NetworkStateType.CELLULAR ? 'Mobile data' : 'Unknown';
  const wifi = netInfo?.type === 'wifi' ? netInfo.details : null;
  const cellular = netInfo?.type === 'cellular' ? netInfo.details : null;
  const ssid = locationGranted && wifi?.ssid && wifi.ssid !== 'unknown' ? wifi.ssid : null;
  const frequency = wifi?.frequency != null ? `${wifi.frequency} MHz` : null;
  const generation = cellular?.cellularGeneration ? (cellular.cellularGeneration === '4g' ? '4G LTE' : cellular.cellularGeneration.toUpperCase()) : null;
  return {
    name: type === 'Wi-Fi' ? (ssid ?? 'Connected Wi-Fi') : type,
    type,
    connected: Boolean(connected),
    localIp: wifi?.ipAddress ?? ip,
    gateway: null,
    dns: null,
    ipv4: ip,
    ipv6: null,
    signalDbm: null,
    signal: wifi?.strength ?? null,
    linkSpeed: wifi?.linkSpeed != null ? `${wifi.linkSpeed} Mbps` : null,
    carrier: cellular?.carrier ?? null,
    cellularGeneration: generation,
    ssid,
    bssid: locationGranted ? wifi?.bssid ?? null : null,
    frequency,
    channel: wifi?.frequency != null ? channelFromFrequency(wifi.frequency) : null,
    internetReachable: netInfo?.isInternetReachable ?? state.isInternetReachable ?? null,
    networkGeneration: generation,
  };
}

export function unavailable(value: string | null | undefined): string { return value ?? 'Unavailable on this device'; }
