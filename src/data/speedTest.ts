import { fetch as expoFetch } from 'expo/fetch';
import { readNetwork } from '@/data/network';
import { edgeFromHeaders, fetchCurrentEdge, resolveEdgeLocation } from '@/data/ipInfo';
import type { TestServerInfo } from '@/types/models';

const EDGE = 'https://speed.cloudflare.com';
const WINDOW_MS = 1200;
const MAX_SAMPLE_MBPS = 200;
const STREAMS = 3;
const SEGMENT_BYTES = 10_000_000;
const WARMUP_BYTES = 2_000_000;

type Stage = 'ping' | 'download' | 'upload';

async function withTimeout(url: string, init: Parameters<typeof expoFetch>[1] = {}, timeout = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try { return await expoFetch(url, { ...init, signal: controller.signal }); }
  finally { clearTimeout(timer); }
}

async function latencySamples(count = 5) {
  const values: number[] = []; let failed = 0;
  for (let i = 0; i < count; i += 1) {
    const started = performance.now();
    try {
      const response = await withTimeout(`${EDGE}/__down?bytes=0&t=${Date.now()}-${i}`, {}, 4000);
      if (!response.ok) throw new Error('Latency endpoint unavailable');
      await response.arrayBuffer(); values.push(performance.now() - started);
    } catch { failed += 1; }
  }
  if (!values.length) throw new Error('The test server did not respond.');
  const ping = values.reduce((sum, value) => sum + value, 0) / values.length;
  const jitter = values.length > 1 ? values.slice(1).reduce((sum, value, index) => sum + Math.abs(value - values[index]), 0) / (values.length - 1) : 0;
  return { ping, jitter, packetLoss: failed / count * 100 };
}

async function discardDownload(bytes: number) {
  const response = await withTimeout(`${EDGE}/__down?bytes=${bytes}&t=${Date.now()}`, {}, 15000);
  if (!response.ok) throw new Error('Download measurement failed.');
  if (response.body) { const reader = response.body.getReader(); while (!(await reader.read()).done) { /* drain */ } }
}

async function downloadMbps(onSample: (mbps: number) => void) {
  await discardDownload(WARMUP_BYTES);
  const start = performance.now();
  const livePoints: { t: number; bytes: number }[] = [];
  const allPoints: { t: number; bytes: number }[] = [];
  let totalReceived = 0;
  let server: TestServerInfo | null = null;
  const runStream = async (seed: number) => {
    const response = await withTimeout(`${EDGE}/__down?bytes=${SEGMENT_BYTES}&t=${Date.now()}-${seed}`, {}, 25000);
    if (!response.ok) throw new Error('Download measurement failed.');
    server = server ?? edgeFromHeaders(response.headers);
    if (!response.body) throw new Error('Streaming download is not supported on this device.');
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalReceived += value.byteLength;
      const t = performance.now() - start;
      const point = { t, bytes: totalReceived };
      livePoints.push(point); allPoints.push(point);
      const cutoff = t - WINDOW_MS;
      while (livePoints.length > 1 && livePoints[0].t < cutoff) livePoints.shift();
      const first = livePoints[0]; const last = livePoints[livePoints.length - 1];
      if (last.t > first.t) onSample((last.bytes - first.bytes) * 8 / ((last.t - first.t) / 1000) / 1_000_000);
    }
  };
  await Promise.all(Array.from({ length: STREAMS }, (_, i) => runStream(i)));
  const totalSeconds = (performance.now() - start) / 1000;
  const steady = allPoints.filter(point => point.t >= totalSeconds * 1000 * 0.35);
  if (steady.length >= 2) {
    const first = steady[0]; const last = steady[steady.length - 1];
    return { mbps: (last.bytes - first.bytes) * 8 / ((last.t - first.t) / 1000) / 1_000_000, server };
  }
  return { mbps: totalReceived * 8 / totalSeconds / 1_000_000, server };
}

async function uploadMbps(onSample: (mbps: number) => void) {
  const chunk = 'n'.repeat(1_000_000);
  const start = performance.now(); let sent = 0;
  for (let i = 0; i < 8; i += 1) {
    const before = performance.now();
    const response = await withTimeout(`${EDGE}/__up`, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: chunk }, 20000);
    if (!response.ok) throw new Error('Upload measurement failed.');
    await response.arrayBuffer();
    const seconds = (performance.now() - before) / 1000;
    sent += chunk.length;
    if (seconds > 0) onSample(chunk.length * 8 / seconds / 1_000_000);
  }
  return sent * 8 / ((performance.now() - start) / 1000) / 1_000_000;
}

export async function measureConnection(
  onStage: (stage: Stage, progress: number) => void,
  onSample: (metric: 'download' | 'upload', mbps: number) => void,
) {
  const before = await readNetwork();
  if (!before.connected) throw new Error('No internet connection.');
  onStage('ping', 0.08); const latency = await latencySamples();
  onStage('download', 0.35); const downloadResult = await downloadMbps(mbps => onSample('download', mbps));
  onStage('upload', 0.72); const upload = await uploadMbps(mbps => onSample('upload', mbps));
  const after = await readNetwork();
  if (!after.connected || after.type !== before.type) throw new Error('The network changed during the test. Try again on a stable connection.');
  const server = downloadResult.server ? await resolveEdgeLocation(downloadResult.server) : await fetchCurrentEdge();
  return { download: downloadResult.mbps, upload, server, ...latency };
}

export function speedScale(mbps: number | null): number {
  if (mbps == null) return 0;
  return Math.min(1, Math.max(0, mbps / MAX_SAMPLE_MBPS));
}
