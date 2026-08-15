import type { SpeedUnit } from '@/types/models';

export function displaySpeed(value: number | null, unit: SpeedUnit): string {
  if (value == null) return '--';
  const converted = unit === 'MB/s' ? value / 8 : value;
  return converted.toFixed(1);
}
