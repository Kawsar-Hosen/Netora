import { fetch as expoFetch } from 'expo/fetch';
import type { TestServerInfo } from '@/types/models';

export interface IpInfo {
  ip: string;
  version: 'IPv4' | 'IPv6';
  ipv4: string | null;
  ipv6: string | null;
  isp: string;
  asn: string;
  org: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  colo: string | null;
}

interface Lookup {
  ip: string;
  version: 'IPv4' | 'IPv6';
  isp: string;
  asn: string;
  org: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
}

async function withTimeout(url: string, timeout = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try { return await expoFetch(url, { signal: controller.signal }); } finally { clearTimeout(timer); }
}

async function parseJson(url: string): Promise<Record<string, unknown>> {
  const response = await withTimeout(url);
  if (!response.ok) throw new Error('IP lookup failed');
  const text = await response.text();
  return JSON.parse(text) as Record<string, unknown>;
}

function asOrg(org: string): { asn: string; isp: string; org: string } {
  const match = org.match(/\bAS(\d+)\b/);
  if (!match) return { asn: 'Unavailable', isp: org.trim() || 'Unknown provider', org };
  const asn = `AS${match[1]}`;
  const isp = org.replace(/\s*AS\d+\s*/, '').trim() || 'Unknown provider';
  return { asn, isp, org };
}

function toVersion(version: string): 'IPv4' | 'IPv6' {
  return version === '6' || version.toLowerCase().includes('ipv6') ? 'IPv6' : 'IPv4';
}

async function fromIpapi(): Promise<Lookup> {
  const data = await parseJson('https://ipapi.co/json/');
  const org = asOrg(String(data.org ?? ''));
  return {
    ip: String(data.ip ?? ''), version: toVersion(String(data.version ?? '4')), isp: org.isp, asn: org.asn, org: org.org,
    city: String(data.city ?? ''), region: String(data.region ?? ''), country: String(data.country ?? data.country_name ?? ''), countryCode: String(data.country_code ?? '').toUpperCase(),
    lat: Number(data.latitude), lon: Number(data.longitude),
  };
}

async function fromIpwho(): Promise<Lookup> {
  const data = await parseJson('https://ipwho.is/');
  if (data.success === false) throw new Error('IP lookup failed');
  const connection = (data.connection ?? {}) as { asn?: number | string; org?: string; isp?: string };
  const isp = String(connection.isp ?? connection.org ?? '');
  const org = asOrg(isp);
  return {
    ip: String(data.ip ?? ''), version: toVersion(String(data.version ?? '4')), isp: org.isp, asn: String(connection.asn ? `AS${connection.asn}` : 'Unavailable'), org: isp,
    city: String(data.city ?? ''), region: String(data.region ?? ''), country: String(data.country ?? ''), countryCode: String(data.country_code ?? '').toUpperCase(),
    lat: Number(data.latitude), lon: Number(data.longitude),
  };
}

async function fromIpinfo(): Promise<Lookup> {
  const data = await parseJson('https://ipinfo.io/json');
  const org = asOrg(String(data.org ?? ''));
  const loc = String(data.loc ?? '0,0').split(',');
  return {
    ip: String(data.ip ?? ''), version: 'IPv4', isp: org.isp, asn: org.asn, org: org.org,
    city: String(data.city ?? ''), region: String(data.region ?? ''), country: String(data.country ?? ''), countryCode: String(data.country ?? '').toUpperCase(),
    lat: Number(loc[0]), lon: Number(loc[1]),
  };
}

async function fetchTrace(): Promise<{ ipv4?: string; ipv6?: string; loc?: string }> {
  try {
    const response = await withTimeout('https://www.cloudflare.com/cdn-cgi/trace', 6000);
    if (!response.ok) return {};
    const text = await response.text();
    const kv: Record<string, string> = {};
    for (const line of text.split('\n')) { const index = line.indexOf('='); if (index > 0) kv[line.slice(0, index).trim()] = line.slice(index + 1).trim(); }
    return { ipv4: kv.ipv4 || undefined, ipv6: kv.ipv6 || undefined, loc: kv.colo || undefined };
  } catch { return {}; }
}

export async function fetchCurrentEdge(): Promise<TestServerInfo | null> {
  try {
    const response = await withTimeout(`https://speed.cloudflare.com/__down?bytes=0&t=${Date.now()}`, 6000);
    if (!response.ok) return null;
    return resolveEdgeLocation(edgeFromHeaders(response.headers));
  } catch { return null; }
}

export function edgeFromHeaders(headers: Headers): TestServerInfo | null {
  const get = (...names: string[]) => names.map(name => headers.get(name)).find(Boolean) ?? null;
  const colo = get('colo', 'cf-meta-colo');
  if (!colo) return null;
  return { name: 'Cloudflare Edge', city: null, country: null, countryCode: null, colo, asn: null, ip: null, lat: null, lon: null };
}

export async function resolveEdgeLocation(server: TestServerInfo | null): Promise<TestServerInfo | null> {
  if (!server?.colo) return server;
  try {
    const data = await parseJson(`https://airport-data.com/api/ap_info.json?iata=${encodeURIComponent(server.colo)}`);
    if (Number(data.status) !== 200) return server;
    const lat = Number(data.latitude); const lon = Number(data.longitude);
    return { ...server, city: String(data.location ?? '') || null, country: String(data.country ?? '') || null, countryCode: String(data.country_code ?? '') || null, lat: Number.isFinite(lat) ? lat : null, lon: Number.isFinite(lon) ? lon : null };
  } catch { return server; }
}

export async function fetchIpInfo(): Promise<IpInfo> {
  const trace = await fetchTrace();
  const providers = [fromIpapi, fromIpwho, fromIpinfo];
  let lookup: Lookup | null = null; let lastError: unknown = null;
  for (const provider of providers) {
    try { lookup = await provider(); break; } catch (error) { lastError = error; }
  }
  if (!lookup) throw lastError instanceof Error ? lastError : new Error('Could not reach the IP lookup service.');
  const version = lookup.version === 'IPv6';
  const ipv4 = version ? (trace.ipv4 ?? null) : lookup.ip;
  const ipv6 = version ? lookup.ip : (trace.ipv6 ?? null);
  return { ...lookup, ipv4, ipv6, colo: trace.loc ?? null };
}
